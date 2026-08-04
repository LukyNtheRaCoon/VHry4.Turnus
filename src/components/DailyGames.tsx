import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import './DailyGames.css';

interface GameSchedule {
  Datum: string;
  Hra: string;
  Cas: string;
  Popis: string;
}

const isToday = (dateStr: string) => {
  if (!dateStr) return false;
  const parts = dateStr.match(/\d+/g);
  if (parts && parts.length >= 2) {
    let day, month;
    if (dateStr.includes('-') && parts[0].length === 4) {
      // Format YYYY-MM-DD
      day = parseInt(parts[2], 10);
      month = parseInt(parts[1], 10);
    } else {
      // Format D.M.YYYY or D.M.
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
    }
    const today = new Date();
    return day === today.getDate() && month === (today.getMonth() + 1);
  }
  return false;
};

const DailyGames: React.FC = () => {
  const [games, setGames] = useState<GameSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Přidáváme náhodné číslo nakonec (cache buster), aby Google nevracel stará data z mezipaměti
    const cacheBuster = new Date().getTime();
    const sheetUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQntCMPoKCiaMzKn0L1XvfK8LvqlG4pMrUFGvjPRacX7YozNaOJvlomX0hQNajBZCGqC2fo15q1nIkD/pub?gid=1869098752&single=true&output=csv&t=${cacheBuster}`;

    Papa.parse<GameSchedule>(sheetUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const todaysGames = results.data.filter(game => {
          // Ujistíme se, že máme datum i hru, a zbavíme se zbytečných mezer
          const datum = game.Datum ? game.Datum.trim() : '';
          const hra = game.Hra ? game.Hra.trim() : '';
          return datum && hra && isToday(datum);
        });
        setGames(todaysGames);
        setLoading(false);
      },
      error: (err) => {
        console.error("Chyba při načítání rozvrhu:", err);
        setError("Nepodařilo se načíst rozvrh her.");
        setLoading(false);
      }
    });
  }, []);

  if (loading) return null;
  if (error) return null;
  if (games.length === 0) return null;

  // Sloučíme všechny dnešní hry do jednoho řetězce (oddělené čárkou a mezerou)
  const allGamesString = games.map(g => g.Hra.trim()).join(', ');

  return (
    <motion.div 
      className="daily-games-banner"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <span className="daily-games-label">📅 Dnes se hraje:</span>
      <span className="daily-games-list">{allGamesString}</span>
    </motion.div>
  );
};

export default DailyGames;
