import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

export default function Home() {
  const [apps, setApps] = useState<string[]>([]);
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    invoke<string[]>('greet', { name: 'Next.js' })
      .then(result => setApps(result))
      .catch(err => setError(`Failed to load applications: ${err.message}`));
  }, []);

  const get_time = () => {
    setLoading(true);
    setError(null); // Reset error state
    invoke<string>('get_local_time')
      .then(result => {
        setTime(result);
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to get time: ${err.message}`);
        setLoading(false);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Get Time</h1>
        <button onClick={get_time} disabled={loading}>
          {loading ? 'Loading...' : 'Get Time'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        <h1>{time}</h1>
      </div>
      <div>
        <h1>Installed Applications</h1>
        {apps.length > 0 ? (
          <ul>
            {apps.map((app, index) => (
              <li key={index}>{app}</li>
            ))}
          </ul>
        ) : (
          <p>No applications found.</p>
        )}
      </div>
    </main>
  );
}
