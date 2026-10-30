'use server'

import { revalidatePath } from 'next/cache'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { fileMetadataSchema } from '@/lib/validations'

export async function createFileRecord(data: {
  name: string
  storage_path: string
  mime_type: string
  size_bytes: number
  kind: 'image' | 'document' | 'summary' | 'formula'
  course_id?: string | null
}) {
  const parsed = fileMetadataSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Metadata berkas tidak valid.', details: parsed.error.flatten() }
  }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Anda harus masuk terlebih dahulu.' }
  }

  const { data: inserted, error } = await supabase
    .from('files')
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      storage_path: parsed.data.storage_path,
      mime_type: parsed.data.mime_type,
      size_bytes: parsed.data.size_bytes,
      kind: parsed.data.kind,
      course_id: parsed.data.course_id || null,
    })
    .select()
    .single()

  if (error) {
    // If metadata insertion fails, clean up the orphaned file in Storage
    await supabase.storage.from('vault').remove([parsed.data.storage_path])
    return { error: `Gagal menyimpan metadata berkas: ${error.message}` }
  }

  revalidatePath('/materi')
  revalidatePath('/beranda')
  return { success: true, file: inserted }
}

export async function deleteFileRecord(id: string) {
  if (!id) return { error: 'ID berkas wajib diisi.' }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Anda harus masuk terlebih dahulu.' }
  }

  // 1. Get file metadata to obtain storage_path
  const { data: file, error: fetchError } = await supabase
    .from('files')
    .select('storage_path')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !file) {
    return { error: 'Berkas tidak ditemukan atau Anda tidak memiliki akses.' }
  }

  // 2. Remove file from Supabase Storage
  if (file.storage_path) {
    await supabase.storage.from('vault').remove([file.storage_path])
  }

  // 3. Remove row from database
  const { error: deleteError } = await supabase
    .from('files')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (deleteError) {
    return { error: deleteError.message }
  }

  revalidatePath('/materi')
  revalidatePath('/beranda')
  return { success: true }
}

export async function getSignedFileUrl(storagePath: string, download = false): Promise<string | null> {
  if (!storagePath) return null

  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = await createClient()
  const { data, error } = await supabase.storage.from('vault').createSignedUrl(storagePath, 3600, {
    download,
  })

  if (error || !data) {
    return null
  }

  return data.signedUrl
}

export async function updateAvatarAction(avatarPath: string) {
  if (!avatarPath) return { error: 'Path avatar wajib ada.' }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Belum masuk.' }

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_path: avatarPath })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
