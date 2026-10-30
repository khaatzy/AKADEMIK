import { Profile } from '@/types';
import { mockProfile } from '@/lib/mock';

export async function getProfile(): Promise<Profile> {
  // Simulates async retrieval
  return Promise.resolve(mockProfile);
}
