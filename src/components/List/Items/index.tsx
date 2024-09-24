import Link from 'next/link';
import React, { useState } from 'react';

interface ItemProps {
  name: string;
}

const Item = ({ name }: ItemProps) => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <tr className="border-b ">
      <td className="py-4 px-6 text-gray-800">{name}</td>
      <td className="py-4 px-6 text-right">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="sr-only"
            checked={isEnabled}
            onChange={() => setIsEnabled(!isEnabled)}
          />
          <Link href={`/Time/${name}`} className="mr-2 text-sm text-blue-600 hover:underline">

            <div className="w-12 h-6 bg-gray-300 rounded-full relative">
              <span
                className={`block w-6 h-6 bg-white rounded-full transition-transform ${isEnabled ? 'transform translate-x-6 bg-green-500' : 'bg-gray-400'
                  }`}
              ></span>
            </div>
          </Link>
        </label>
      </td>
    </tr>
  );
};

export default Item;
