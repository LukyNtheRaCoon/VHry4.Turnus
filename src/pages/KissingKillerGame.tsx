import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};
import { fetchSheetData, isPlayerActive } from '../utils/googleSheets';


interface Assignment {
  'Jméno': string;
  'Cíl': string;
}

const ADMIN_PASSWORD = 'Adminlukyn';
// URL pro načítání cílů (CSV export listu "Cíle")
const TARGETS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQntCMPoKCiaMzKn0L1XvfK8LvqlG4pMrUFGvjPRacX7YozNaOJvlomX0hQNajBZCGqC2fo15q1nIkD/pub?gid=50884432&single=true&output=csv'; 
// URL pro načítání seznamu hráčů (Leaderboard)
const PLAYERS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQntCMPoKCiaMzKn0L1XvfK8LvqlG4pMrUFGvjPRacX7YozNaOJvlomX0hQNajBZCGqC2fo15q1nIkD/pub?output=csv';
// URL Google Apps Scriptu pro zápis (uživatel musí doplnit po nasazení skriptu)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwtkr96j2SkgkQOD7Qs6-XGKqBjPPm-BdiutwEEd2F4tt_gFAMqs2nfxn1KK4boTZ7Z/exec'; 

const KissingKillerGame: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [target, setTarget] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Admin state
  const [showAdmin, setShowAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [adminStatus, setAdminStatus] = useState<string | null>(null);
  const [playersList, setPlayersList] = useState<any[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  React.useEffect(() => {
    if (showAdmin) {
      const loadPlayers = async () => {
        setLoadingPlayers(true);
        try {
          const data = await fetchSheetData<any>(PLAYERS_SHEET_URL);
          setPlayersList(data.filter(p => p['Jméno'] && p['Jméno'].trim() !== ''));
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingPlayers(false);
        }
      };
      loadPlayers();
    }
  }, [showAdmin]);

  const handleCheckTarget = async () => {
    if (!playerName.trim()) return;
    setLoading(true);
    setError(null);
    setTarget(null);

    try {
      const data = await fetchSheetData<Assignment>(TARGETS_SHEET_URL);
      const assignment = data.find(
        (row) => row['Jméno']?.trim().toLowerCase() === playerName.trim().toLowerCase()
      );

      if (assignment) {
        setTarget(assignment['Cíl']);
      } else {
        setError('Tvé jméno nebylo v seznamu nalezeno. Možná ještě nebyla vygenerována nová hra.');
      }
    } catch (err) {
      console.error(err);
      setError('Chyba při načítání dat. Zkontroluj připojení.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (password !== ADMIN_PASSWORD) {
      setAdminStatus('Špatné heslo!');
      return;
    }

    if (!SCRIPT_URL) {
      setAdminStatus('Není nastaven SCRIPT_URL pro zápis do tabulky.');
      return;
    }

    setLoading(true);
    setAdminStatus('Generuji a ukládám...');

    try {
      // 1. Načíst hráče
      const playersData = await fetchSheetData<any>(PLAYERS_SHEET_URL);
      const activePlayers = playersData.filter(isPlayerActive);
      const players = activePlayers
        .map(p => p['Jméno'])
        .filter(name => name && name.trim() !== '');

      if (players.length < 2) {
        setAdminStatus('Nedostatek aktivních hráčů pro generování (alespoň 2).');
        setLoading(false);
        return;
      }

      // 2. Zamíchat (Fisher-Yates)
      const shuffled = [...players];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // 3. Vytvořit řetězec (A -> B, B -> C, ..., Z -> A)
      const assignments = shuffled.map((name, index) => ({
        name: name,
        target: shuffled[(index + 1) % shuffled.length]
      }));

      // 4. Odeslat do Google Apps Scriptu
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Důležité pro Apps Script bez CORS
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignments),
      });

      // Update the local list as well if we have it loaded
      setPlayersList(playersData.filter(p => p['Jméno'] && p['Jméno'].trim() !== ''));

      setAdminStatus('Úspěšně vygenerováno a odesláno do tabulky!');
    } catch (err) {
      console.error(err);
      setAdminStatus('Chyba při generování nebo zápisu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-page">
      <h1>Kissing Killer</h1>

      <div className="sub-nav">
        <Link to="/kissing-killer">Žebříček</Link>
        <Link to="/kissing-killer/game" className="active">Herní sekce (Cíle)</Link>
        <Link to="/kissing-killer/pravidla">Pravidla</Link>
      </div>

      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="card">
        <h2>Koho mám zabít?</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Zadej své jméno"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCheckTarget()}
          />
          <button onClick={handleCheckTarget} disabled={loading}>
            {loading ? 'Hledám...' : 'Zjistit cíl'}
          </button>
        </div>

        {target && (
          <div className="target-reveal">
            <p>Tvým cílem je:</p>
            <h3>{target}</h3>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </motion.div>

      <motion.div variants={itemVariants} className="admin-trigger" onClick={() => setShowAdmin(!showAdmin)}>
        {showAdmin ? 'Skrýt admin sekci' : 'Admin sekce (Generovat hru)'}
      </motion.div>

      {showAdmin && (
        <motion.div variants={itemVariants} className="card admin-card">
          <h3>Generovat novou hru</h3>
          
          {loadingPlayers ? (
            <p className="hint">Načítám přehled hráčů...</p>
          ) : playersList.length > 0 ? (
            <div className="players-overview">
              <p>
                <strong>Hrající hráči ({playersList.filter(isPlayerActive).length}):</strong>{' '}
                {playersList.filter(isPlayerActive).map(p => p['Jméno']).join(', ') || 'Žádní'}
              </p>
              {playersList.filter(p => !isPlayerActive(p)).length > 0 && (
                <p className="inactive-players-list">
                  <strong>Neaktivní/nepřítomní ({playersList.filter(p => !isPlayerActive(p)).length}):</strong>{' '}
                  {playersList.filter(p => !isPlayerActive(p)).map(p => p['Jméno']).join(', ')}
                </p>
              )}
            </div>
          ) : null}

          <div className="input-group">
            <input
              type="password"
              placeholder="Admin heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleGenerate} className="btn-danger" disabled={loading}>
              Vygenerovat cíle
            </button>
          </div>
          {adminStatus && <p className="status-message">{adminStatus}</p>}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default KissingKillerGame;
