'use client';

import { subscriptionRef } from '@/lib/converters/subscription';
import { useSubscriptionStore } from '@/store/store';
import { onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const setSubscription = useSubscriptionStore(
    (state) => state.setSubscription
  );

  useEffect(() => {
    if (!session) return;

    return onSnapshot(
      subscriptionRef(session?.user.id),
      (snapshot) => {
        if (snapshot.empty) {
          console.log('User has no subscription');
          setSubscription(null);
        } else {
          console.log('User has subscription');
          setSubscription(snapshot.docs[0].data());
        }
      },
      (error) => {
        console.log('Error getting document:', error);
      }
    );
  }, [session, setSubscription]);

  return <>{children}</>;
};

export default SubscriptionProvider;
