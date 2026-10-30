'use server'

import { revalidatePath } from 'next/cache'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { chatMessageSchema } from '@/lib/validations'

export async function sendChatMessageAction(params: {
  sessionId?: string | null
  content: string
  attachmentFileId?: string | null
}) {
  const parsed = chatMessageSchema.safeParse(params)
  if (!parsed.success) {
    return { error: 'Format pesan tidak valid.', details: parsed.error.flatten() }
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      reply: 'Terima kasih atas pertanyaanmu! Integrasi model bahasa aktif segera setelah konfigurasi AI logic selesai.',
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Anda harus masuk terlebih dahulu.' }
  }

  let sessionId = parsed.data.sessionId

  // Create new session if none provided
  if (!sessionId) {
    const titleSnippet = parsed.data.content.slice(0, 35) + (parsed.data.content.length > 35 ? '...' : '')
    const { data: newSession, error: sessionErr } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: titleSnippet || 'Diskusi Akademik Baru',
      })
      .select('id')
      .single()

    if (sessionErr || !newSession) {
      return { error: 'Gagal membuat sesi diskusi baru.' }
    }
    sessionId = newSession.id
  }

  // Insert user message
  const { error: userMsgErr } = await supabase.from('chat_messages').insert({
    session_id: sessionId,
    user_id: user.id,
    role: 'user',
    content: parsed.data.content,
    attachment_file_id: parsed.data.attachmentFileId || null,
  })

  if (userMsgErr) {
    return { error: userMsgErr.message }
  }

  // Generate context-aware dummy AI reply (AI model integration will be handled in separate issue)
  const dummyReply = `Penjelasan mengenai "${parsed.data.content.slice(0, 40)}":
Konsep ini berkaitan langsung dengan pemodelan matematis dan analisis terstruktur. Pastikan untuk meninjau kembali definisi formal dan langkah-langkah pembuktian teorema pada materi bab ini.`

  const { data: aiMessage, error: aiMsgErr } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      user_id: user.id,
      role: 'assistant',
      content: dummyReply,
    })
    .select()
    .single()

  if (aiMsgErr) {
    return { error: aiMsgErr.message }
  }

  revalidatePath('/tutor-ai')
  return {
    success: true,
    sessionId,
    reply: aiMessage?.content || dummyReply,
    message: aiMessage,
  }
}
