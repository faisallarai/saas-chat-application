'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from './user-avatar';
import { Session } from 'next-auth';
import { Button } from './ui/button';
import { signIn, signOut } from 'next-auth/react';
import { useSubscriptionStore } from '@/store/store';
import { Spinner } from './ui/spinner';
import { StarIcon } from 'lucide-react';
import { ManageAccountButtton } from './manage-account-button';

export const UserButton = ({ session }: { session: Session | null }) => {
  // Subscription listener
  const subscription = useSubscriptionStore((state) => state.subscription);

  if (!session) {
    return (
      <Button variant={'outline'} onClick={() => signIn()}>
        Sign in
      </Button>
    );
  }
  return (
    session && (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar
            name={session.user?.name || 'avatar'}
            image={session.user?.image || 'https://github.com/shadcn.png'}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {subscription === undefined && (
            <DropdownMenuItem>
              <Spinner />
            </DropdownMenuItem>
          )}

          {subscription?.role !== 'pro' && (
            <>
              <DropdownMenuLabel className="text-xs flex items-center justify-center space-x-1 text-[#E935C1] animate-pulse">
                <StarIcon fill="#E935C1" />
                <p>PRO</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <ManageAccountButtton />
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={() => signOut()}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};
