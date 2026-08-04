import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import '../App.css'; // Můžeme využít existující styly nebo přidat nové do index.css

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

// Použijeme stejné URL jako pro Cíle, ale přidáme parametr action=feedback
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwtkr96j2SkgkQOD7Qs6-XGKqBjPPm-BdiutwEEd2F4tt_gFAMqs2nfxn1KK4boTZ7Z/exec?action=feedback';

const Feedback: React.FC = () => {
  const [formData, setFormData] = useState({
    jmeno: '',
    hra: 'Celkově',
    hodnoceni: '5',
    text: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus('submitting');

    try {
      // Používáme no-cors, protože Apps Script často blokuje standardní CORS POST požadavky z prohlížeče,
      // pokud to není speciálně nastavené. Pro jednoduché odeslání dat to stačí.
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('Jméno', formData.jmeno || 'Anonym');
      formDataToSubmit.append('Hra', formData.hra);
      formDataToSubmit.append('Hodnocení', formData.hodnoceni);
      formDataToSubmit.append('Zpětná vazba', formData.text);

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formDataToSubmit
      });

      setStatus('success');
      setFormData({
        jmeno: '',
        hra: 'Celkově',
        hodnoceni: '5',
        text: ''
      });
      
      // Po 3 vteřinách schovat hlášku o úspěchu
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Chyba při odesílání feedbacku:', error);
      setStatus('error');
    }
  };

  return (
    <div className="game-page">
      <h1>Zpětná vazba</h1>
      <p className="page-intro">
        Líbila se ti hra? Co bys zlepšil? Napiš nám svůj názor, abychom příště mohli hry udělat ještě lepší!
      </p>

      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="feedback-container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
        <form onSubmit={handleSubmit} className="feedback-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          
          <motion.div variants={itemVariants}>
            <label htmlFor="jmeno" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Jméno (nepovinné)</label>
            <input
              type="text"
              id="jmeno"
              name="jmeno"
              value={formData.jmeno}
              onChange={handleChange}
              placeholder="Tvoje jméno..."
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: 'white' }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="hra" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Týká se hry</label>
            <select
              id="hra"
              name="hra"
              value={formData.hra}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: 'white' }}
            >
              <option value="Celkově">Celkově (Všechny hry)</option>
              <option value="Webová aplikace">Webová aplikace</option>
              <option value="Bobříci">Bobříci</option>
              <option value="Kissing Killer">Kissing Killer</option>
              <option value="Palermo">Palermo</option>
              <option value="Andělé">Andělé</option>
              <option value="Sázky">Sázky</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="hodnoceni" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Hodnocení (1-5 hvězdiček)</label>
            <select
              id="hodnoceni"
              name="hodnoceni"
              value={formData.hodnoceni}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: 'white' }}
            >
              <option value="5">⭐⭐⭐⭐⭐ (Super!)</option>
              <option value="4">⭐⭐⭐⭐ (Dobré)</option>
              <option value="3">⭐⭐⭐ (Ujde to)</option>
              <option value="2">⭐⭐ (Nic moc)</option>
              <option value="1">⭐ (Hrozné)</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="text" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tvoje zpětná vazba</label>
            <textarea
              id="text"
              name="text"
              required
              value={formData.text}
              onChange={handleChange}
              placeholder="Co se ti líbilo, co tě naštvalo, nápady na zlepšení..."
              rows={5}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: 'white', resize: 'vertical' }}
            ></textarea>
          </motion.div>

          <motion.div variants={itemVariants} style={{ marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={status === 'submitting'}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                backgroundColor: status === 'submitting' ? '#555' : '#646cff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: 'bold',
                cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {status === 'submitting' ? 'Odesílám...' : 'Odeslat feedback'}
            </button>
          </motion.div>

          {status === 'success' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#4ade80', textAlign: 'center', marginTop: '1rem', fontWeight: 'bold' }}>
              Díky za tvůj názor! Úspěšně odesláno.
            </motion.div>
          )}
          
          {status === 'error' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#f87171', textAlign: 'center', marginTop: '1rem', fontWeight: 'bold' }}>
              Jejda, něco se pokazilo. Zkus to prosím znovu.
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Feedback;
