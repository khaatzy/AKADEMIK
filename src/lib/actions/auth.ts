'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { loginSchema, registerSchema } from '@/lib/validations'

export interface AuthActionResult {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
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
    // Demo / offline mode fallback
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
    return {
      error: error.message === 'Invalid login credentials' 
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
  const rawNim = formData.get('nim')
  const rawProgramStudi = formData.get('programStudi') || formData.get('program_studi')
  const rawSemester = formData.get('semester')

  const parsed = registerSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
    fullName: rawFullName,
    nim: rawNim || undefined,
    programStudi: rawProgramStudi || undefined,
    semester: rawSemester ? Number(rawSemester) : 4,
  })

  if (!parsed.success) {
    return {
      error: 'Data registrasi tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        nim: parsed.data.nim || '220411100042',
        program_studi: parsed.data.programStudi || 'Teknik Informatika',
        semester: parsed.data.semester,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/beranda')
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
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
