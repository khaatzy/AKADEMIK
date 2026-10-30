import { FileItem, FileKind } from '@/types';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { mockFiles } from '@/lib/mock';

let inMemoryFiles = [...mockFiles];

function filterFileList(files: FileItem[], filter?: string): FileItem[] {
  if (!filter || filter === 'all' || filter === 'Semua') {
    return [...files];
  }
  if (filter === 'PDF Modul' || filter === 'pdf') {
    return files.filter((f) => f.kind === 'pdf');
  }
  if (filter === 'Foto Catatan' || filter === 'image') {
    return files.filter((f) => f.kind === 'image');
  }
  if (filter === 'Rangkuman AI' || filter === 'summary') {
    return files.filter((f) => f.kind === 'summary');
  }
  if (filter === 'Rumus Praktis' || filter === 'formula') {
    return files.filter((f) => f.kind === 'formula');
  }
  return [...files];
}

export async function getFiles(filter?: string): Promise<FileItem[]> {
  if (!isSupabaseConfigured()) {
    return filterFileList(inMemoryFiles, filter);
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return filterFileList(inMemoryFiles, filter);
    }

    const query = supabase
      .from('files')
      .select('*, courses (name)')
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return filterFileList(inMemoryFiles, filter);
    }

    const filesWithUrls: FileItem[] = await Promise.all(
      data.map(async (f) => {
        let previewUrl: string | undefined = undefined;
        if (f.storage_path) {
          const { data: signed } = await supabase.storage
            .from('vault')
            .createSignedUrl(f.storage_path, 3600);
          previewUrl = signed?.signedUrl;
        }

        const sizeInMb = (f.size_bytes / (1024 * 1024)).toFixed(1);
        const sizeStr = f.size_bytes > 1048576 ? `${sizeInMb} MB` : `${Math.round(f.size_bytes / 1024)} KB`;
        const course = f.courses as unknown as { name?: string } | null;

        const kind: FileKind =
          f.kind === 'image'
            ? 'image'
            : f.kind === 'summary'
            ? 'summary'
            : f.kind === 'formula'
            ? 'formula'
            : f.mime_type.includes('pdf')
            ? 'pdf'
            : 'pdf';

        return {
          id: f.id,
          name: f.name,
          courseName: course?.name || 'Materi Umum',
          size: sizeStr,
          kind,
          uploadedAt: new Date(f.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
          }),
          storagePath: f.storage_path,
          previewUrl,
          imageUrl: f.kind === 'image' ? previewUrl : undefined,
          ocrStatus: f.kind === 'image' ? '12 Rumus Terdeteksi' : undefined,
          identifiedCount: f.kind === 'image' ? '12 rumus' : undefined,
        };
      })
    );

    return filterFileList(filesWithUrls, filter);
  } catch (err) {
    console.error('Gagal mengambil daftar berkas:', err);
    return filterFileList(inMemoryFiles, filter);
  }
}

export async function uploadSimulatedFile(file: {
  name: string;
  size: string;
  kind: FileKind;
  courseName: string;
  storagePath?: string;
}): Promise<FileItem> {
  const newFile: FileItem = {
    id: `fil-${Date.now()}`,
    name: file.name,
    courseName: file.courseName,
    size: file.size,
    kind: file.kind,
    uploadedAt: 'Baru saja',
    pageCount: file.kind === 'pdf' ? 10 : undefined,
    storagePath: file.storagePath,
  };
  inMemoryFiles = [newFile, ...inMemoryFiles];
  return newFile;
}
