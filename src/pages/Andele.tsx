import React, { useState } from 'react';
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


const API_URL = 'https://script.google.com/macros/s/AKfycbx0oXQIi_MquxV1p8eC10MksREJyBo3PxK86IdFAazSzpfzPUol8ICMD_uf8uLA1C4M/exec';
const ADMIN_PASSWORD = 'Adminlukyn';

const Andele: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [target, setTarget] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Admin state
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminStatus, setAdminStatus] = useState<string | null>(null);

  const handleCheckTarget = async () => {
    if (!playerName.trim()) return;
    setLoading(true);
    setError(null);
    setTarget(null);

    try {
      const res = await fetch(`${API_URL}?action=getAndeleTargets`);
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      const normalizedInput = playerName.trim().toLowerCase();
      const assignment = data.targets.find(
        (row: any) => row.name.toLowerCase() === normalizedInput
      );

      if (assignment) {
        setTarget(assignment.target);
      } else {
        setError('Tvé jméno nebylo nalezeno. Možná hra Andělé ještě nebyla vygenerována, nebo máš překlep ve jméně.');
      }
    } catch (err) {
      console.error(err);
      setError('Chyba při načítání cílů ze serveru.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (adminPassword !== ADMIN_PASSWORD) {
      setAdminStatus('Špatné heslo!');
      return;
    }

    setLoading(true);
    setAdminStatus('Generuji a ukládám nové Anděly...');

    try {
      const res = await fetch(`${API_URL}?action=generateAndele`);
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setAdminStatus('Andělé úspěšně vygenerováni a uloženi!');
    } catch (err) {
      console.error(err);
      setAdminStatus('Chyba při generování: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="game-page" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 variants={itemVariants}>Andělé</motion.h1>

      <motion.div variants={itemVariants} className="sub-nav">
        <Link to="/andele" className="active">Hra</Link>
        <Link to="/andele/pravidla">Pravidla</Link>
      </motion.div>

      <motion.div variants={itemVariants} className="card">
        <h2>Komu dělám anděla?</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Zadej své jméno"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCheckTarget()}
            disabled={loading}
          />
          <button onClick={handleCheckTarget} disabled={loading || !playerName.trim()}>
            {loading ? 'Hledám...' : 'Zjistit anděla'}
          </button>
        </div>

        {target && (
          <div className="target-reveal">
            <p>Tvým cílem (komu děláš anděla) je:</p>
            <h3>{target}</h3>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </motion.div>

      <motion.div variants={itemVariants} className="admin-trigger" onClick={() => setShowAdmin(!showAdmin)}>
        {showAdmin ? 'Skrýt admin sekci' : 'Admin sekce (Generovat Anděly)'}
      </motion.div>

      {showAdmin && (
        <motion.div variants={itemVariants} className="card admin-card">
          <h3>Generovat hru Andělé</h3>
          <div className="input-group">
            <input
              type="password"
              placeholder="Admin heslo"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              disabled={loading}
            />
            <button onClick={handleGenerate} className="btn-danger" disabled={loading}>
              Vygenerovat anděly
            </button>
          </div>
          {adminStatus && <p className="status-message">{adminStatus}</p>}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Andele;
