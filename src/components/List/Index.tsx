/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Items from './Items';

const List = () => {
  const [apps, setApps] = useState<string[]>([]);
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { invoke } = await import('@tauri-apps/api');
        const result = await invoke<string[]>('greet', { name: 'Next.js' });
        const blockedAppsResult = await invoke<string[]>('get_all_blocked_apps_command');
  
        const filteredApps = result.filter(app => 
          app.trim() !== '' && 
          app.trim() !== '-----------' && 
          !app.includes('Windows Driver Package')
        );
  
        setApps([...filteredApps, 'Notepad']);
        setBlockedApps(blockedAppsResult);
      } catch (err: any) {
        setError(`Failed to load applications: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchApps();
  }, []);
  

  return (
    <div className="min-h-screen w-[80vw] flex flex-col items-center justify-center bg-gray-900 text-gray-300">
      <h1 className="text-4xl font-bold mb-8 text-green-500">Installed Applications</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {loading ? (
          [...Array(10)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-600 h-24 rounded-lg shadow-lg"></div>
          ))
        ) : apps.length > 0 ? (
          apps.map((app, index) => {
            const isBlocked = blockedApps.includes(app);
            return <Items key={index} name={app} isBlocked={isBlocked} />;
          })
        ) : (
          <div className="col-span-full text-center text-gray-500">No applications found.</div>
        )}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default List;
