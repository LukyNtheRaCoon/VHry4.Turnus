import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getBobriciData } from '../utils/bobriciUtils';
import type { PlayerProfile } from '../utils/bobriciUtils';

const HraciTopLayout: React.FC = () => {
  const [data, setData] = useState<{ players: PlayerProfile[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBobriciData().then(res => {
      setData({ players: res.players });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#646cff' }}>
        <h2>Načítám hráče...</h2>
      </div>
    );
  }

  return (
    <div className="bobrici-container">
      <h1>Profily hráčů</h1>
      <div className="bobrici-content">
        <Outlet context={data} />
      </div>
    </div>
  );
};

export default HraciTopLayout;
