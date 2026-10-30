import { ScheduleItem } from '@/types';
import { mockDashboardSchedules, mockMondaySchedule } from '@/lib/mock';

export async function getDashboardSchedules(): Promise<ScheduleItem[]> {
  return Promise.resolve([...mockDashboardSchedules]);
}

export async function getMondaySchedule(): Promise<ScheduleItem[]> {
  return Promise.resolve([...mockMondaySchedule]);
}
