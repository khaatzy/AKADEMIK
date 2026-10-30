import { z } from 'zod'

// 1. Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
})

// 2. Task Schemas
export const taskCreateSchema = z.object({
  title: z.string().min(3, 'Judul tugas minimal 3 karakter').max(200, 'Judul tugas terlalu panjang'),
  description: z.string().max(1000).optional(),
  course_id: z.string().uuid().optional().nullable(),
  due_at: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
})

export const taskToggleSchema = z.object({
  id: z.string().uuid(),
  is_done: z.boolean(),
})

// 3. File (Vault) Schemas
export const fileMetadataSchema = z.object({
  name: z.string().min(1, 'Nama berkas wajib diisi'),
  storage_path: z.string().min(1, 'Path penyimpanan wajib ada'),
  mime_type: z.string().min(1),
  size_bytes: z.number().nonnegative(),
  kind: z.enum(['image', 'document', 'summary', 'formula']).default('document'),
  course_id: z.string().uuid().optional().nullable(),
})

// 4. Schedule Schemas
export const scheduleCreateSchema = z.object({
  course_id: z.string().uuid(),
  day_of_week: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format jam harus HH:MM'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format jam harus HH:MM'),
  room: z.string().min(2, 'Ruangan minimal 2 karakter'),
})

// 5. Chat Schemas
export const chatMessageSchema = z.object({
  sessionId: z.string().uuid().optional().nullable(),
  content: z.string().min(1, 'Pesan tidak boleh kosong').max(4000),
  attachmentFileId: z.string().uuid().optional().nullable(),
})
