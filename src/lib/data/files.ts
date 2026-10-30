import { FileItem, FileKind } from '@/types';
import { mockFiles } from '@/lib/mock';

let filesStore = [...mockFiles];

export async function getFiles(filter?: string): Promise<FileItem[]> {
  if (!filter || filter === 'all' || filter === 'Semua') {
    return Promise.resolve([...filesStore]);
  }
  if (filter === 'PDF Modul' || filter === 'pdf') {
    return Promise.resolve(filesStore.filter((f) => f.kind === 'pdf'));
  }
  if (filter === 'Foto Catatan' || filter === 'image') {
    return Promise.resolve(filesStore.filter((f) => f.kind === 'image'));
  }
  if (filter === 'Rangkuman AI' || filter === 'summary') {
    return Promise.resolve(filesStore.filter((f) => f.kind === 'summary'));
  }
  return Promise.resolve([...filesStore]);
}

export async function uploadSimulatedFile(file: {
  name: string;
  size: string;
  kind: FileKind;
  courseName: string;
}): Promise<FileItem> {
  const newFile: FileItem = {
    id: `fil-${Date.now()}`,
    name: file.name,
    courseName: file.courseName,
    size: file.size,
    kind: file.kind,
    uploadedAt: 'Baru saja',
    pageCount: file.kind === 'pdf' ? 10 : undefined,
  };
  filesStore = [newFile, ...filesStore];
  return Promise.resolve(newFile);
}
