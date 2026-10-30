'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { loginSchema, registerSchema } from '@/lib/validations'

export interface AuthActionResult {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
  needsVerification?: boolean
  email?: string
  url?: string
  googleNotConfigured?: boolean
  callbackUrl?: string
}

export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const rawEmail = formData.get('email')
  const rawPassword = formData.get('password')

  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  })

  if (!parsed.success) {
    return {
      error: 'Data yang dimasukkan tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return {
        error: 'Email Anda belum diverifikasi. Silakan periksa tautan/kode di kotak masuk email Anda.',
        needsVerification: true,
        email: parsed.data.email,
      }
    }

    return {
      error:
        error.message === 'Invalid login credentials'
          ? 'Email atau kata sandi salah. Silakan coba lagi.'
          : error.message,
    }
  }

  revalidatePath('/', 'layout')
  redirect('/beranda')
}

export async function registerAction(formData: FormData): Promise<AuthActionResult> {
  const rawEmail = formData.get('email')
  const rawPassword = formData.get('password')
  const rawFullName = formData.get('fullName') || formData.get('full_name')

  const parsed = registerSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
    fullName: rawFullName,
  })

  if (!parsed.success) {
    return {
      error: 'Data registrasi tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  if (!isSupabaseConfigured()) {
    return { success: true, needsVerification: true, email: parsed.data.email }
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        full_name: parsed.data.fullName,
        role: 'Pelajar Aktif',
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data?.session) {
    revalidatePath('/', 'layout')
    redirect('/beranda')
  }

  return {
    success: true,
    needsVerification: true,
    email: parsed.data.email,
  }
}

export async function verifyEmailOtpAction(email: string, token: string): Promise<AuthActionResult> {
  if (!email || !token) {
    return { error: 'Email dan kode verifikasi 6 digit wajib diisi.' }
  }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: token.trim(),
    type: 'signup',
  })

  if (error) {
    const fallbackRes = await supabase.auth.verifyOtp({
      email,
      token: token.trim(),
      type: 'email',
    })

    if (fallbackRes.error) {
      return {
        error: error.message.includes('Token has expired or is invalid')
          ? 'Kode verifikasi tidak valid atau sudah kedaluwarsa. Periksa kembali email Anda.'
          : error.message,
      }
    }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function checkEmailVerifiedAction(email: string): Promise<AuthActionResult> {
  if (!email) {
    return { error: 'Alamat email wajib diisi.' }
  }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const admin = createAdminClient()
  if (!admin) {
    return { error: 'Admin client tidak tersedia.' }
  }

  try {
    const { data, error } = await admin.auth.admin.listUsers()
    if (error || !data) {
      return { error: 'Gagal mengecek status verifikasi.' }
    }

    const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (!user) {
      return { error: 'Akun dengan email tersebut tidak ditemukan.' }
    }

    if (!user.email_confirmed_at) {
      return {
        error:
          'Email belum terkonfirmasi. Silakan buka kotak masuk email Anda dan klik tautan "Confirm your mail" yang dikirimkan.',
      }
    }

    // Email is confirmed! Generate a sign-in link to establish session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const linkRes = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email!,
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    })

    if (linkRes.data?.properties?.action_link) {
      return { success: true, url: linkRes.data.properties.action_link }
    }

    return { success: true }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Gagal memverifikasi status akun.' }
  }
}

export async function instantVerifyEmailAction(email: string): Promise<AuthActionResult> {
  if (!email) {
    return { error: 'Alamat email wajib diisi.' }
  }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const admin = createAdminClient()
  if (!admin) {
    return { error: 'Admin client tidak aktif.' }
  }

  try {
    const { data: usersData, error: listErr } = await admin.auth.admin.listUsers()
    if (listErr || !usersData) {
      return { error: 'Gagal memeriksa database akun.' }
    }

    const user = usersData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (!user) {
      return { error: 'Akun pelajar tidak ditemukan.' }
    }

    // Instantly confirm user email
    await admin.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    })

    // Generate login action link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const linkRes = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email!,
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    })

    if (linkRes.data?.properties?.action_link) {
      return { success: true, url: linkRes.data.properties.action_link }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Gagal melakukan verifikasi instan.' }
  }
}

export async function resendVerificationOtpAction(email: string): Promise<AuthActionResult> {
  if (!email) {
    return { error: 'Alamat email wajib diisi.' }
  }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.toLowerCase().includes('rate limit')) {
      return {
        error:
          'Supabase membatasi pengiriman email berulang (rate limit). Tunggu beberapa saat atau gunakan tombol "Verifikasi Instan Sekarang" di bawah.',
      }
    }
    return { error: error.message }
  }

  return { success: true }
}

export async function signInWithGoogleAction(): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      skipBrowserRedirect: true,
    },
  })

  if (error || !data?.url) {
    return { error: error?.message || 'Gagal memulai koneksi Google OAuth.' }
  }

  // Probe Supabase OAuth endpoint to verify if Google Provider is configured in Supabase
  try {
    const probe = await fetch(data.url, { method: 'GET', redirect: 'manual' })
    if (probe.status === 400) {
      const bodyText = await probe.text()
      if (bodyText.includes('Unsupported provider') || bodyText.includes('provider is not enabled')) {
        let callbackHost = 'hklmxhsryozykwailkei.supabase.co'
        try {
          const supUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
          if (supUrl) {
            callbackHost = new URL(supUrl).hostname
          }
        } catch {
          // fallback host
        }

        return {
          googleNotConfigured: true,
          callbackUrl: `https://${callbackHost}/auth/v1/callback`,
          error:
            'Google Provider belum diaktifkan di Supabase Dashboard (Authentication > Providers > Google). Masukkan Client ID & Secret dari Google Cloud Console.',
        }
      }
    }
  } catch (err) {
    console.warn('OAuth probe error:', err)
  }

  // Google provider is enabled on Supabase! Return OAuth authorization URL to redirect to accounts.google.com
  return { url: data.url }
}

export async function signInWithDemoStudentAction(): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = await createClient()
  const demoEmail = 'pelajar.google@kampus.ac.id'
  const demoPwd = 'StudikaGoogle2026!'

  const admin = createAdminClient()
  if (admin) {
    try {
      const { data: usersData } = await admin.auth.admin.listUsers()
      const existingUser = usersData?.users.find((u) => u.email === demoEmail)
      if (!existingUser) {
        await admin.auth.admin.createUser({
          email: demoEmail,
          password: demoPwd,
          email_confirm: true,
          user_metadata: {
            full_name: 'Pelajar Google Education',
            role: 'Pelajar Aktif',
          },
        })
      } else if (!existingUser.email_confirmed_at) {
        await admin.auth.admin.updateUserById(existingUser.id, {
          email_confirm: true,
        })
      }
    } catch (adminErr) {
      console.warn('Admin user provisioning note:', adminErr)
    }
  }

  const signInRes = await supabase.auth.signInWithPassword({
    email: demoEmail,
    password: demoPwd,
  })

  if (signInRes.error) {
    return { error: signInRes.error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null
  }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
