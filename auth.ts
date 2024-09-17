import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { adminAuth, adminDb } from './firebase-admin';

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;

          const firebaseToken = await adminAuth.createCustomToken(token.sub);
          session.firebaseToken = firebaseToken;
        }
      }

      return session;
    },
    async jwt({ user, token }) {
      // add new in here and pass it to session
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
  },
  adapter: FirestoreAdapter(adminDb),
  session: { strategy: 'jwt' },
  ...authConfig,
});
