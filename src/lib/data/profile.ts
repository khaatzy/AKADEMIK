import { Profile } from '@/types';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { mockProfile } from '@/lib/mock';

export async function getProfile(): Promise<Profile> {
  if (!isSupabaseConfigured()) {
    return mockProfile;
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        id: 'guest',
        name: 'Pelajar',
        email: '',
        avatarUrl: '',
        role: 'Pelajar Aktif',
        institution: 'Portal Belajar Siswa',
        programStudi: 'Akademik',
        semester: 1,
      };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const displayName =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      (user.email ? user.email.split('@')[0] : 'Pelajar');

    const institution =
      profile?.institution ||
      user.user_metadata?.institution ||
      'Portal Belajar Siswa';

    const educationLevel =
      profile?.education_level ||
      user.user_metadata?.education_level ||
      'Pelajar Aktif';

    return {
      id: user.id,
      name: displayName,
      email: user.email || '',
      avatarUrl: profile?.avatar_path || '',
      role: educationLevel,
      institution: institution,
      nim: profile?.birth_date || user.user_metadata?.birth_date || '',
      programStudi: educationLevel,
      semester: 1,
    };
  } catch (err) {
    console.error('Gagal mengambil data profil dari Supabase:', err);
    return {
      id: 'fallback',
      name: 'Pelajar',
      email: '',
      avatarUrl: '',
      role: 'Pelajar Aktif',
      institution: 'Portal Belajar Siswa',
      programStudi: 'Akademik',
      semester: 1,
    };
  }
}
