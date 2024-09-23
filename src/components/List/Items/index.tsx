import Link from 'next/link';
import React, { useState } from 'react';

interface ItemProps {
  name: string;
}

const Item = ({ name }: ItemProps) => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <tr className="border-b border-[#D8D2C2]">
      <td className="py-2 px-4 text-[#4A4947]">{name}</td>
      <td className="py-2 px-4 text-right">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isEnabled}
            onChange={() => setIsEnabled(!isEnabled)}
          />
          <Link href={`/Time/${name}`} > GO</Link>
          <div className="w-11 h-6 bg-[#D8D2C2] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#B17457] rounded-full peer-checked:bg-[#B17457] relative">
            <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${isEnabled ? 'transform translate-x-6' : ''}`}></span>
          </div>
        </label>
      </td>
    </tr>
  );
};

export default Item;
