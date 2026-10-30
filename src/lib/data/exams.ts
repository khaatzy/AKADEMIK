import { ExamItem } from '@/types';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { mockExams } from '@/lib/mock';

export async function getExams(): Promise<ExamItem[]> {
  if (!isSupabaseConfigured()) {
    return [...mockExams];
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [...mockExams];
    }

    const { data, error } = await supabase
      .from('exams')
      .select('*, courses (name)')
      .order('scheduled_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return [...mockExams];
    }

    return data.map((exam) => {
      const scheduledDate = new Date(exam.scheduled_at);
      const diffMs = scheduledDate.getTime() - Date.now();
      const diffHours = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
      const daysLeftLabel = exam.countdown_label || (diffHours <= 72 ? `${diffHours} jam lagi` : `${Math.round(diffHours / 24)} hari lagi`);

      const course = exam.courses as unknown as { name?: string } | null;

      return {
        id: exam.id,
        title: exam.title,
        courseName: course?.name || 'Mata Kuliah',
        daysLeftLabel,
        dateLabel: scheduledDate.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        priority: 'urgent',
        priorityLabel: 'Ujian Mendatang',
        description: exam.room ? `Ruang: ${exam.room}` : undefined,
      };
    });
  } catch (err) {
    console.error('Gagal mengambil data ujian:', err);
    return [...mockExams];
  }
}
