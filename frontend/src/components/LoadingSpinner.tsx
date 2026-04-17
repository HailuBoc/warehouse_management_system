import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-blue-500" />
    <p className="text-sm text-gray-400">Loading inventory…</p>
  </div>
);
