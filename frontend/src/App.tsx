import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import CoinSet from './components/CoinSet';
import ThemeSwitcher from './components/ThemeSwitcher';
import { ThemeProvider } from './contexts/ThemeContext';
import coinData from './data/coin-data.json';

// Component to handle address redirection
const AddressRedirect: React.FC = () => {
  const { btcAddress } = useParams<{ btcAddress: string }>();
  
  React.useEffect(() => {
    if (btcAddress) {
      // Redirect to blockchain.com explorer
      const explorerUrl = `${coinData.blockchainApis.explorer}${btcAddress}`;
      window.location.href = explorerUrl;
    }
  }, [btcAddress]);

  return (
    <div className="redirecting">
      <div className="loading-spinner"></div>
      <p>Redirecting to blockchain explorer...</p>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <header className="header">
            <div className="header-content">
              <Link to="/" className="logo-link">
                <img src="/logo.png" alt="Bitcoin Logo" className="header-logo" />
                <div className="header-title">
                  <h1>RarityCheck</h1>
                  <p>Track Bitcoin Physical Coin Collections</p>
                </div>
              </Link>
              <ThemeSwitcher />
            </div>
          </header>

          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/address/:btcAddress" element={<AddressRedirect />} />
              {coinData.coinSets.map((set) => (
                <Route 
                  key={set.id} 
                  path={`/${set.id}`} 
                  element={<CoinSet coinSet={set} />} 
                />
              ))}
            </Routes>
          </main>

          <footer className="footer">
            <p>&copy; 2025 Luxlogik - Track Bitcoin Physical Coin Collections</p>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;