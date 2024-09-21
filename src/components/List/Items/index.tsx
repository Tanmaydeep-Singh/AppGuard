import React, { useState } from 'react';

interface ItemProps {
  name: string;
}

const Item = ({ name }: ItemProps) => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <tr className="border-b">
      <td className="py-2 px-4">{name}</td>
      <td className="py-2 px-4 text-right">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isEnabled}
            onChange={() => setIsEnabled(!isEnabled)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </td>
    </tr>
  );
}

export default Item;
