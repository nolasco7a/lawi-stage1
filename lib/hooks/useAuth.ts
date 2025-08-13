import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  
  return useMemo(() => ({
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    isGuest: session?.user.type === 'guest',
    isRegular: session?.user.type === 'regular',
    user: session?.user,
    userId: session?.user.id,
    userEmail: session?.user.email,
    userType: session?.user.type
  }), [session, status]);
}