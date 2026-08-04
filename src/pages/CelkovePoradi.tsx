import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { fetchSheetData, isPlayerActive } from '../utils/googleSheets';
import { getBobriciData } from '../utils/bobriciUtils';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

interface TotalScore {
  name: string;
  bobrici: number;
  kissingKiller: number;
  palermoSurvivor: number;
  palermoKiller: number;
  extraBody: number;
  total: number;
  active: boolean;
}

const KISSING_KILLER_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQntCMPoKCiaMzKn0L1XvfK8LvqlG4pMrUFGvjPRacX7YozNaOJvlomX0hQNajBZCGqC2fo15q1nIkD/pub?output=csv';
const PALERMO_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQntCMPoKCiaMzKn0L1XvfK8LvqlG4pMrUFGvjPRacX7YozNaOJvlomX0hQNajBZCGqC2fo15q1nIkD/pub?gid=1354082749&single=true&output=csv';
// URL pro Extra body z nové tabulky
const EXTRA_BODY_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQntCMPoKCiaMzKn0L1XvfK8LvqlG4pMrUFGvjPRacX7YozNaOJvlomX0hQNajBZCGqC2fo15q1nIkD/pub?gid=374670511&single=true&output=csv';

const CelkovePoradi: React.FC = () => {
  const [data, setData] = useState<TotalScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bobriciData, kissingKillerData, palermoData, extraBodyData] = await Promise.all([
          getBobriciData(),
          fetchSheetData<any>(KISSING_KILLER_URL),
          fetchSheetData<any>(PALERMO_URL),
          fetchSheetData<any>(EXTRA_BODY_URL).catch(() => []) // Catch pro případ, že URL ještě není validní
        ]);

        const playersMap = new Map<string, TotalScore>();

        // Zpracování Bobříků
        bobriciData.players.forEach(player => {
          if (player.name) {
            playersMap.set(player.name.trim(), {
              name: player.name.trim(),
              bobrici: player.totalCompleted,
              kissingKiller: 0,
              palermoSurvivor: 0,
              palermoKiller: 0,
              extraBody: 0,
              total: 0,
              active: true
            });
          }
        });

        // Zpracování Kissing Killer
        kissingKillerData.forEach(row => {
          const name = row['Jméno']?.trim();
          if (name) {
            if (!playersMap.has(name)) {
              playersMap.set(name, { name, bobrici: 0, kissingKiller: 0, palermoSurvivor: 0, palermoKiller: 0, extraBody: 0, total: 0, active: isPlayerActive(row) });
            }
            const p = playersMap.get(name)!;
            p.kissingKiller = Number(String(row['Vítězství'] || '0').replace(',', '.')) || 0;
            // Aktualizace stavu aktivity, pokud je v KK uveden jako neaktivní
            if (!isPlayerActive(row)) p.active = false;
          }
        });

        // Zpracování Palermo
        palermoData.forEach(row => {
          const name = row['Jméno']?.trim();
          if (name) {
            if (!playersMap.has(name)) {
              playersMap.set(name, { name, bobrici: 0, kissingKiller: 0, palermoSurvivor: 0, palermoKiller: 0, extraBody: 0, total: 0, active: isPlayerActive(row) });
            }
            const p = playersMap.get(name)!;
            p.palermoSurvivor = Number(row['Počet přežití']) || 0;
            const killerWins = Number(row['Výhry za killera']) || Number(row['Výhry za Mafii']) || 0;
            p.palermoKiller = killerWins;
          }
        });

        // Zpracování Extra bodů
        if (extraBodyData && extraBodyData.length > 0) {
          extraBodyData.forEach((row: any) => {
            const name = row['Jméno']?.trim();
            if (name) {
              if (!playersMap.has(name)) {
                playersMap.set(name, { name, bobrici: 0, kissingKiller: 0, palermoSurvivor: 0, palermoKiller: 0, extraBody: 0, total: 0, active: isPlayerActive(row) });
              }
              const p = playersMap.get(name)!;
              p.extraBody = Number(String(row['Body'] || '').replace(',', '.')) || Number(String(row['Extra body'] || '').replace(',', '.')) || 0;
            }
          });
        }

        // Výpočet celkových bodů
        const scores = Array.from(playersMap.values()).map(p => {
          p.total = p.bobrici + p.kissingKiller + p.palermoSurvivor + (p.palermoKiller * 3) + p.extraBody;
          return p;
        });

        // Seřadit sestupně podle celkových bodů
        scores.sort((a, b) => b.total - a.total);

        setData(scores);
        setLoading(false);
      } catch (err) {
        console.error('Chyba při načítání celkového pořadí:', err);
        setError('Nepodařilo se načíst data pro celkové pořadí.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <motion.p initial="hidden" animate="visible" variants={itemVariants}>Načítám celkové pořadí...</motion.p>;
  if (error) return <motion.p className="error" initial="hidden" animate="visible" variants={itemVariants}>{error}</motion.p>;

  return (
    <div className="game-page">
      <h1>Celkové Pořadí</h1>
      <p className="page-intro" style={{ marginBottom: '2rem' }}>
        Tato tabulka sčítá body ze všech her: Bobříci (1 bod), Kissing Killer vítězství (1 bod), Palermo přežití (1 bod), Palermo výhra za killera (3 body) a navíc i Extra body.
      </p>

      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pořadí</th>
                <th>Jméno</th>
                <th>Bobříci</th>
                <th>Kissing Killer</th>
                <th>Palermo (Přežití)</th>
                <th>Palermo (Killer)</th>
                <th>Extra body</th>
                <th>Celkem bodů</th>
              </tr>
            </thead>
            <tbody>
              {data.map((player, index) => (
                <tr key={index} className={!player.active ? 'player-inactive' : ''}>
                  <td>{index + 1}.</td>
                  <td>
                    <span className="player-name-cell">
                      {player.name}
                      {!player.active && <span className="status-badge inactive">Nepřítomen</span>}
                    </span>
                  </td>
                  <td>{player.bobrici}</td>
                  <td>{player.kissingKiller.toLocaleString('cs-CZ')}</td>
                  <td>{player.palermoSurvivor}</td>
                  <td>{player.palermoKiller}</td>
                  <td>{player.extraBody.toLocaleString('cs-CZ')}</td>
                  <td style={{ fontWeight: 'bold', color: '#646cff', fontSize: '1.1em' }}>{player.total.toLocaleString('cs-CZ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {data.length === 0 && <motion.p variants={itemVariants}>Zatím zde nejsou žádná data.</motion.p>}
      </motion.div>
    </div>
  );
};

export default CelkovePoradi;
