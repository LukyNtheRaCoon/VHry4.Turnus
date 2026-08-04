import React, { useState, useEffect } from 'react';
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

interface PlayerScore {
  Jméno: string;
  Vítězství: string | number;
}

interface BettingState {
  isOpen: boolean;
  odds: Record<string, number>;
  activeBets: Record<string, { amount: number; betOn: string; odds?: number }>;
}

const ADMIN_PASSWORD = 'Adminlukyn';
const PLAYERS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQntCMPoKCiaMzKn0L1XvfK8LvqlG4pMrUFGvjPRacX7YozNaOJvlomX0hQNajBZCGqC2fo15q1nIkD/pub?output=csv';
const API_URL = 'https://script.google.com/macros/s/AKfycbwzeLpZzvuZnkS12FQL1_j6TkmcJM4lBqZK8zuF9oqVU2XTR3v_ICi2jGP15Q9Ro6Z62g/exec';

const DEFAULT_POINTS = 1000;

const Sazky: React.FC = () => {
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  
  const [accounts, setAccounts] = useState<Record<string, number>>({});
  const [betState, setBetState] = useState<BettingState>({ isOpen: false, odds: {}, activeBets: {} });
  
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [betAmount, setBetAmount] = useState<number | ''>('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Admin state
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminStatus, setAdminStatus] = useState<string | null>(null);
  const [winnerName, setWinnerName] = useState<string>('');

  const loadStateAndOdds = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL + '?action=getState');
      const stateData = await res.json();
      
      setAccounts(stateData.accounts || {});
      setBetState({
        isOpen: stateData.isOpen,
        activeBets: stateData.activeBets || {},
        odds: stateData.odds || {}
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Nepodařilo se načíst stav ze serveru. Zkontroluj připojení.');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Načtení dat při prvním otevření komponenty
  useEffect(() => {
    loadStateAndOdds();
  }, []);

  const handleLogin = () => {
    const normalizedName = playerNameInput.trim().toLowerCase();
    if (!normalizedName) return;
    
    setActivePlayer(normalizedName);
    setError(null);
    setSuccess(null);
  };

  const handleBet = async () => {
    if (!activePlayer || !selectedTarget || !betAmount || Number(betAmount) <= 0) {
      setError('Vyber hráče a zadej platnou částku.');
      return;
    }

    const amount = Number(betAmount);
    const balance = accounts[activePlayer] !== undefined ? accounts[activePlayer] : DEFAULT_POINTS;

    if (amount > balance) {
      setError('Nemáš dostatek bodů!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const targetOdds = betState.odds[selectedTarget] || 1;
      const url = `${API_URL}?action=placeBet&name=${encodeURIComponent(activePlayer)}&target=${encodeURIComponent(selectedTarget)}&amount=${amount}&odds=${targetOdds}`;
      
      const res = await fetch(url);
      const stateData = await res.json();
      
      if (stateData.error) {
        setError('Chyba serveru: ' + stateData.error);
        return;
      }

      setAccounts(stateData.accounts || {});
      setBetState(prev => ({
        ...prev,
        activeBets: stateData.activeBets || {}
      }));
      
      setSuccess('Sázka byla úspěšně přijata a uložena!');
      setBetAmount('');
      setSelectedTarget('');
    } catch (err) {
      console.error(err);
      setError('Nepodařilo se odeslat sázku.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminToggleBets = async (turnOn: boolean) => {
    if (adminPassword !== ADMIN_PASSWORD) {
      setAdminStatus('Špatné heslo!');
      return;
    }

    setLoading(true);
    setAdminStatus(turnOn ? 'Otevírám sázky a počítám kurzy...' : 'Zavírám sázky...');

    try {
      let oddsJsonStr = '{}';
      if (turnOn) {
        // Admin spočítá kurzy v momentě zapnutí a ty se uloží na server
        const data = await fetchSheetData<PlayerScore>(PLAYERS_SHEET_URL);
        const players = data.filter(row => row.Jméno?.trim());
        const victories = players.map(p => Number(String(p.Vítězství || '0').replace(',', '.')) || 0);
        const maxVictories = Math.max(...victories, 0);
        
        const newOdds: Record<string, number> = {};
        players.forEach(p => {
          const v = Number(String(p.Vítězství || '0').replace(',', '.')) || 0;
          let calculatedOdds = 1.2 + (maxVictories - v) * 0.6 + 0.6;
          newOdds[p.Jméno.trim().toLowerCase()] = parseFloat(calculatedOdds.toFixed(2));
        });
        oddsJsonStr = JSON.stringify(newOdds);
      }

      const res = await fetch(`${API_URL}?action=toggleBetting&isOpen=${turnOn}&oddsJson=${encodeURIComponent(oddsJsonStr)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      await loadStateAndOdds(); // Znovu načíst vše z nového serverového stavu
      setAdminStatus(turnOn ? 'Sázky úspěšně otevřeny! Kurzy jsou zamčené.' : 'Sázky byly uzavřeny.');
    } catch (err) {
      console.error(err);
      setAdminStatus('Chyba při komunikaci se serverem.');
      setLoading(false); // only toggle off loading if it failed, loadStateAndOdds handles success case
    }
  };

  const handleAdminEvaluate = async () => {
    if (adminPassword !== ADMIN_PASSWORD) {
      setAdminStatus('Špatné heslo!');
      return;
    }

    if (!winnerName.trim()) {
      setAdminStatus('Zadej jméno výherce pro vyhodnocení.');
      return;
    }

    setLoading(true);
    setAdminStatus('Vyhodnocuji sázky...');

    try {
      const res = await fetch(`${API_URL}?action=evaluateBets&winner=${encodeURIComponent(winnerName)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      await loadStateAndOdds(); // Znovu načíst čistý stav
      setAdminStatus(`Sázky vyhodnoceny! Výherce: ${winnerName}. Všechny aktivní sázky smazány.`);
      setWinnerName('');
    } catch (err) {
      console.error(err);
      setAdminStatus('Chyba při vyhodnocování.');
      setLoading(false);
    }
  };

  const getPlayerDisplayBalance = () => {
    if (!activePlayer) return 0;
    return accounts[activePlayer] !== undefined ? accounts[activePlayer] : DEFAULT_POINTS;
  };

  const activeBet = activePlayer ? betState.activeBets[activePlayer] : null;

  if (initialLoad) {
    return <motion.div className="game-page" initial="hidden" animate="visible" variants={itemVariants}><h2>Načítám data ze serveru...</h2></motion.div>;
  }

  return (
    <motion.div className="game-page" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 variants={itemVariants}>Sázky</motion.h1>
      <motion.p variants={itemVariants} style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.8 }}>Vyber si hru, na kterou chceš vsadit.</motion.p>

      <motion.div variants={itemVariants} className="sub-nav">
        <Link to="/sazky" className="active">Kissing Killer</Link>
        {/* Do budoucna: <Link to="/sazky/palermo">Palermo</Link> */}
      </motion.div>

      {!activePlayer ? (
        <motion.div variants={itemVariants} className="card">
          <h2>Identifikace sázkaře</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Tvoje jméno..."
              value={playerNameInput}
              onChange={(e) => setPlayerNameInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
            />
            <button onClick={handleLogin} disabled={loading}>Pokračovat</button>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Vítej, {playerNameInput}!</h2>
            <button onClick={() => setActivePlayer(null)} className="btn-secondary" style={{ padding: '0.5rem' }}>Změnit hráče</button>
          </div>
          
          <div className="balance-display" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
            Tvoje konto: {getPlayerDisplayBalance()} bodů
          </div>

          {!betState.isOpen ? (
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <h3>Sázky jsou aktuálně uzavřeny.</h3>
              <p>Počkej, až administrátor otevře sázky pro další kolo.</p>
              {activeBet && (
                <div style={{ marginTop: '1rem', color: '#ffcc00' }}>
                  <strong>Čekající sázka:</strong> Vsadil jsi {activeBet.amount} bodů na hráče "{activeBet.betOn}".
                </div>
              )}
            </div>
          ) : (
            <div>
              {activeBet ? (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(100, 108, 255, 0.1)', borderRadius: '8px', border: '1px solid rgba(100, 108, 255, 0.3)' }}>
                  <h3>Tvoje aktivní sázka</h3>
                  <p>
                    Vsadil jsi <strong>{activeBet.amount} bodů</strong> na výhru hráče <strong>{activeBet.betOn}</strong> 
                    {activeBet.odds ? ` (Kurz: ${activeBet.odds})` : ''}.
                  </p>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Možná výhra: {Math.floor(activeBet.amount * (activeBet.odds || betState.odds[activeBet.betOn] || 1))} bodů
                  </p>
                </div>
              ) : (
                <div>
                  <h3>Podej sázku</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>Vyber výherce:</label>
                      <select 
                        value={selectedTarget} 
                        onChange={(e) => setSelectedTarget(e.target.value)}
                        style={{ width: '100%' }}
                        disabled={loading}
                      >
                        <option value="">-- Vyber hráče --</option>
                        {Object.entries(betState.odds).map(([name, odds]) => (
                          <option key={name} value={name}>
                            {name} (Kurz: {odds})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>Částka (body):</label>
                      <input
                        type="number"
                        placeholder="Kolik chceš vsadit?"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value ? Number(e.target.value) : '')}
                        min="1"
                        max={getPlayerDisplayBalance()}
                        style={{ width: '100%' }}
                        disabled={loading}
                      />
                    </div>

                    {error && <p className="error-message" style={{ color: '#ff6b6b' }}>{error}</p>}
                    {success && <p className="status-message" style={{ color: '#51cf66' }}>{success}</p>}

                    <button onClick={handleBet} disabled={!selectedTarget || !betAmount || loading}>
                      {loading ? 'Odesílám...' : 'Vsadit'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Admin Sekce */}
      <motion.div variants={itemVariants} className="admin-trigger" onClick={() => setShowAdmin(!showAdmin)} style={{ marginTop: '2rem' }}>
        {showAdmin ? 'Skrýt admin sekci' : 'Admin sekce (Správa sázek)'}
      </motion.div>

      {showAdmin && (
        <motion.div variants={itemVariants} className="card admin-card">
          <h3>Správa sázek</h3>
          
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              placeholder="Admin heslo"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleAdminToggleBets(true)} 
              className={betState.isOpen ? "btn-secondary" : ""}
              disabled={loading || betState.isOpen}
            >
              Zapnout sázky a spočítat kurzy
            </button>
            <button 
              onClick={() => handleAdminToggleBets(false)} 
              className={!betState.isOpen ? "btn-secondary" : ""}
              disabled={loading || !betState.isOpen}
            >
              Vypnout sázky
            </button>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
            <h4>Vyhodnocení</h4>
            <div className="input-group">
              <input
                type="text"
                placeholder="Jméno výherce"
                value={winnerName}
                onChange={(e) => setWinnerName(e.target.value)}
                disabled={loading}
              />
              <button onClick={handleAdminEvaluate} className="btn-danger" disabled={loading}>
                Vyhodnotit
              </button>
            </div>
          </div>

          {adminStatus && <p className="status-message">{adminStatus}</p>}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sazky;
