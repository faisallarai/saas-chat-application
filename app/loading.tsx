import { Spinner } from '@/components/ui/spinner';
import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center p-10">
      <Spinner />
    </div>
  );
};

export default Loading;
