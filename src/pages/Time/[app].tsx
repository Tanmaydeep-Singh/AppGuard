import { useEffect } from 'react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

function AppTimePage() {
  const router = useRouter();
  const { app } = router.query;
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const fetchApps = async () => {
      if (!isEnabled || typeof window === 'undefined') {
        return;
      }

      try {
        const { invoke } = await import('@tauri-apps/api');

        const response = await invoke<string>('block_app_for_time_range', {
          appName: app,
          startTimeStr: new Date(`1970-01-01T${startTime}:00`).toISOString(),
          endTimeStr: new Date(`1970-01-01T${endTime}:00`).toISOString(),
        });

        console.log(`Blocking enabled for ${app} from ${startTime} to ${endTime}`);
        console.log('Backend response:', response);
      } catch (error) {
        console.error('Error invoking Tauri command:', error);
      }
    };

    fetchApps();
  }, [isEnabled, app, startTime, endTime]);

  const handleEnable = () => {
    if (!startTime || !endTime) {
      console.error('Start time and end time must be provided.');
      return;
    }

    setIsEnabled(true);
  };

  const handleDisable = async () => {
    try {
      const { invoke } = await import('@tauri-apps/api');
      const response = await invoke<string>('unblock_app', { appName: app });
      console.log('Backend response:', response);
    } catch (error) {
      console.error('Error invoking unblock_app command:', error);
    }
    
    setIsEnabled(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-5">
      <div className="max-w-lg mx-auto bg-gray-800 p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-white mb-4">Manage Time Usage for {app}</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleEnable}
            className={`w-full py-2 px-4 bg-green-500 text-white rounded-md transition duration-200 hover:bg-green-600 ${isEnabled && 'opacity-50 cursor-not-allowed'}`}
            disabled={isEnabled}
          >
            Enable
          </button>
          <button
            onClick={handleDisable}
            className={`w-full py-2 px-4 bg-red-500 text-white rounded-md transition duration-200 hover:bg-red-600 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isEnabled}
          >
            Disable
          </button>
        </div>

        {isEnabled && (
          <p className="mt-4 text-green-200">App usage restriction is enabled from {startTime} to {endTime}.</p>
        )}

        {!isEnabled && (
          <p className="mt-4 text-red-200">App usage restriction is disabled.</p>
        )}
      </div>
    </div>
  );
}

export default AppTimePage;
