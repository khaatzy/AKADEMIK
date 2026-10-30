'use server'

import { revalidatePath } from 'next/cache'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { taskCreateSchema, taskToggleSchema } from '@/lib/validations'

export async function createTaskAction(data: {
  title: string
  description?: string
  course_id?: string | null
  due_at: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
}) {
  const parsed = taskCreateSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Data tugas tidak valid.', details: parsed.error.flatten() }
  }

  if (!isSupabaseConfigured()) {
    // Offline / Mock fallback
    return { success: true }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Anda harus masuk terlebih dahulu.' }
  }

  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      course_id: parsed.data.course_id || null,
      due_at: parsed.data.due_at,
      priority: parsed.data.priority,
      is_done: false,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/jadwal')
  revalidatePath('/beranda')
  return { success: true, task }
}

export async function toggleTaskAction(id: string, isDone: boolean) {
  const parsed = taskToggleSchema.safeParse({ id, is_done: isDone })
  if (!parsed.success) {
    return { error: 'Parameter task tidak valid.' }
  }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Anda harus masuk terlebih dahulu.' }
  }

  const { error } = await supabase
    .from('tasks')
    .update({ is_done: parsed.data.is_done })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/jadwal')
  revalidatePath('/beranda')
  return { success: true }
}

export async function deleteTaskAction(id: string) {
  if (!id) return { error: 'ID tugas wajib diisi.' }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Anda harus masuk terlebih dahulu.' }
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/jadwal')
  revalidatePath('/beranda')
  return { success: true }
}
