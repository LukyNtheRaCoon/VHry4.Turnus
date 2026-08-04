import React from 'react';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const PravidlaBobrici: React.FC = () => {
  return (
    <motion.div className="rules-container card" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h2 variants={itemVariants} style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
        Pravidla hry Bobříci
      </motion.h2>

      <motion.p variants={itemVariants} style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
        Čau lidi, je čas ukázat, kdo je na táboře nejvíc safe a kdo má v sobě totálního tryhardera. Tady jsou updatovaná pravidla pro tenhle legendární hunt:
      </motion.p>

      <motion.div variants={itemVariants} className="rule-block" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>1. Jak locknout start? 🔒</h3>
        <p style={{ lineHeight: 1.6 }}>
          Žádný random mindset uprostřed dne! Když chceš zkusit ulovit bobříka, musíš to nahlásit den předem, typicky na konci večerní porady, přímo LukyNovi. LukyN tě rovnou zapíše do speciální appky a tím je tvůj pokus oficiálně aktivovaný. Kdo nenahlásí, ten neloví.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="rule-block" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>2. Splněno? Sleduj svůj grind v appce! 📱</h3>
        <p style={{ lineHeight: 1.6 }}>
          Zapomeň na retro papírové tabulky, jedeme moderní styl. Celý tenhle hunt trackuje naše appka, která nonstop zaznamenává postupy všech vedoucích. Najdeš v ní kompletně všechno, co je potřeba k přehledu – kdo zrovna co plní, jaký má progress a kolik už toho má v kapse. Vizuál je naprosto sick, takže hned vidíš, jak na tom jsi!
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="rule-block" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>3. Hlavní cena pro největšího mastera 🏆</h3>
        <p style={{ lineHeight: 1.6 }}>
          Na konci tábora proběhne finální zúčtování. Kdo nejvíc zgrindí systém, nasbírá nejvíc bobříků a bude mít nejlepší skóre v appce, ten na závěrečném vyhlášení získá legendární odměnu a ultimátní flex před celým táborem.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="rule-block critical-warning" style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: 'rgba(255, 107, 107, 0.1)', borderLeft: '4px solid #ff6b6b', borderRadius: '4px' }}>
        <h3 style={{ color: '#ff6b6b', marginTop: 0, marginBottom: '0.8rem' }}>⚠️ CRITICAL WARNING (Pravidlo nejvyššího kalibru)</h3>
        <p style={{ marginBottom: 0, lineHeight: 1.6 }}>
          Kdyby náhodou nastaly nějaké spory, toxic debaty, lagy v pravidlech nebo jste si nebyli jistí, jestli byl splněný časový limit či podmínky, zapomeňte na hádky. V případě jakýchkoliv nejistot rozhoduje <strong>VYŠŠÍ MOC alias LukyN</strong>. Jeho slovo je absolutní zákon a přes to nejede vlak.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PravidlaBobrici;
