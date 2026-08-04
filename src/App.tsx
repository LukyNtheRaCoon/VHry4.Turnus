import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import React, { Suspense } from 'react';
import './App.css';

// Lazy loading pages
const Home = React.lazy(() => import('./pages/Home'));
const KissingKiller = React.lazy(() => import('./pages/KissingKiller'));
const KissingKillerGame = React.lazy(() => import('./pages/KissingKillerGame'));
const Sazky = React.lazy(() => import('./pages/Sazky'));
const Andele = React.lazy(() => import('./pages/Andele'));
const Palermo = React.lazy(() => import('./pages/Palermo'));
const BobriciLayout = React.lazy(() => import('./pages/Bobrici/BobriciLayout'));
const Ukoly = React.lazy(() => import('./pages/Bobrici/Ukoly'));
const Hraci = React.lazy(() => import('./pages/Bobrici/Hraci'));
const HracDetail = React.lazy(() => import('./pages/Bobrici/HracDetail'));
const Zebricek = React.lazy(() => import('./pages/Bobrici/Zebricek'));
const PravidlaBobrici = React.lazy(() => import('./pages/Bobrici/PravidlaBobrici'));
const PravidlaKissingKiller = React.lazy(() => import('./pages/PravidlaKissingKiller'));
const PravidlaPalermo = React.lazy(() => import('./pages/PravidlaPalermo'));
const PravidlaAndele = React.lazy(() => import('./pages/PravidlaAndele'));
const HraciTopLayout = React.lazy(() => import('./pages/HraciTopLayout'));
const CelkovePoradi = React.lazy(() => import('./pages/CelkovePoradi'));
const Feedback = React.lazy(() => import('./pages/Feedback'));

// Simple loading fallback
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#646cff' }}>
    <h2>Načítám...</h2>
  </div>
);

function App() {
  return (
    <HashRouter>
      <div className="app-container">
        <header>
          <nav className="main-nav">
            <Link to="/" className="nav-logo">SPT 2. Turnus</Link>
            <div className="nav-links">
              <Link to="/">Domů</Link>
              <Link to="/celkove-poradi">Celkové pořadí</Link>
              <Link to="/hraci">Hráči</Link>
              <Link to="/bobrici">Bobříci</Link>
              <Link to="/kissing-killer">Kissing Killer</Link>
              <Link to="/palermo">Palermo</Link>
              <Link to="/andele">Andělé</Link>
              <Link to="/sazky">Sázky</Link>
              <Link to="/feedback">Feedback</Link>
            </div>
          </nav>
        </header>

        <main>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/celkove-poradi" element={<CelkovePoradi />} />
              <Route path="/kissing-killer" element={<KissingKiller />} />
              <Route path="/kissing-killer/game" element={<KissingKillerGame />} />
              <Route path="/kissing-killer/pravidla" element={<PravidlaKissingKiller />} />
              <Route path="/sazky" element={<Sazky />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/andele" element={<Andele />} />
              <Route path="/andele/pravidla" element={<PravidlaAndele />} />
              <Route path="/palermo" element={<Palermo />} />
              <Route path="/palermo/pravidla" element={<PravidlaPalermo />} />
              <Route path="/bobrici" element={<BobriciLayout />}>
                <Route index element={<Ukoly />} />
                <Route path="ukoly" element={<Ukoly />} />
                <Route path="hraci" element={<Hraci />} />
                <Route path="hraci/:id" element={<HracDetail />} />
                <Route path="zebricek" element={<Zebricek />} />
                <Route path="pravidla" element={<PravidlaBobrici />} />
              </Route>
              <Route path="/hraci" element={<HraciTopLayout />}>
                <Route index element={<Hraci />} />
                <Route path=":id" element={<HracDetail />} />
              </Route>
            </Routes>
          </Suspense>
        </main>

        <footer className="main-footer">
          <div className="footer-content">
            <div className="footer-info">
              <p className="made-by">Vyrobeno LukyNkem</p>
              <p>&copy; {new Date().getFullYear()} SPT 2. Turnus</p>
            </div>
            <div className="footer-links">
              <a href="https://www.sptlomnice.cz/2-turnus" target="_blank" rel="noopener noreferrer">Webovky</a>
              <a href="https://www.facebook.com/spt.lucane/" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://www.instagram.com/spt.lucane/" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
