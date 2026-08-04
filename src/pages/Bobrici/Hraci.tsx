import React from 'react';
import { Link, useOutletContext, useLocation } from 'react-router-dom';
import type { PlayerProfile } from '../../utils/bobriciUtils';

const Hraci: React.FC = () => {
  const { players } = useOutletContext<{ players: PlayerProfile[] }>();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/bobrici') ? '/bobrici/hraci' : '/hraci';

  return (
    <div className="players-page">
      <h2>Přehled hráčů a jejich postupu</h2>
      <div className="players-list">
        {players.map((player) => (
          <Link to={`${basePath}/${encodeURIComponent(player.name)}`} key={player.name} className="player-row-card">
            <div className="row-content">
              <div className="row-name">{player.name}</div>
              
              <div className="row-info-group">
                <div className="row-stat">
                  <span className="row-label">Splněno:</span>
                  <span className="row-value">{player.totalCompleted}</span>
                </div>
                
                <div className="row-stat row-working">
                  <span className="row-label">Pracuje na:</span>
                  <span className="row-value" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {player.currentTasks && player.currentTasks.length > 0 ? (
                      player.currentTasks.map(task => (
                        <span key={task} className="working-pill">{task}</span>
                      ))
                    ) : (
                      <span className="no-task-pill">Nic</span>
                    )}
                  </span>
                </div>

                <div className="row-stat mobile-only-rank">
                  <span className="row-label">Pozice:</span>
                  <span className="row-value rank-highlight">#{player.rank}</span>
                </div>
              </div>
            </div>

            <div className="row-rank-right desktop-only-rank">
              <span className="rank-label-small">Pozice</span>
              <span className="rank-number-big">#{player.rank}</span>
            </div>
            
            <div className="row-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Hraci;
