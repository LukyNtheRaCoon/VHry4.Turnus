import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { getBobriciData } from '../../utils/bobriciUtils';
import type { PlayerProfile, BadgeDetail } from '../../utils/bobriciUtils';

interface BobriciContext {
  players: PlayerProfile[];
  badgeNames: string[];
  badgeDetails: BadgeDetail[];
}

const BobriciLayout: React.FC = () => {
  const [data, setData] = useState<BobriciContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBobriciData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Načítám data o bobřících...</p>;

  return (
    <div className="bobrici-container">
      <h1>Bobříci</h1>
      <nav className="sub-nav">
        <NavLink to="ukoly" end>Seznam úkolů</NavLink>
        <NavLink to="hraci">Seznam hráčů</NavLink>
        <NavLink to="zebricek">Žebříček</NavLink>
        <NavLink to="pravidla">Pravidla</NavLink>
      </nav>
      <div className="bobrici-content">
        <Outlet context={data} />
      </div>
    </div>
  );
};

export default BobriciLayout;
