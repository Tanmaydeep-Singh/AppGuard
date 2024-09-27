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

        console.log("Blocked apps:", blockedAppsResult);

         setApps([...result, 'Notepad']);
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
    <div className="min-h-screen w-[80vw] flex flex-col items-center justify-center bg-[#F9FAFB] text-gray-700">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Installed Applications</h1>
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="table-auto w-full border-collapse bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-4 px-6 text-left text-gray-800 font-semibold">Application Name</th>
              <th className="py-4 px-6 text-right text-gray-800 font-semibold">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                {[...Array(10)].map((_, index) => (
                  <tr key={index}>
                    <td className="py-4 px-6 border-b">
                      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </td>
                    <td className="py-4 px-6 text-right border-b">
                      <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : apps.length > 0 ? (
              apps.map((app, index) => {
                const isBlocked = blockedApps.includes(app); // Check if the app is blocked
                return <Items key={index} name={app} isBlocked={isBlocked} />; // Pass the blocked status to Items
              })
            ) : (
              <tr>
                <td colSpan={2} className="py-6 text-center text-gray-600">No applications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default List;
