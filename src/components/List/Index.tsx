/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Items from './Items';

const List: React.FC = () => {
  const [apps, setApps] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { invoke } = await import('@tauri-apps/api');
        const result = await invoke<string[]>('greet', { name: 'Next.js' });
        setApps(result);
      } catch (err: any) {
        setError(`Failed to load applications: ${err.message}`);
      } finally {
        setLoading(false); // Stop loading when request finishes
      }
    };

    fetchApps();
  }, []);

  return (
    <div className="min-h-screen w-[80vw] flex flex-col items-center justify-center bg-[#FAF7F0] text-[#4A4947]">
      <h1 className="text-3xl font-bold mb-6 text-[#B17457]">Installed Applications</h1>
      <div className="w-full overflow-x-auto"> {/* Set max-width for wide layout */}
        <table className="table-auto w-full border-collapse border border-[#D8D2C2]">
          <thead>
            <tr className="bg-[#D8D2C2] text-[#4A4947]">
              <th className="py-2 px-4 text-left border-b border-[#B17457]">Application Name</th>
              <th className="py-2 px-4 text-right border-b border-[#B17457]">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton Loader
              <>
                {[...Array(10)].map((_, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b border-[#D8D2C2]">
                      <div className="h-4 bg-[#D8D2C2] rounded w-3/4 animate-pulse"></div>
                    </td>
                    <td className="py-2 px-4 text-right border-b border-[#D8D2C2]">
                      <div className="h-4 bg-[#D8D2C2] rounded w-1/4 animate-pulse"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : apps.length > 0 ? (
              apps.map((app, index) => <Items key={index} name={app} />)
            ) : (
              <tr>
                <td colSpan={2} className="py-4 text-center border-b border-[#D8D2C2]">No applications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default List;
