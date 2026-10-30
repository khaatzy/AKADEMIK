import { ChatMessage } from '@/types';
import { mockChatMessages } from '@/lib/mock';

let messagesStore = [...mockChatMessages];

export async function getChatMessages(): Promise<ChatMessage[]> {
  return Promise.resolve([...messagesStore]);
}

export async function sendChatMessage(
  content: string,
  attachment?: { name: string; meta?: string }
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
  const userMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: 'user',
    content,
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    attachmentName: attachment?.name,
    attachmentMeta: attachment?.meta,
  };

  const assistantMessage: ChatMessage = {
    id: `msg-${Date.now() + 1}`,
    role: 'assistant',
    content: `Jawaban dari Studika AI: Terkait pertanyaanmu tentang "${content}", konsep ini dapat dipahami dengan memecah problem ke dalam langkah-langkah terstruktur dan mengaitkannya dengan modul materi terkait.`,
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    keyFormula: {
      title: 'POIN PENTING',
      description: 'Selalu tinjau kembali definisi operasional dan catatan rumus sebelum memulai latihan.',
      badge: 'Tips Ringkas',
    },
  };

  messagesStore = [...messagesStore, userMessage, assistantMessage];
  return Promise.resolve({ userMessage, assistantMessage });
}
