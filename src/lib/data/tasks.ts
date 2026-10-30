import { TaskItem } from '@/types';
import { mockPriorityTasks } from '@/lib/mock';

let tasksStore = [...mockPriorityTasks];

export async function getTasks(): Promise<TaskItem[]> {
  return Promise.resolve([...tasksStore]);
}

export async function toggleTaskStatus(id: string): Promise<TaskItem | null> {
  const index = tasksStore.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasksStore[index] = {
    ...tasksStore[index],
    isDone: !tasksStore[index].isDone,
    completedAt: !tasksStore[index].isDone ? 'Baru saja' : undefined,
  };
  return Promise.resolve(tasksStore[index]);
}

export async function addTask(task: Omit<TaskItem, 'id' | 'isDone'>): Promise<TaskItem> {
  const newTask: TaskItem = {
    ...task,
    id: `tsk-${Date.now()}`,
    isDone: false,
  };
  tasksStore = [newTask, ...tasksStore];
  return Promise.resolve(newTask);
}
