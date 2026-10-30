import { TaskItem, TaskPriority } from '@/types';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { mockPriorityTasks } from '@/lib/mock';

let inMemoryTasks = [...mockPriorityTasks];

export async function getTasks(): Promise<TaskItem[]> {
  if (!isSupabaseConfigured()) {
    return [...inMemoryTasks];
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [...inMemoryTasks];
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*, courses (name)')
      .order('due_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return [...inMemoryTasks];
    }

    return data.map((t) => {
      const dueDate = new Date(t.due_at);
      const dueHours = dueDate.getHours().toString().padStart(2, '0');
      const dueMinutes = dueDate.getMinutes().toString().padStart(2, '0');
      const days = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
      const dayName = days[dueDate.getDay()];
      const dateNum = dueDate.getDate();

      const priorityMap: Record<string, TaskPriority> = {
        urgent: 'urgent',
        high: 'high',
        medium: 'normal',
        low: 'normal',
      };

      const labelMap: Record<string, string> = {
        urgent: 'Mendesak',
        high: 'Prioritas Tinggi',
        medium: 'Normal',
        low: 'Rendah',
      };

      const course = t.courses as unknown as { name?: string } | null;

      return {
        id: t.id,
        title: t.title,
        courseName: course?.name || 'Mata Kuliah',
        dueTime: `${dueHours}:${dueMinutes}`,
        dueDateLabel: `${dayName}, ${dateNum} ${dueDate.toLocaleString('id-ID', { month: 'short' })}`,
        priority: priorityMap[t.priority] || 'normal',
        priorityLabel: labelMap[t.priority] || 'Normal',
        isDone: t.is_done,
        completedAt: t.is_done ? 'Selesai' : undefined,
        description: t.description || undefined,
      };
    });
  } catch (err) {
    console.error('Gagal mengambil daftar tugas:', err);
    return [...inMemoryTasks];
  }
}

export async function toggleTaskStatus(id: string): Promise<TaskItem | null> {
  if (!isSupabaseConfigured()) {
    const index = inMemoryTasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    inMemoryTasks[index] = {
      ...inMemoryTasks[index],
      isDone: !inMemoryTasks[index].isDone,
      completedAt: !inMemoryTasks[index].isDone ? 'Baru saja' : undefined,
    };
    return inMemoryTasks[index];
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch current state
    const { data: current } = await supabase
      .from('tasks')
      .select('is_done')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!current) return null;

    const nextState = !current.is_done;
    await supabase
      .from('tasks')
      .update({ is_done: nextState })
      .eq('id', id)
      .eq('user_id', user.id);

    const allTasks = await getTasks();
    return allTasks.find((t) => t.id === id) || null;
  } catch (err) {
    console.error('Gagal memperbarui status tugas:', err);
    return null;
  }
}

export async function addTask(task: Omit<TaskItem, 'id' | 'isDone'>): Promise<TaskItem> {
  if (!isSupabaseConfigured()) {
    const newTask: TaskItem = {
      ...task,
      id: `tsk-${Date.now()}`,
      isDone: false,
    };
    inMemoryTasks = [newTask, ...inMemoryTasks];
    return newTask;
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const newTask: TaskItem = { ...task, id: `tsk-${Date.now()}`, isDone: false };
      return newTask;
    }

    const { data: inserted, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: task.title,
        description: task.description || null,
        due_at: new Date(Date.now() + 86400000 * 2).toISOString(),
        priority: task.priority === 'urgent' ? 'urgent' : task.priority === 'high' ? 'high' : 'medium',
        is_done: false,
      })
      .select()
      .single();

    if (error || !inserted) {
      throw error;
    }

    return {
      id: inserted.id,
      title: inserted.title,
      courseName: task.courseName,
      dueTime: task.dueTime,
      dueDateLabel: task.dueDateLabel,
      priority: task.priority,
      priorityLabel: task.priorityLabel,
      isDone: false,
      description: inserted.description || undefined,
    };
  } catch (err) {
    console.error('Gagal menambahkan tugas:', err);
    const newTask: TaskItem = { ...task, id: `tsk-${Date.now()}`, isDone: false };
    return newTask;
  }
}
