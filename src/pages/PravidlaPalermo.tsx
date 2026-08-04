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

const PravidlaPalermo: React.FC = () => {
  return (
    <motion.div className="game-page" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 variants={itemVariants}>Palermo - Statistiky</motion.h1>

      <motion.div variants={itemVariants} className="sub-nav">
        <Link to="/palermo">Statistiky</Link>
        <Link to="/palermo/pravidla" className="active">Pravidla</Link>
      </motion.div>

      <motion.div className="rules-container card" variants={itemVariants}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
          🕵️ PALERMO: OFFICIAL RULES
        </h2>

        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Čau lidi, je čas nasadit poker face a začít pořádně lhát, protože Palermo je zpátky! Tady sice appku na losování nepotřebujeme, ale o to víc hardcore to bude. Tady jsou pravidla pro ty nejvíc sus noci na táboře:
        </p>

        <div className="rule-block" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>1. Retro losování a tajný pakt 🃏</h3>
          <p style={{ lineHeight: 1.6 }}>
            Jedeme starou dobrou klasiku – role si vylosujeme postaru pomocí papírků. Jeden z hráčů ale vytáhne speciálně označený papírek, což znamená jediné: jsi hlavní Vrah. Tvoje první mise? Do určeného časového limitu si musíš tajně vybrat jednoho komplice. Jakmile máte split-up a víte o sobě, hra oficiálně začíná.
          </p>
        </div>

        <div className="rule-block" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>2. Tikající bomba: Čas na vraždu ⏳</h3>
          <p style={{ lineHeight: 1.6 }}>
            Hra běží v kolech a na každé kolo se určí přesný časový limit, do kterého musí padnout krev. V tomhle okně musí jeden z vrahů nenápadně a bez povšimnutí zlikvidovat 1 nevinného měšťana.
          </p>
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 68, 68, 0.1)', borderLeft: '4px solid #ff4444', borderRadius: '4px' }}>
            <strong style={{ color: '#ff4444' }}>🟥 INSTANT LOSS DETECTED: Pozor na čas!</strong>
            <p style={{ margin: '0.5rem 0 0 0', lineHeight: 1.6 }}>
              Pokud vrazi zaspí, začnou moc tryhardit safe-play a nestihnou v časovém limitu nikoho zabít, automaticky a okamžitě celou hru prohrávají! Nevinní berou free win.
            </p>
          </div>
        </div>

        <div className="rule-block" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>3. Toxic debata a lynčování 🗣️</h3>
          <p style={{ lineHeight: 1.6 }}>
            Pokud vrazi hit stihnou, město se probouzí do fáze diskuze. Tady začíná ten pravý mindgame. Všichni se navzájem obviňují, vrazi dělají, že jsou clean, a na konci proběhne veřejné hlasování. Koho většina označí za vraha, ten je nekompromisně popraven a vypadává ze hry.
          </p>
        </div>

        <div className="rule-block" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>4. Konec hry: Kdo zkoší koho? 🏆</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '0.5rem' }}>
            Tenhle koloběh vraždění a hlasování pokračuje nonstop dál, dokud nenastane jeden ze dvou scénářů:
          </p>
          <ul style={{ lineHeight: 1.6, marginLeft: '1.5rem' }}>
            <li>Město odhalí a popraví oba vrahy (Win pro nevinné).</li>
            <li>Vrazi postupně vyhladí všechny nevinné (Win pro mafii).</li>
          </ul>
        </div>

        <div className="rule-block critical-warning" style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: 'rgba(255, 107, 107, 0.1)', borderLeft: '4px solid #ff6b6b', borderRadius: '4px' }}>
          <h3 style={{ color: '#ff6b6b', marginTop: 0, marginBottom: '0.8rem' }}>⚠️ CRITICAL WARNING (Pravidlo nejvyššího kalibru)</h3>
          <p style={{ marginBottom: 0, lineHeight: 1.6 }}>
            Jestli se začnete hádat o vteřiny, jestli se to stihlo v limitu, nebo že někdo podváděl, okamžitě stopka. V případě jakýchkoliv nejistot rozhoduje <strong>VYŠŠÍ MOC alias LukyN</strong>. Jeho slovo je svaté a neexistuje přes to žádný odvolací soud!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PravidlaPalermo;
