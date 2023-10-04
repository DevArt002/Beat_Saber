import React from 'react';
import { LoadingSpinner } from 'src/components';

export const LandingPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-900">
      <LoadingSpinner />
    </div>
  );
};
