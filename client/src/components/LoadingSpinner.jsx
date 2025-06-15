import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center p-4 sm:p-6">
      <div className="relative">
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full absolute border-2 sm:border-4 border-gray-200"></div>
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full animate-spin absolute border-2 sm:border-4 border-[#d35400] border-t-transparent"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 