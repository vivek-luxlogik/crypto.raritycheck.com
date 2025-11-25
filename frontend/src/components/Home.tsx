import React from 'react';
import { Link } from 'react-router-dom';
import coinData from '../data/coin-data.json';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      {/* <div className="hero-section">
        <h1>Bitcoin Physical Coin Collections</h1>
        <p className="hero-subtitle">
          Track the rarity and status of Bitcoin physical coins by monitoring their blockchain addresses
        </p>
      </div> */}

      <div className="collections-grid">
        <h2>Available Collections</h2>
        <div className="collections-list">
          {coinData.coinSets.filter(set => set.id !== 'vibgyor-orange-compromised').map((set) => {
            // Special handling for see-no-evil to link to dedicated page
            const linkPath = set.id === 'see-no-evil' ? '/see-no-evil' : `/${set.id}`;
            return (
            <Link key={set.id} to={linkPath} className="collection-card">
              <div className="collection-header">
                <img 
                  src={set.coinTypes[0]?.frontImage || '/btc_logos/256.png'} 
                  alt={`${set.name} coin`}
                  className="collection-image"
                />
                <div className="collection-info">
                  <h3>{set.name}</h3>
                  <p className="collection-description">{set.description}</p>
                  <div className="collection-stats">
                    <span className="stat">
                      <strong>{set.totalCoins}</strong> coins
                    </span>
                    <span className="stat">
                      <strong>{set.coinTypes.length}</strong> types
                    </span>
                  </div>
                </div>
              </div>
              <div className="collection-types">
                {set.coinTypes.map((type, index) => (
                  <div key={index} className="coin-type-badge" style={{ borderColor: type.borderColor }}>
                    {type.name}
                  </div>
                ))}
              </div>
              {set.buyUrl && set.buyUrl.trim() !== '' && (
                <div className="collection-buy-section">
                  <a 
                    href={set.buyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="collection-buy-button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    🛒 Buy Now
                  </a>
                </div>
              )}
            </Link>
            );
          })}
        </div>
      </div>

      <div className="info-section">
        <h2>How It Works</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">🔍</div>
            <h3>Blockchain Monitoring</h3>
            <p>Each physical coin has a unique Bitcoin address that we monitor for activity and balance changes.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📊</div>
            <h3>Real-time Status</h3>
            <p>Track whether coins have been loaded with Bitcoin, partially redeemed, or fully spent.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🏆</div>
            <h3>Rarity Tracking</h3>
            <p>Understand the rarity and collectibility of different coin series and variants.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
