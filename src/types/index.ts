export interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  institution: string;
  nim?: string;
  programStudi?: string;
  semester?: number;
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
  storagePath?: string;
  previewUrl?: string;
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
  urgent?: boolean;
}

export interface DailyProgress {
  completed?: number;
  total?: number;
  percentage?: number;
  message?: string;
  completedTasks?: number;
  totalTasks?: number;
  progressPercent?: number;
  streakDays?: number;
}

export interface ChatPoint {
  num: number;
  title: string;
  desc: string;
}

export interface ComparisonTable {
  headers: string[];
  rows: string[][];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachmentName?: string;
  attachmentMeta?: string;
  points?: ChatPoint[];
  comparisonTable?: ComparisonTable;
  tableComparison?: {
    title: string;
    columns: string[];
    rows: {
      parameter: string;
      inversion: string;
      gauss: string;
    }[];
  };
  keyFormula?: {
    title: string;
    description: string;
    badge: string;
  };
}
