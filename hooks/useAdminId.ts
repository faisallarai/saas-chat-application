import { chatMemberAdminRef } from '@/lib/converters/chat-members';
import { getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

function useAdminId({ chatId }: { chatId: string }) {
  const [adminId, setAdminId] = useState<string>('');

  useEffect(() => {
    const fetchAdminStatus = async () => {
      // only one record
      const adminId = (await getDocs(chatMemberAdminRef(chatId))).docs.map(
        (doc) => doc.id
      )[0];

      setAdminId(adminId);
    };

    fetchAdminStatus();
  }, [chatId]);

  return adminId;
}

export default useAdminId;
