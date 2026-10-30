import { ScheduleItem } from '@/types';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { mockDashboardSchedules, mockMondaySchedule } from '@/lib/mock';

export async function getDashboardSchedules(): Promise<ScheduleItem[]> {
  if (!isSupabaseConfigured()) {
    return [...mockDashboardSchedules];
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [...mockDashboardSchedules];
    }

    const { data, error } = await supabase
      .from('schedules')
      .select('*, courses (name, code, lecturer, color)')
      .limit(4);

    if (error || !data || data.length === 0) {
      return [...mockDashboardSchedules];
    }

    return data.map((s, index) => {
      const course = s.courses as unknown as { name?: string; lecturer?: string } | null;
      return {
        id: s.id,
        startTime: s.start_time,
        endTime: s.end_time,
        courseName: course?.name || 'Mata Kuliah',
        lecturer: course?.lecturer || 'Dosen Pengampu',
        room: s.room,
        status: index === 0 ? 'in_progress' : 'upcoming',
        statusLabel: index === 0 ? 'Sedang Berlangsung' : undefined,
        topic: index === 0 ? 'Materi Sesi Ini' : undefined,
      };
    });
  } catch (err) {
    console.error('Gagal mengambil jadwal dashboard:', err);
    return [...mockDashboardSchedules];
  }
}

export async function getMondaySchedule(): Promise<ScheduleItem[]> {
  if (!isSupabaseConfigured()) {
    return [...mockMondaySchedule];
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [...mockMondaySchedule];
    }

    const { data, error } = await supabase
      .from('schedules')
      .select('*, courses (name, code, lecturer, color)')
      .eq('day_of_week', 'Senin')
      .order('start_time', { ascending: true });

    if (error || !data || data.length === 0) {
      return [...mockMondaySchedule];
    }

    return data.map((s, index) => {
      const course = s.courses as unknown as { name?: string; lecturer?: string } | null;
      return {
        id: s.id,
        startTime: s.start_time,
        endTime: s.end_time,
        courseName: course?.name || 'Mata Kuliah',
        lecturer: course?.lecturer || 'Dosen Pengampu',
        room: s.room,
        status: index === 0 ? 'in_progress' : 'upcoming',
        statusLabel: index === 0 ? 'Sedang Berlangsung' : undefined,
        badge: index === 0 ? 'Sesi Kuliah Utama' : undefined,
      };
    });
  } catch (err) {
    console.error('Gagal mengambil jadwal hari Senin:', err);
    return [...mockMondaySchedule];
  }
}
