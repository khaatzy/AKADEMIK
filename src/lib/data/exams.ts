import { ExamItem } from '@/types';
import { mockExams } from '@/lib/mock';

export async function getExams(): Promise<ExamItem[]> {
  return Promise.resolve([...mockExams]);
}
