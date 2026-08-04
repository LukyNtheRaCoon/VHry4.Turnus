import React, { useEffect, useState } from 'react';
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

interface PlayerScore {
  Jméno: string;
  Vítězství: string | number;
  [key: string]: any;
}

const KissingKiller: React.FC = () => {
  const [data, setData] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQntCMPoKCiaMzKn0L1XvfK8LvqlG4pMrUFGvjPRacX7YozNaOJvlomX0hQNajBZCGqC2fo15q1nIkD/pub?output=csv';

  useEffect(() => {
    fetchSheetData<PlayerScore>(SHEET_URL)
      .then((parsedData) => {
        // Seřadit podle vítězství sestupně
        const sortedData = parsedData
          .filter(row => row.Jméno) // Odstranit prázdné řádky
          .sort((a, b) => {
            const valA = Number(String(a.Vítězství || '0').replace(',', '.')) || 0;
            const valB = Number(String(b.Vítězství || '0').replace(',', '.')) || 0;
            return valB - valA;
          });
        setData(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Chyba při načítání dat:', err);
        setError('Nepodařilo se načíst data z tabulky.');
        setLoading(false);
      });
  }, []);

  if (loading) return <motion.p initial="hidden" animate="visible" variants={itemVariants}>Načítám žebříček...</motion.p>;
  if (error) return <motion.p className="error" initial="hidden" animate="visible" variants={itemVariants}>{error}</motion.p>;

  return (
    <div className="game-page">
      <h1>Kissing Killer</h1>

      <div className="sub-nav">
        <Link to="/kissing-killer" className="active">Žebříček</Link>
        <Link to="/kissing-killer/game">Herní sekce (Cíle)</Link>
        <Link to="/kissing-killer/pravidla">Pravidla</Link>
      </div>
      
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pořadí</th>
              <th>Jméno</th>
              <th>Počet vítězství</th>
            </tr>
          </thead>
          <tbody>
            {data.map((player, index) => {
              const active = isPlayerActive(player);
              return (
                <tr key={index} className={!active ? 'player-inactive' : ''}>
                  <td>{index + 1}.</td>
                  <td>
                    <span className="player-name-cell">
                      {player.Jméno}
                      {!active && <span className="status-badge inactive">Nepřítomen</span>}
                    </span>
                  </td>
                  <td>{String(player.Vítězství).replace('.', ',')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </motion.div>

        {data.length === 0 && <motion.p variants={itemVariants}>Zatím zde nejsou žádná data.</motion.p>}
      </motion.div>
    </div>
  );
};

export default KissingKiller;
