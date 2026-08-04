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

const PravidlaKissingKiller: React.FC = () => {
  return (
    <motion.div className="game-page" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 variants={itemVariants}>Kissing Killer</motion.h1>

      <motion.div variants={itemVariants} className="sub-nav">
        <Link to="/kissing-killer">Žebříček</Link>
        <Link to="/kissing-killer/game">Herní sekce (Cíle)</Link>
        <Link to="/kissing-killer/pravidla" className="active">Pravidla</Link>
      </motion.div>

      <motion.div className="rules-container card" variants={itemVariants}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
          💋 KISSING KILLER: OFFICIAL RULES
        </h2>

        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Čau lidi, doufám, že máte nabité zbraně, protože začíná nejvíc sus hra celého tábora. Všichni jste v ohrožení a nikomu nemůžete věřit. Tady jsou pravidla pro tenhle legendární lov:
        </p>

        <div className="rule-block" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>1. Jak zjistíš svůj target? 📱</h3>
          <p style={{ lineHeight: 1.6 }}>
            Žádné papírky, žádný zmatek. Otevřeš naši appku, zadáš tam svoje jméno a systém ti okamžitě vygeneruje tvůj target – člověka, po kterém musíš jít. Tuhle informaci si samozřejmě nechej pro sebe, nechceš přece dostat instantní counter.
          </p>
        </div>

        <div className="rule-block" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>2. Pravidlo čistého hitu: Polibek smrti! 💋</h3>
          <p style={{ lineHeight: 1.6 }}>
            Jakmile najdeš ideální moment, kdy tvůj target nedává pozor nebo je v úzkých, provedeš exekuci. Zabíjí se jedině polibkem na tvář. Žádné jiné faily se nepočítají. Jakmile dostane pusu, je oficiálně tuhej.
          </p>
        </div>

        <div className="rule-block" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>3. Převzetí kontraktu (Chain Kill) 💀</h3>
          <p style={{ lineHeight: 1.6 }}>
            Tím to ale nekončí! Poté, co svůj target úspěšně zlikviduješ, ti tahle čerstvá „mrtvola“ musí okamžitě sdělit, po kom měla jít ona. Ty tak automaticky přebíráš její kontrakt a tvůj hunt pokračuje dál za dalším cílem.
          </p>
        </div>

        <div className="rule-block" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>4. Jen jeden přežije 🏆</h3>
          <p style={{ lineHeight: 1.6 }}>
            Appka na začátku vygeneruje jedno obří, perfektně uzavřené kolo. Všichni loví všechny v jednom velkém kruhu smrti, takže je matematicky jisté, že na konci zbude vždycky jen jeden ultimátní vítěz, který všechny přežije a vyhraje celou hru.
          </p>
        </div>

        <div className="rule-block critical-warning" style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: 'rgba(255, 107, 107, 0.1)', borderLeft: '4px solid #ff6b6b', borderRadius: '4px' }}>
          <h3 style={{ color: '#ff6b6b', marginTop: 0, marginBottom: '0.8rem' }}>⚠️ CRITICAL WARNING (Pravidlo nejvyššího kalibru)</h3>
          <p style={{ marginBottom: 0, lineHeight: 1.6 }}>
            Kdyby náhodou vznikly debaty typu „to nebyl čistý hit“, „stihl jsem uhnout“ nebo „nebylo to na tvář“, zapomeňte na toxic hádky. V případě jakýchkoliv nejistot rozhoduje <strong>VYŠŠÍ MOC alias LukyN</strong>. Jeho slovo je absolutní zákon, tak radši hrajte fair play!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PravidlaKissingKiller;
