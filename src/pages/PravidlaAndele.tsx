import React from 'react';
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

const PravidlaAndele: React.FC = () => {
  return (
    <motion.div className="game-page" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 variants={itemVariants}>Andělé</motion.h1>

      <motion.div variants={itemVariants} className="sub-nav">
        <Link to="/andele">Hra</Link>
        <Link to="/andele/pravidla" className="active">Pravidla</Link>
      </motion.div>

      <motion.div className="rules-container card" variants={itemVariants}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
          😇😈 ANDĚLÉ A DÉMONI: OFFICIAL SKIPPED LIST
        </h2>

        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Tuhle sekci vezmeme hodně rychlým procesem, protože si pojďme nalít čistého vína...
        </p>

        <div className="rule-block" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>💀 REAL TALK:</h3>
          <p style={{ lineHeight: 1.6 }}>
            Tahle hra je čistě pro Lka. Pořádní chlapi a tryhardeři tohle prostě nehrají, takže škoda našeho času tady cokoli sepisovat.
          </p>
          <p style={{ lineHeight: 1.6, marginTop: '1rem' }}>
            Z toho důvodu jde tahle aktivita kompletně mimo nás. Celý tenhle event bude organizovat, pravidla vymýšlet a na místě vysvětlovat Švejci, případně někdo další, koho tím zrovna zaúkoluje. Pokud máte k téhle hře nějaké dotazy, směřujte je rovnou na něj.
          </p>
        </div>

        <div className="rule-block critical-warning" style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: 'rgba(255, 107, 107, 0.1)', borderLeft: '4px solid #ff6b6b', borderRadius: '4px' }}>
          <h3 style={{ color: '#ff6b6b', marginTop: 0, marginBottom: '0.8rem' }}>⚠️ HIGHER POWER INTERVENTION</h3>
          <p style={{ marginBottom: 0, lineHeight: 1.6 }}>
            Kdyby se Švejci náhodou pokoušel z téhle organizace vykroutit nebo vznikly jakékoliv nejasnosti o tom, kdo má co na starosti, rozhoduje <strong>VYŠŠÍ MOC alias LukyN</strong>. Jeho slovo platí pro anděly i démony!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PravidlaAndele;
