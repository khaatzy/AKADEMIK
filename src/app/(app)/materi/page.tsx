'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getFiles, uploadSimulatedFile } from '@/lib/data/files';
import { createFileRecord, deleteFileRecord } from '@/lib/actions/files';
import { createClient } from '@/lib/supabase/client';
import { FileItem, FileKind } from '@/types';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export default function MaterialsVaultPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(100);
  const [uploadedFile, setUploadedFile] = useState<FileItem | null>({
    id: 'fil-4',
    name: 'Slide_Fisika_Bab4.pdf',
    courseName: 'Fisika',
    size: '4.2 MB',
    kind: 'pdf',
    uploadedAt: 'Selesai diunggah • 100% Selesai',
    pageCount: 18,
  });
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      const data = await getFiles(activeFilter);
      setFiles(data);
    }
    fetchFiles();
  }, [activeFilter]);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 1. Client-side Validation (Size & Type)
    if (selectedFile.size > MAX_FILE_SIZE) {
      showToast('Ukuran berkas melebihi batas maksimal 25 MB.', true);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const isValidType =
      ALLOWED_MIME_TYPES.includes(selectedFile.type) ||
      selectedFile.name.endsWith('.pdf') ||
      selectedFile.name.endsWith('.docx') ||
      selectedFile.name.endsWith('.pptx') ||
      selectedFile.name.endsWith('.xlsx');

    if (!isValidType) {
      showToast(
        'Format berkas tidak didukung. Harap unggah PDF, Dokumen Office, atau Gambar.',
        true
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    const isImage = selectedFile.type.startsWith('image/');
    const kind: FileKind = isImage ? 'image' : 'pdf';

    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      // Progress animation
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) {
            clearInterval(interval);
            return 85;
          }
          return prev + 25;
        });
      }, 120);

      if (user) {
        // Upload directly from browser to Supabase Storage with user session & RLS
        const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `${user.id}/${Date.now()}-${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from('vault')
          .upload(storagePath, selectedFile);

        clearInterval(interval);

        if (uploadError) {
          setIsUploading(false);
          showToast(`Gagal mengunggah ke penyimpanan: ${uploadError.message}`, true);
          return;
        }

        setUploadProgress(95);

        // Record metadata via Server Action
        const recordRes = await createFileRecord({
          name: selectedFile.name,
          storage_path: storagePath,
          mime_type: selectedFile.type || 'application/octet-stream',
          size_bytes: selectedFile.size,
          kind: isImage ? 'image' : 'document',
        });

        if (recordRes.error) {
          setIsUploading(false);
          showToast(recordRes.error, true);
          return;
        }

        setUploadProgress(100);
        setIsUploading(false);

        const newFileItem: FileItem = {
          id: recordRes.file?.id || `fil-${Date.now()}`,
          name: selectedFile.name,
          courseName: 'Materi Kuliah',
          size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          kind,
          uploadedAt: 'Baru saja diunggah',
          pageCount: isImage ? undefined : 12,
          storagePath,
        };

        setUploadedFile(newFileItem);
        setFiles((prev) => [newFileItem, ...prev]);
        showToast(`Berkas "${selectedFile.name}" berhasil diunggah ke Vault!`);
      } else {
        // Fallback demo/preview mode
        setTimeout(async () => {
          clearInterval(interval);
          setUploadProgress(100);
          setIsUploading(false);

          const newFile = await uploadSimulatedFile({
            name: selectedFile.name,
            size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            kind,
            courseName: 'Akademik',
          });

          setUploadedFile(newFile);
          setFiles((prev) => [newFile, ...prev]);
          showToast(`Berkas "${selectedFile.name}" berhasil diunggah ke Vault!`);
        }, 800);
      }
    } catch (err: unknown) {
      setIsUploading(false);
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah berkas.';
      showToast(message, true);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = async (file: FileItem) => {
    if (!confirm(`Hapus berkas "${file.name}" dari Vault?`)) return;

    const res = await deleteFileRecord(file.id);
    if (res.error) {
      showToast(res.error, true);
      return;
    }

    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    if (uploadedFile?.id === file.id) {
      setUploadedFile(null);
    }
    showToast(`Berkas "${file.name}" berhasil dihapus.`);
  };

  const handleDownloadFile = (file: FileItem) => {
    if (file.previewUrl) {
      window.open(file.previewUrl, '_blank');
    } else {
      showToast(`Mengunduh berkas ${file.name}...`);
    }
  };

  const filterTabs = [
    'Semua',
    'PDF Modul',
    'Foto Catatan',
    'Rangkuman AI',
    'Rumus Praktis',
  ];

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 font-label-md text-label-md transition-all animate-bounce ${
            toastMessage.isError
              ? 'bg-error text-on-error'
              : 'bg-inverse-surface text-inverse-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {toastMessage.isError ? 'warning' : 'check_circle'}
          </span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.docx,.pptx,.xlsx,.txt,image/*"
        className="hidden"
      />

      {/* Header Section */}
      <div className="px-margin pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-primary tracking-wider uppercase font-bold">
              Vault Pengetahuan
            </p>
            <h1 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Pusat Materi &amp; Catatan
            </h1>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-high px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-secondary text-[16px]">
              cloud_done
            </span>
            <span className="font-code-sm text-code-sm text-on-surface font-medium">
              {files.length} Berkas
            </span>
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Unggah modul atau jepret catatan papan tulis untuk diekstrak AI otomatis ke penyimpanan terenkripsi.
        </p>
      </div>

      {/* Upload Dropzone Section */}
      <section className="px-margin mt-3">
        <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm">
          <div className="flex items-center gap-space-sm mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-semibold">
                Unggah Berkas Baru
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Dokumen PDF, Word, Presentasi, atau foto catatan (Maks. 25 MB)
              </p>
            </div>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm mb-4 cursor-pointer border border-transparent hover:border-primary/30 transition-all"
          >
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary mb-2">
                <span className="material-symbols-outlined text-[26px]">
                  drive_folder_upload
                </span>
              </div>
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                Tarik dokumen ke sini atau klik untuk memilih
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Maksimal ukuran file 25 MB per dokumen • Supabase Vault Storage
              </span>
              <div className="grid grid-cols-2 gap-space-sm w-full mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center justify-center gap-space-xs bg-primary text-on-primary py-2.5 px-3 rounded-lg shadow-sm hover:opacity-95 active:scale-[0.98] transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    picture_as_pdf
                  </span>
                  <span className="font-label-md text-label-md truncate font-medium">
                    Pilih PDF Modul
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center justify-center gap-space-xs bg-surface-container-highest text-on-surface py-2.5 px-3 rounded-lg hover:bg-surface-dim active:scale-[0.98] transition-transform"
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    add_a_photo
                  </span>
                  <span className="font-label-md text-label-md truncate font-medium">
                    Foto Catatan
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Upload Status Card */}
          {uploadedFile && (
            <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      task_alt
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                        {uploadedFile.name}
                      </span>
                      <span className="font-code-sm text-code-sm text-on-surface-variant flex-shrink-0">
                        ({uploadedFile.size})
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {isUploading
                        ? `Sedang mengunggah... ${uploadProgress}%`
                        : 'Selesai diunggah • 100% Selesai'}
                    </p>
                  </div>
                </div>
                <span className="font-code-sm text-code-sm text-secondary font-medium bg-secondary-fixed/40 px-2 py-0.5 rounded-full flex-shrink-0">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-3 mb-2.5">
                <div
                  className="bg-primary-container h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 bg-secondary-fixed/50 px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-secondary text-[14px]">
                    auto_awesome
                  </span>
                  <span className="font-label-sm text-label-sm text-on-secondary-fixed-variant font-medium">
                    Siap Diracik Jadi Rangkuman &amp; Flashcard
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/tutor-ai')}
                  className="font-label-sm text-label-sm text-primary flex items-center gap-0.5 hover:underline font-bold"
                >
                  <span>Racik</span>
                  <span className="material-symbols-outlined text-[14px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filter Tabs Section */}
      <section className="mt-5">
        <div className="px-margin flex items-center justify-between mb-2.5">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Koleksi Berkas
          </h2>
          <button
            type="button"
            onClick={() => showToast('Daftar diurutkan berdasarkan berkas terbaru.')}
            className="font-label-md text-label-md text-primary flex items-center gap-0.5 font-semibold"
          >
            <span>Urutkan</span>
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </button>
        </div>
        <div className="flex items-center gap-space-sm overflow-x-auto px-margin pb-1 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm font-semibold'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-dim'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </section>

      {/* Files List Section */}
      <section className="px-margin mt-4 flex flex-col gap-space-md">
        {files.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-dashed border-outline-variant/60">
            <span className="material-symbols-outlined text-[40px] text-outline mb-2">
              folder_open
            </span>
            <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Belum Ada Berkas
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Unggah berkas modul atau foto catatan pertamamu ke Vault di atas.
            </p>
          </div>
        ) : (
          files.map((file) => {
            if (file.kind === 'image') {
              return (
                <article
                  key={file.id}
                  className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm"
                >
                  <div className="flex items-start gap-space-md">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high relative border border-outline-variant/30">
                      {file.previewUrl || file.imageUrl ? (
                        <Image
                          src={file.previewUrl || file.imageUrl!}
                          alt={file.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[24px]">image</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-on-background/70 text-surface-container-lowest py-0.5 text-center font-code-sm text-[9px]">
                        GAMBAR
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-space-xs flex-wrap mb-1">
                        <span className="bg-secondary-fixed/70 text-on-secondary-fixed-variant font-label-sm text-label-sm uppercase px-2 py-0.5 rounded-full font-semibold">
                          {file.courseName}
                        </span>
                        {file.ocrStatus && (
                          <div className="flex items-center gap-1 bg-surface-container-high text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[12px]">
                              document_scanner
                            </span>
                            <span>{file.ocrStatus}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
                        {file.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {file.uploadedAt} • {file.size}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file)}
                      title="Hapus Berkas"
                      aria-label="Hapus Berkas"
                      className="text-on-surface-variant hover:text-error p-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                  <div className="mt-3 pt-2 flex items-center justify-between border-t border-surface-container-high">
                    <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        visibility
                      </span>
                      <span>{file.identifiedCount || 'Tersimpan Aman'}</span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(file)}
                        aria-label="Lihat Gambar"
                        className="p-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-dim transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          zoom_in
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push('/tutor-ai')}
                        className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-md text-label-md hover:bg-primary-fixed-dim transition-colors font-medium"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          psychology
                        </span>
                        <span>Uji Flashcard</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            }

            // Document / PDF / Summary Card
            return (
              <article
                key={file.id}
                className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm"
              >
                <div className="flex items-start gap-space-md">
                  <div className="w-12 h-14 rounded-lg bg-error-container/40 flex flex-col items-center justify-center flex-shrink-0 text-error">
                    <span className="material-symbols-outlined text-[24px]">description</span>
                    <span className="font-code-sm text-[10px] uppercase font-bold tracking-tight">
                      {file.name.endsWith('.docx')
                        ? 'DOCX'
                        : file.name.endsWith('.pptx')
                        ? 'PPTX'
                        : file.name.endsWith('.xlsx')
                        ? 'XLSX'
                        : 'PDF'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-space-xs flex-wrap mb-1">
                      <span className="bg-primary-fixed/60 text-on-primary-fixed font-label-sm text-label-sm uppercase px-2 py-0.5 rounded-full font-semibold">
                        {file.courseName}
                      </span>
                      <span className="bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm px-2 py-0.5 rounded-full">
                        {file.pageCount ? `${file.pageCount} Halaman` : file.size}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
                      {file.name}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      {file.uploadedAt} • {file.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteFile(file)}
                    title="Hapus Berkas"
                    aria-label="Hapus Berkas"
                    className="text-on-surface-variant hover:text-error p-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-space-sm mt-3 pt-3 bg-surface-container-low/50 rounded-lg p-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadFile(file)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-colors font-medium"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      download
                    </span>
                    <span>Unduh Dokumen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/tutor-ai')}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-sm hover:opacity-95 transition-opacity font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      neurology
                    </span>
                    <span className="truncate">Tanya AI Dokumen</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Tips Belajar Card */}
      <div className="px-margin mt-5 mb-2">
        <div className="bg-surface-container-low rounded-xl p-space-md flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">lightbulb</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
              Tips Belajar Studika
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Seluruh berkas disimpan terisolasi dalam bucket privat dengan Row Level Security (RLS) sehingga hanya akun Anda yang dapat mengaksesnya.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Camera Action */}
      <div className="sticky bottom-20 z-40 px-margin mt-3 pointer-events-none">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="pointer-events-auto flex items-center gap-2 bg-secondary text-on-secondary px-4 py-3 rounded-full shadow-lg hover:bg-secondary/95 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">photo_camera</span>
            <span className="font-label-lg text-label-lg whitespace-nowrap font-semibold">
              Scan Catatan Cepat (Kamera)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
