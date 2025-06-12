import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-[#d35400] border-t-transparent"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 