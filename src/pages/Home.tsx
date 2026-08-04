import React from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

import DailyGames from '../components/DailyGames';

// Casting Link to any fixes the "No overload matches this call" when passing specific props
const MotionLink = motion.create(Link as any);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const Home: React.FC = () => {
  return (
    <motion.div 
      className="home-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.section className="hero-section" variants={itemVariants}>
        <h1>Hry pro vedoucí</h1>
        <p className="hero-description">
          Jsme druhý turnus táboru <strong>SPT</strong> (nejlepší turnus). 
          Tento web slouží jako centrální přehled výsledků, úkolů a statistik pro naše oblíbené hry.
        </p>
      </motion.section>

      <DailyGames />

      <motion.div className="game-links" variants={containerVariants}>
        <MotionLink 
          to="/celkove-poradi" 
          className="game-card celkove-card"
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="card-icon">🏆</div>
          <div className="card-content">
            <h2>Celkové pořadí</h2>
            <p>Žebříček sčítající body ze všech her.</p>
            <span className="card-action">Kdo vyhrává? →</span>
          </div>
        </MotionLink>

        <MotionLink 
          to="/hraci" 
          className="game-card hraci-card"
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h2>Hráči</h2>
            <p>Profily všech hráčů, jejich úspěchy a postup ve hrách.</p>
            <span className="card-action">Seznam hráčů →</span>
          </div>
        </MotionLink>

        <MotionLink 
          to="/bobrici" 
          className="game-card bobrici-card"
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="card-icon">🦫</div>
          <div className="card-content">
            <h2>Bobříci</h2>
            <p>Seznam úkolů, žebříčky a profily hráčů.</p>
            <span className="card-action">Zobrazit výsledky →</span>
          </div>
        </MotionLink>

        <MotionLink 
          to="/kissing-killer" 
          className="game-card killer-card"
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="card-icon">💋</div>
          <div className="card-content">
            <h2>Kissing Killer</h2>
            <p>Aktuální žebříček vítězství v napínavé hře.</p>
            <span className="card-action">Kdo vede? →</span>
          </div>
        </MotionLink>

        <MotionLink 
          to="/palermo" 
          className="game-card palermo-card"
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="card-icon">🕵️</div>
          <div className="card-content">
            <h2>Palermo</h2>
            <p>Statistiky a role z detektivní hry Palermo.</p>
            <span className="card-action">Statistiky →</span>
          </div>
        </MotionLink>

        <MotionLink 
          to="/sazky" 
          className="game-card sazky-card"
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h2>Sázky</h2>
            <p>Vsaď si své nasbírané body na vítěze her.</p>
            <span className="card-action">Vsadit si →</span>
          </div>
        </MotionLink>

        <MotionLink 
          to="/andele" 
          className="game-card andele-card"
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="card-icon">👼</div>
          <div className="card-content">
            <h2>Andělé</h2>
            <p>Zjisti komu děláš tajného anděla.</p>
            <span className="card-action">Můj cíl →</span>
          </div>
        </MotionLink>
      </motion.div>
    </motion.div>
  );
};

export default Home;
