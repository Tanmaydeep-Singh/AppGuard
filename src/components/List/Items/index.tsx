import Link from 'next/link';
import React from 'react';

interface ItemProps {
  name: string;
  isBlocked: boolean;
}

const Item = ({ name, isBlocked }: ItemProps) => {

  return (
    <div className={`max-w-sm h-40 p-6 bg-gray-800  border border-gray-700 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 ${isBlocked ? 'border-red-500' : ''}`}>
      <Link href="#">
        <h5 className="mb-4 text-2xl font-bold tracking-tight text-white">{name}</h5>
      </Link>
      <Link
        href={`/Time/${name}`}
        className={`inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 ${isBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
      
      >
        Set Timer
        <svg className="rtl:rotate-180 w-4 h-4 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </Link>
      {isBlocked && <span className="text-red-400 text-xs mt-2">Blocked</span>}
    </div>
  );
};

export default Item;
