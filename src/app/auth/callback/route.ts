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

  // 1. Email confirmation link via token_hash
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      return NextResponse.redirect(`${redirectBase}${next}?verified=true`)
    }
  }

  // 2. OAuth or PKCE auth code
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${redirectBase}${next}`)
    }
  }

  // 3. Check if user already has a valid session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    return NextResponse.redirect(`${redirectBase}${next}`)
  }

  return NextResponse.redirect(`${redirectBase}/login?error=verification_failed`)
}
