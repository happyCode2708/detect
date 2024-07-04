import { getUserServerSide } from '@/lib/auth/user';
import { cookies } from 'next/headers';

export const server_useUserInfo = async () => {
  const nextCookies = cookies();

  const { user } = await getUserServerSide(nextCookies);

  return { user };
};
