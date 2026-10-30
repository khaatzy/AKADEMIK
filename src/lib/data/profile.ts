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
      return mockProfile;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return {
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || mockProfile.name,
        email: user.email || mockProfile.email,
        avatarUrl: mockProfile.avatarUrl,
        role: 'Mahasiswa Aktif',
        institution: 'Universitas Indonesia',
        nim: user.user_metadata?.nim || mockProfile.nim,
        programStudi: user.user_metadata?.program_studi || mockProfile.programStudi,
        semester: user.user_metadata?.semester || mockProfile.semester,
      };
    }

    return {
      id: profile.id,
      name: profile.full_name || mockProfile.name,
      email: user.email || mockProfile.email,
      avatarUrl: profile.avatar_path || mockProfile.avatarUrl,
      role: 'Mahasiswa Aktif',
      institution: 'Universitas Indonesia',
      nim: profile.nim || mockProfile.nim,
      programStudi: profile.program_studi || mockProfile.programStudi,
      semester: profile.semester || mockProfile.semester,
    };
  } catch (err) {
    console.error('Gagal mengambil data profil dari Supabase:', err);
    return mockProfile;
  }
}
