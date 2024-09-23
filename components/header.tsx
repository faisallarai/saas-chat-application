import Logo from './logo';
import { DarkModeToggle } from './dark-mode-toggle';
import { UserButton } from './user-button';
import Link from 'next/link';
import { MessagesSquareIcon } from 'lucide-react';
import { CreateChatButton } from './create-chat-button';
import { auth } from '@/auth';
import { UpgradeBanner } from './upgrade-banner';
import { LanguageSelect } from './language-select';

export const Header = async () => {
  const session = await auth();
  console.log('header', session);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900">
      <nav className="flex flex-col sm:flex-row items-center p-5 pl-2 bg-white dark:bg-gray-900 max-w-7xl mx-auto">
        <Logo />

        <div className="flex-1 flex items-center justify-end space-x-4">
          {/* Language Select */}
          <LanguageSelect />

          {/* Session */}
          {session ? (
            <>
              <Link href="/chat" prefetch={false}>
                <MessagesSquareIcon className="text-black dark:text-white" />
              </Link>
              <CreateChatButton />
            </>
          ) : (
            <Link href="/pricing">Pricing</Link>
          )}

          {/* DarkMode Toggle */}
          <DarkModeToggle />

          {/* User button */}
          <UserButton session={session} />
        </div>
      </nav>

      <UpgradeBanner />
    </header>
  );
};
