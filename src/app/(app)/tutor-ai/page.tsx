'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getChatMessages, sendChatMessage } from '@/lib/data/chat';
import { ChatMessage } from '@/types';

export default function AiTutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadChat() {
      const msgs = await getChatMessages();
      setMessages(msgs);
    }
    loadChat();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const handlePromptChipClick = (prompt: string) => {
    setInputText(prompt);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    const currentText = inputText;
    const currentAttachment = attachedFile ? { name: attachedFile.name, meta: attachedFile.size } : undefined;

    setInputText('');
    setAttachedFile(null);
    setIsSending(true);

    const { userMessage, assistantMessage } = await sendChatMessage(currentText, currentAttachment);
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsSending(false);
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setAttachedFile({ name: file.name, size: `${sizeMb} MB` });
    showToast(`Dokumen berhasil disematkan: ${file.name}`);
  };

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast('Merekam suara... Silakan berbicara');
    } else {
      setIsRecording(false);
      showToast('Rekaman suara selesai diproses');
      setInputText((prev) => (prev ? `${prev} [Transkripsi Suara]` : 'Jelaskan konsep dasar materi ini'));
    }
  };

  const promptChips = [
    { label: 'Rangkumkan Bab 3 Fisika', icon: 'summarize', color: 'secondary' },
    { label: 'Jelaskan Rumus Pythagoras dengan contoh', icon: 'square_foot', color: 'primary' },
    { label: 'Buat 5 Soal Latihan Ulangan Kimia', icon: 'quiz', color: 'secondary' },
    { label: 'Jelaskan konsep dari PDF Terakhir', icon: 'picture_as_pdf', color: 'tertiary' },
  ];

  return (
    <div className="flex flex-col w-full pb-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileAttach}
        accept=".pdf,image/*"
        className="hidden"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center gap-2 font-label-md text-label-md transition-all animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-primary-container">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AI Tutor Info Header Card */}
      <div className="px-margin pt-space-md pb-space-sm">
        <div className="p-space-md rounded-xl bg-surface-container flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="relative w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-surface flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
                  Studika AI Tutor
                </h2>
                <span className="px-1.5 py-0.5 rounded-full bg-secondary-fixed-dim text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
                  Akademik
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                Siap membantu belajar 24/7
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => showToast('Riwayat sesi chat dimuat')}
              aria-label="Riwayat Percakapan"
              className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">history</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Pengaturan mode tutor: Akademik Rigor')}
              aria-label="Pengaturan AI"
              className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">tune</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-margin py-space-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px] text-primary">
              tips_and_updates
            </span>
            Inspirasi Pertanyaan
          </span>
          <span className="font-code-sm text-code-sm text-outline">Geser • Ketuk</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePromptChipClick(chip.label)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-secondary-fixed/50 hover:bg-secondary-fixed text-on-secondary-fixed-variant font-label-md text-label-md flex items-center gap-1.5 transition-colors font-medium active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">
                {chip.icon}
              </span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread */}
      <div className="flex flex-col px-margin py-space-md gap-space-lg">
        <div className="flex items-center justify-center my-1">
          <span className="px-3 py-1 rounded-full bg-surface-container font-code-sm text-code-sm text-on-surface-variant text-center">
            Hari ini, 09:41 WIB • Catatan Terkait: Biologi_Sel_Mitosis.pdf
          </span>
        </div>

        {messages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div
                key={msg.id}
                className="flex flex-col items-end gap-1.5 max-w-[88%] self-end"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    Kamu
                  </span>
                  <span className="font-code-sm text-code-sm text-outline">
                    {msg.timestamp}
                  </span>
                </div>
                <div className="p-space-md rounded-2xl rounded-br-sm bg-primary-container text-on-primary shadow-sm">
                  <p className="font-body-md text-body-md leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
                {msg.attachmentName && (
                  <div className="flex items-center gap-1 text-on-surface-variant font-code-sm text-code-sm">
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      attach_file
                    </span>
                    <span>
                      {msg.attachmentName}{' '}
                      {msg.attachmentMeta ? `(${msg.attachmentMeta})` : ''}
                    </span>
                  </div>
                )}
              </div>
            );
          }

          // Assistant Response
          return (
            <div
              key={msg.id}
              className="flex flex-col items-start gap-2 max-w-[96%] sm:max-w-[90%] self-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                  <span className="material-symbols-outlined text-[14px]">neurology</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  Studika AI Tutor
                </span>
                <span className="font-code-sm text-code-sm text-outline">
                  {msg.timestamp}
                </span>
              </div>
              <div className="p-space-md sm:p-space-lg rounded-2xl rounded-bl-sm bg-surface-container-lowest text-on-surface shadow-sm space-y-space-md w-full border border-outline-variant/30">
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                  {msg.content}
                </p>

                {/* Structured Points */}
                {msg.points && (
                  <div className="space-y-2">
                    {msg.points.map((p) => (
                      <div key={p.num} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant font-label-sm text-label-sm shrink-0 mt-0.5 font-bold">
                          {p.num}
                        </span>
                        <div className="min-w-0">
                          <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                            {p.title}
                          </span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            {p.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comparison Table */}
                {msg.comparisonTable && (
                  <div className="rounded-xl overflow-hidden bg-secondary-fixed/30 p-2.5">
                    <div className="flex items-center gap-1.5 mb-2 px-1 text-secondary font-bold">
                      <span className="material-symbols-outlined text-[16px]">
                        table_chart
                      </span>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider">
                        Tabel Komparasi Singkat
                      </span>
                    </div>
                    <div className="w-full overflow-x-auto no-scrollbar">
                      <table className="w-full text-left font-body-sm text-body-sm">
                        <thead>
                          <tr className="text-on-secondary-fixed-variant font-label-md text-label-md border-none">
                            {msg.comparisonTable.headers.map((h, i) => (
                              <th key={i} className="py-1 px-2 font-semibold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-on-surface">
                          {msg.comparisonTable.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className={
                                rIdx % 2 === 0
                                  ? 'bg-surface-container-lowest/80 rounded-lg'
                                  : ''
                              }
                            >
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`py-1.5 px-2 ${
                                    cIdx === 0 ? 'font-medium' : ''
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Mnemonic / Key Formula Box */}
                {msg.keyFormula && (
                  <div className="p-space-md rounded-xl bg-tertiary-fixed/30 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                      key
                    </span>
                    <div className="min-w-0">
                      <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                        {msg.keyFormula.title}
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface mt-0.5">
                        {msg.keyFormula.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Interactive Action Chips */}
                <div className="pt-1 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('12 Kartu Flashcard dibuat di materi Biologi!')}
                    className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-all active:scale-95 font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px]">style</span>
                    <span>Buat Flashcard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Tersimpan di Vault: Ringkasan Mitosis vs Meiosis')}
                    className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-secondary font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-all active:scale-95 font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      bookmark_add
                    </span>
                    <span>Simpan ke Catatan Materi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputText('Bisa jelaskan lebih dalam mengenai fase pindah silang (crossing over)?');
                    }}
                    className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-all active:scale-95 font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      psychology_alt
                    </span>
                    <span>Tanya Lebih Dalam</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Floating Chat Input Bar */}
      <div className="px-margin pt-space-xs pb-space-sm sticky bottom-16 bg-surface/95 backdrop-blur-md">
        {attachedFile && (
          <div className="mb-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-surface-container-high max-w-fit shadow-sm">
            <div className="flex items-center gap-1.5 text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-primary">
                description
              </span>
              <span className="font-body-sm text-body-sm font-medium truncate max-w-[200px]">
                {attachedFile.name}
              </span>
              <span className="font-code-sm text-code-sm text-outline">
                {attachedFile.size}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              aria-label="Hapus file"
              className="ml-2 text-on-surface-variant hover:text-error flex items-center"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="flex items-end gap-2 p-1.5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30"
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Lampirkan Dokumen atau Foto Catatan"
            className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">attach_file</span>
          </button>
          <div className="flex-1 min-w-0 py-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              rows={1}
              placeholder="Tanyakan soal, tugas, atau konsep materi..."
              className="w-full resize-none bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-outline leading-relaxed max-h-24"
            />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleVoiceToggle}
              aria-label="Kirim Pesan Suara"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isRecording
                  ? 'bg-error text-on-error animate-pulse'
                  : 'bg-surface-container text-on-surface-variant hover:text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
            <button
              type="submit"
              disabled={isSending || (!inputText.trim() && !attachedFile)}
              aria-label="Kirim Pesan"
              className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
