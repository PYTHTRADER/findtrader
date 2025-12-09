import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './components/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import TraderProfile from './pages/TraderProfile';
import SubmitTrader from './pages/SubmitTrader';
import Login from './pages/Login';
import Admin from './pages/Admin';
import About from './pages/About';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/trader/:id" element={<TraderProfile />} />
              <Route path="/submit" element={<SubmitTrader />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Layout>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;