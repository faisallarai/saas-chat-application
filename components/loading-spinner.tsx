import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default LoadingSpinner;
