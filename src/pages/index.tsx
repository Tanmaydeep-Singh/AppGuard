import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import List from '@/components/List/Index';

export default function Home() {
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
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
        <List/>
       
      </div>
    </main>
  );
}
