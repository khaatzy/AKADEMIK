export interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  institution: string;
}

export interface Course {
  id: string;
  name: string;
  code?: string;
  lecturer: string;
  color: string;
  room?: string;
}

export type FileKind = 'pdf' | 'image' | 'summary' | 'formula';

export interface FileItem {
  id: string;
  name: string;
  courseName: string;
  size: string;
  kind: FileKind;
  uploadedAt: string;
  pageCount?: number;
  imageUrl?: string;
  ocrStatus?: string;
  identifiedCount?: string;
  lastRead?: string;
}

export type ScheduleStatus = 'completed' | 'in_progress' | 'upcoming';

export interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  courseName: string;
  lecturer: string;
  room: string;
  status: ScheduleStatus;
  statusLabel?: string;
  topic?: string;
  actionText?: string;
  badge?: string;
}

export type TaskPriority = 'urgent' | 'high' | 'normal';

export interface TaskItem {
  id: string;
  title: string;
  courseName: string;
  dueTime: string;
  dueDateLabel: string;
  priority: TaskPriority;
  priorityLabel: string;
  isDone: boolean;
  completedAt?: string;
  description?: string;
  remainingTime?: string;
}

export interface ExamItem {
  id: string;
  title: string;
  courseName: string;
  daysLeftLabel: string;
  dateLabel: string;
  priority: TaskPriority;
  priorityLabel: string;
  description?: string;
  countdownSeconds?: number;
  urgent?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachmentName?: string;
  attachmentMeta?: string;
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  keyFormula?: {
    title: string;
    description: string;
    badge: string;
  };
  points?: {
    num: number;
    title: string;
    desc: string;
  }[];
}

export interface DailyProgress {
  completed: number;
  total: number;
  percentage: number;
  message: string;
}
