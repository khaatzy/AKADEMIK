import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash') || searchParams.get('token')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/beranda'

  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'
  const redirectBase = isLocalEnv ? origin : (forwardedHost ? `https://${forwardedHost}` : origin)

  const supabase = await createClient()

  // Helper function to determine post-auth destination
  const getDestination = async (): Promise<string> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const meta = user?.user_metadata || {}
    const isProfileComplete = Boolean(meta.profile_completed || (meta.birth_date && meta.education_level))
    return isProfileComplete ? next : '/lengkapi-profil'
  }

  // 1. Email confirmation link via token_hash
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      const dest = await getDestination()
      return NextResponse.redirect(`${redirectBase}${dest}`)
    }
  }

  // 2. OAuth (Google) or PKCE auth code
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const dest = await getDestination()
      return NextResponse.redirect(`${redirectBase}${dest}`)
    }
  }

  // 3. Check if user already has an active session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    const dest = await getDestination()
    return NextResponse.redirect(`${redirectBase}${dest}`)
  }

  return NextResponse.redirect(`${redirectBase}/login?error=verification_failed`)
}
