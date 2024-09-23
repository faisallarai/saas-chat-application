'use client';

import { db } from '@/firebase';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Spinner } from './ui/spinner';
import { useSubscriptionStore } from '@/store/store';
import { ManageAccountButtton } from './manage-account-button';

export const CheckoutButton = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const subscription = useSubscriptionStore((state) => state.subscription);

  const isLoadingSubscription = subscription === undefined;

  const isSubscribed =
    subscription?.status === 'active' && subscription.role === 'pro';

  const createCheckoutSession = async () => {
    if (!session?.user.id) return;

    // push a document into firestore
    setLoading(true);
    const docRef = await addDoc(
      collection(db, 'customers', session.user.id, 'checkout_sessions'),
      {
        pricing: 'price_',
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    // stripe extension on firebase will create a checkout session
    return onSnapshot(docRef, (snap) => {
      const data = snap.data();
      const url = data?.url;
      const error = data?.error;

      if (error) {
        alert(`An error occured: ${error.message}`);
        setLoading(false);
      }

      if (url) {
        window.location.assign(url);
        setLoading(false);
      }
    });
    // redirect user to checkout page
  };
  return (
    <div className="flex flex-col space-y-2">
      {/* if subscribe show me the user is subscribe */}
      {isSubscribed && (
        <>
          <hr className="mt-5" />
          <p className="pt-5 text-center text-xs text-indigo-600">
            You are subscribed to PRO
          </p>
        </>
      )}

      <div className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:opacity-80 disabled:bg-indigo-600/50 disabled:text-white disabled:cursor-default">
        {isSubscribed ? (
          <ManageAccountButtton />
        ) : isLoadingSubscription || loading ? (
          <Spinner />
        ) : (
          <button onClick={() => createCheckoutSession()}>Sign up</button>
        )}
        {/* {loading ? (
          <Spinner className="text-gray-300 dark:text-gray-600" />
        ) : (
          'Sign up'
        )} */}
      </div>
    </div>
  );
};
