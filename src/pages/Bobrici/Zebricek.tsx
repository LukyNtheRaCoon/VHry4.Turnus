import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import type { PlayerProfile } from '../../utils/bobriciUtils';

const tableVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const rowVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120 }
  }
};

const Zebricek: React.FC = () => {
  const { players } = useOutletContext<{ players: PlayerProfile[] }>();

  const sortedPlayers = [...players].sort((a, b) => b.totalCompleted - a.totalCompleted);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2>Celkový žebříček Bobříků</h2>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pořadí</th>
              <th>Jméno</th>
              <th>Počet splněných bobříků</th>
            </tr>
          </thead>
          <motion.tbody
            variants={tableVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedPlayers.map((player, index) => (
              <motion.tr key={player.name} variants={rowVariants} whileHover={{ backgroundColor: 'rgba(100, 108, 255, 0.1)' }}>
                <td>{index + 1}.</td>
                <td>{player.name}</td>
                <td>{player.totalCompleted}</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Zebricek;
