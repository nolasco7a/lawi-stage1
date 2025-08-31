import { compare } from 'bcrypt-ts';
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createGuestUser, getUser, getUserById } from '@/lib/db/queries';
import { authConfig } from './auth.config';
import { DUMMY_PASSWORD } from '@/lib/constants';
import type { DefaultJWT } from 'next-auth/jwt';
import { getActiveSubscription } from '@/lib/db/subscription-helpers';

export type UserType = 'guest' | 'regular' | 'lawyer';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
      lastname?: string | null;
      phone?: string | null;
      subscription?: {
        id: string;
        plan_type: 'basic' | 'pro';
        status: string;
        current_period_end: Date;
        cancel_at_period_end: boolean;
      } | null;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
    lastname?: string | null;
    phone?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
    lastname?: string | null;
    phone?: string | null;
    subscription?: {
      id: string;
      plan_type: 'basic' | 'pro';
      status: string;
      current_period_end: Date;
      cancel_at_period_end: boolean;
    } | null;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUser(email);

        if (users.length === 0) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const [user] = users;

        if (!user.password) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) return null;

        // Map database role to session type
        const userType: UserType = user.role === 'lawyer' ? 'lawyer' : 'regular';
        
        return { ...user, type: userType };
      },
    }),
    Credentials({
      id: 'guest',
      credentials: {},
      async authorize() {
        const [guestUser] = await createGuestUser();
        return { ...guestUser, type: 'guest' };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.type = user.type;
      }

      // Fetch full user data and subscription for each token refresh
      if (token.id && token.type !== 'guest') {
        try {
          const fullUser = await getUserById({ id: token.id });
          if (fullUser) {
            token.lastname = fullUser.lastname;
            token.phone = fullUser.phone;

            // Get active subscription
            const activeSubscription = await getActiveSubscription(token.id);
            if (activeSubscription) {
              token.subscription = {
                id: activeSubscription.id,
                plan_type: activeSubscription.plan_type,
                status: activeSubscription.status,
                current_period_end: activeSubscription.current_period_end,
                cancel_at_period_end: activeSubscription.cancel_at_period_end,
              };
            } else {
              token.subscription = null;
            }
          }
        } catch (error) {
          console.error('Error fetching user data in JWT callback:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
        session.user.lastname = token.lastname;
        session.user.phone = token.phone;
        session.user.subscription = token.subscription;
      }

      return session;
    },
  },
});
