import React, { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api';
import Items from './Items';

function List() {
    const [apps, setApps] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

 
    useEffect(() => {
      invoke<string[]>('greet', { name: 'Next.js' })
        .then(result => setApps(result))
        .catch(err => setError(`Failed to load applications: ${err.message}`));
    }, []);
  
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">Installed Applications</h1>
        <div className="w-full max-w-4xl">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="py-2 px-4 text-left">Application Name</th>
                <th className="py-2 px-4 text-right">Enabled</th>
              </tr>
            </thead>
            <tbody>
              {apps.length > 0 ? (
                apps.map((app, index) => <Items key={index} name={app} />)
              ) : (
                <tr>
                  <td colSpan={2} className="py-4 text-center">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
}

export default List;
