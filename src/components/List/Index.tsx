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
    
    <div>
       
        <h1>Installed Applications</h1>
        {apps.length > 0 ? (
          <ul>
            {apps.map((app, index) => (
                 <Items key={index} name={app}/>
            ))}
          </ul>
        ) : (
          <p>No applications found.</p>
        )}

        {error}
    </div>
  )
}

export default List;
