// pages/time/[app].tsx
import { useRouter } from 'next/router';
import React, { useState } from 'react';

function AppTimePage() {
  const router = useRouter();
  const { app } = router.query;
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const handleEnable = () => {
    setIsEnabled(true);
    console.log(`Blocking enabled for ${app} from ${startTime} to ${endTime}`);
  };

  const handleDisable = () => {
    setIsEnabled(false);
    console.log(`Blocking disabled for ${app}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">Manage Time Usage for {app}</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input 
            type="time" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input 
            type="time" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={handleEnable}
            className={`w-full py-2 px-4 bg-green-500 text-white rounded-md ${isEnabled && 'opacity-50 cursor-not-allowed'}`}
            disabled={isEnabled}
          >
            Enable
          </button>
          <button 
            onClick={handleDisable}
            className="w-full py-2 px-4 bg-red-500 text-white rounded-md"
          >
            Disable
          </button>
        </div>

        {isEnabled && (
          <p className="mt-4 text-green-700">App usage restriction is enabled from {startTime} to {endTime}.</p>
        )}

        {!isEnabled && (
          <p className="mt-4 text-red-700">App usage restriction is disabled.</p>
        )}
      </div>
    </div>
  );
}

export default AppTimePage;
