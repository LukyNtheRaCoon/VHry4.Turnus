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
import { fetchSheetData } from '../utils/googleSheets';

interface PalermoStats {
  Jméno: string;
  [key: string]: string | number;
}

const Palermo: React.FC = () => {
  const [data, setData] = useState<PalermoStats[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQntCMPoKCiaMzKn0L1XvfK8LvqlG4pMrUFGvjPRacX7YozNaOJvlomX0hQNajBZCGqC2fo15q1nIkD/pub?gid=1354082749&single=true&output=csv';

  useEffect(() => {
    fetchSheetData<PalermoStats>(SHEET_URL)
      .then((parsedData) => {
        const filteredRows = parsedData.filter(row => row.Jméno);
        if (filteredRows.length > 0) {
          // Získat sloupce a vyfiltrovat "Role"
          const allCols = Object.keys(filteredRows[0]);
          const filteredCols = allCols.filter(col => col.toLowerCase() !== 'role');
          setColumns(filteredCols);
        }
        setData(filteredRows);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Chyba při načítání Palermo dat:', err);
        setError('Nepodařilo se načíst data pro Palermo.');
        setLoading(false);
      });
  }, []);

  const renderHeader = (col: string) => {
    if (col === 'Výhry za Mafii') return 'Výhry za killera';
    return col;
  };

  if (loading) return <motion.p initial="hidden" animate="visible" variants={itemVariants}>Načítám statistiky Palermo...</motion.p>;
  if (error) return <motion.p className="error" initial="hidden" animate="visible" variants={itemVariants}>{error}</motion.p>;

  return (
    <motion.div className="game-page" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 variants={itemVariants}>Palermo - Statistiky</motion.h1>

      <motion.div variants={itemVariants} className="sub-nav">
        <Link to="/palermo" className="active">Statistiky</Link>
        <Link to="/palermo/pravidla">Pravidla</Link>
      </motion.div>
      
      <motion.div variants={itemVariants} className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => <th key={col}>{renderHeader(col)}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map(col => <td key={col}>{row[col]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {data.length === 0 && <motion.p variants={itemVariants}>Zatím zde nejsou žádná data.</motion.p>}
    </motion.div>
  );
};

export default Palermo;
