import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-netflix-red font-bold text-2xl">VibeWatch</span>
        </div>
        <div>
          <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 