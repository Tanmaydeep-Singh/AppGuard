import Link from 'next/link';
import React, { useState } from 'react';

interface ItemProps {
  name: string;
  isBlocked: boolean; // New prop to indicate if the app is blocked
}

const Item = ({ name, isBlocked }: ItemProps) => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <tr className={`border-b ${isBlocked ? 'bg-red-200' : ''}`}> {/* Highlight blocked apps */}
      <td className="py-4 px-6 text-gray-800">{name}</td>
      <td className="py-4 px-6 text-right">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="sr-only"
            checked={isEnabled}
            onChange={() => {
              if (!isBlocked) {
                setIsEnabled(!isEnabled); // Only toggle if not blocked
              }
            }}
            disabled={isBlocked} // Disable the checkbox if the app is blocked
          />
          <Link href={`/Time/${name}`} className="mr-2 text-sm text-blue-600 hover:underline">
            <div className="w-12 h-6 bg-gray-300 rounded-full relative">
              <span
                className={`block w-6 h-6 bg-white rounded-full transition-transform ${
                  isEnabled ? 'transform translate-x-6 bg-green-500' : 'bg-gray-400'
                }`}
              ></span>
            </div>
          </Link>
        </label>
        {isBlocked && <span className="text-red-600 text-xs ml-2">Blocked</span>} {/* Indicate if blocked */}
      </td>
    </tr>
  );
};

export default Item;
