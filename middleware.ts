import { NextRequest, NextResponse } from 'next/server';
import authConfig from './auth.config';
import NextAuth from 'next-auth';

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest) => {
  console.log('req in middleware', req);
  return NextResponse.next();
});

export const config = {
  matcher: ['/chat', '/chat/:id*', '/register'],
};
