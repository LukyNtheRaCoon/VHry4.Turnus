import React from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import type { PlayerProfile } from '../../utils/bobriciUtils';

const HracDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { players } = useOutletContext<{ players: PlayerProfile[] }>();

  const player = players.find(p => p.name === decodeURIComponent(id || ''));

  if (!player) return <div className="error">Hráč nebyl nalezen.</div>;

  const renderDescription = (desc: string) => {
    if (!desc) return <p className="profile-description">Tento hráč o sobě zatím nic nenapsal.</p>;
    
    return (
      <div className="profile-description">
        {desc.split('\n').map((line, index) => {
          const trimmed = line.trim();
          if (trimmed === '') {
            return <div key={index} className="desc-spacer" />;
          }
          
          if (trimmed.endsWith('?')) {
            return (
              <div key={index} className="desc-question">
                {line}
              </div>
            );
          }
          
          return (
            <div key={index} className="desc-answer">
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="profile-card-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-photo-container">
            {player.photoUrl ? (
              <img src={player.photoUrl} alt={player.name} className="profile-photo" />
            ) : (
              <div className="profile-photo-placeholder">👤</div>
            )}
            <div className="profile-rank-badge">#{player.rank}</div>
          </div>
          <h2 className="profile-name">{player.name}</h2>
          <p className="profile-tagline">Člen 2. turnusu SPT</p>
        </div>
 
        <div className="profile-body">
          <div className="profile-section">
            <h3>O mně</h3>
            {renderDescription(player.description)}
          </div>

          <div className="profile-section">
            <h3>Aktuální výzva</h3>
            <div className="current-challenge-box">
              {player.currentTasks && player.currentTasks.length > 0 ? (
                <>
                  <span className="challenge-icon">🔥</span>
                  <div className="challenge-info">
                    <span className="challenge-label">Právě pracuje na:</span>
                    <span className="challenge-name">{player.currentTasks.join(', ')}</span>
                  </div>
                </>
              ) : (
                <p className="no-challenge">Momentálně neodpočívá, ale ani neplní žádného bobříka.</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h3>Získaní bobříci ({player.totalCompleted})</h3>
            <div className="profile-badges-grid">
              {player.completedBadges.length > 0 ? (
                player.completedBadges.map(badge => (
                  <div key={badge} className="profile-badge-item">
                    <span className="badge-mini-icon">🦫</span>
                    <span className="badge-mini-name">{badge}</span>
                  </div>
                ))
              ) : (
                <p className="no-badges-text">Zatím žádné zářezy. Ale to se brzy změní!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HracDetail;
