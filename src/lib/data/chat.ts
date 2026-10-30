import { ChatMessage } from '@/types';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { mockChatMessages } from '@/lib/mock';

let inMemoryMessages = [...mockChatMessages];

export async function getChatMessages(): Promise<ChatMessage[]> {
  if (!isSupabaseConfigured()) {
    return [...inMemoryMessages];
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [...inMemoryMessages];
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);

    if (error || !data || data.length === 0) {
      return [...inMemoryMessages];
    }

    return data.map((msg) => {
      const msgDate = new Date(msg.created_at);
      const timestamp = `${msgDate.getHours().toString().padStart(2, '0')}:${msgDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      return {
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp,
        keyFormula:
          msg.role === 'assistant'
            ? {
                title: 'POIN PENTING & FORMULA',
                description: 'Verifikasi kembali relasi turunan parsial dan determinan matriks sebelum evaluasi.',
                badge: 'Tips Ringkas',
              }
            : undefined,
      };
    });
  } catch (err) {
    console.error('Gagal mengambil pesan obrolan:', err);
    return [...inMemoryMessages];
  }
}

export async function sendChatMessage(
  content: string,
  attachment?: { name: string; meta?: string }
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
  const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const userMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: 'user',
    content,
    timestamp,
    attachmentName: attachment?.name,
    attachmentMeta: attachment?.meta,
  };

  const assistantMessage: ChatMessage = {
    id: `msg-${Date.now() + 1}`,
    role: 'assistant',
    content: `Jawaban Studika AI: Terkait pertanyaanmu tentang "${content}", kamu dapat memecah persoalan ini menjadi langkah-langkah analitis berurutan.`,
    timestamp,
    keyFormula: {
      title: 'POIN PENTING',
      description: 'Selalu tinjau kembali definisi operasional dan catatan rumus sebelum memulai evaluasi.',
      badge: 'Tips Ringkas',
    },
  };

  if (!isSupabaseConfigured()) {
    inMemoryMessages = [...inMemoryMessages, userMessage, assistantMessage];
    return { userMessage, assistantMessage };
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Find or create session
      let sessionId: string | null = null;
      const { data: latestSession } = await supabase
        .from('chat_sessions')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestSession) {
        sessionId = latestSession.id;
      } else {
        const { data: newSession } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            title: content.slice(0, 30) || 'Diskusi Akademik',
          })
          .select('id')
          .single();
        sessionId = newSession?.id || null;
      }

      if (sessionId) {
        await supabase.from('chat_messages').insert([
          {
            session_id: sessionId,
            user_id: user.id,
            role: 'user',
            content,
          },
          {
            session_id: sessionId,
            user_id: user.id,
            role: 'assistant',
            content: assistantMessage.content,
          },
        ]);
      }
    }
  } catch (err) {
    console.error('Gagal mencatat chat ke Supabase:', err);
  }

  inMemoryMessages = [...inMemoryMessages, userMessage, assistantMessage];
  return { userMessage, assistantMessage };
}
