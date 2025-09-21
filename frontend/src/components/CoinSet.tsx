import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import coinData from '../data/coin-data.json';
import { getBalances } from '../utils/blockchain.ts';
import './CoinSet.css';

interface CoinType {
  type: string;
  name: string;
  material: string;
  borderColor: string;
  imagePath: string;
  frontImage?: string;
  backImage?: string;
  dataFile?: string;
  maxCoins?: number;
}

interface CoinSet {
  id: string;
  name: string;
  description: string;
  totalCoins: number;
  dataFile: string;
  buyUrl?: string;
  otherUrl?: string;
  coinTypes: CoinType[];
}

interface BalanceData {
  final_balance: number;
  status: {
    label: string;
    color: string;
  };
}

interface CoinSetProps {
  coinSet: CoinSet;
}

const CoinSet: React.FC<CoinSetProps> = ({ coinSet }) => {
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<Record<string, BalanceData>>({});
  const [, setSource] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('');
  const [addressMap, setAddressMap] = useState<Record<string, { serial: string; type: string }>>({});
  const [searchFilters, setSearchFilters] = useState<Record<string, {
    serial: string;
    address: string;
    balance: string;
    status: string;
  }>>({});
  const [hoveredImage, setHoveredImage] = useState<{ src: string; alt: string; x: number; y: number } | null>(null);

  useEffect(() => {
    loadCoinData();
  }, [coinSet]);

  useEffect(() => {
    if (coinSet.coinTypes.length > 0 && !activeTab) {
      setActiveTab(coinSet.coinTypes[0]?.type || '');
    }
  }, [coinSet.coinTypes, activeTab]);

  const loadCoinData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const allAddresses: string[] = [];
      const newAddressMap: Record<string, { serial: string; type: string }> = {};

      // Load addresses for each coin type
      for (const coinType of coinSet.coinTypes) {
        const dataFile = coinType.dataFile || coinSet.dataFile;
        if (dataFile) {
          try {
            const response = await fetch(`/data/${dataFile}`);
            if (!response.ok) {
              console.error(`Failed to load ${dataFile}: ${response.status}`);
              continue;
            }
            const text = await response.text();
            const lines = text.trim().split('\n');
            
            const maxCoins = coinType.maxCoins || coinSet.totalCoins || lines.length;
            for (let i = 0; i < Math.min(maxCoins, lines.length); i++) {
              const line = lines[i];
              if (line) {
                const [serial, address] = line.split(',');
                if (address?.trim()) {
                  allAddresses.push(address.trim());
                  newAddressMap[address.trim()] = { serial: serial?.trim() || '', type: coinType.type };
                }
              }
            }
          } catch (error) {
            console.error(`Error loading ${dataFile}:`, error);
          }
        }
      }

      if (allAddresses.length === 0) {
        throw new Error('No addresses found for this coin set');
      }

      // Update the address map state
      setAddressMap(newAddressMap);

      // Get balances from blockchain
      const [balanceSource, balanceData] = await getBalances(allAddresses);
      setSource(balanceSource);
      setBalances(balanceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load coin data');
    } finally {
      setLoading(false);
    }
  };

  const getAddressesByType = (coinType: CoinType) => {
    const addresses: Array<{ serial: string; address: string }> = [];
    
    // Get addresses for this specific coin type
    Object.entries(balances).forEach(([address]) => {
      // Find the serial number for this address from our addressMap
      const addressInfo = addressMap[address];
      if (addressInfo && addressInfo.type === coinType.type) {
        addresses.push({
          serial: addressInfo.serial,
          address
        });
      }
    });

    // Sort by serial number (convert to number for proper sorting)
    addresses.sort((a, b) => {
      const serialA = parseInt(a.serial) || 0;
      const serialB = parseInt(b.serial) || 0;
      return serialA - serialB;
    });

    return addresses.slice(0, coinType.maxCoins || 100);
  };

  const handleImageHover = (src: string, alt: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredImage({
      src,
      alt,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleImageLeave = () => {
    setHoveredImage(null);
  };


  const updateSearchFilter = (coinType: string, field: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [coinType]: {
        serial: '',
        address: '',
        balance: '',
        status: '',
        ...prev[coinType],
        [field]: value
      }
    }));
  };

  const getSearchFilters = (coinType: string) => {
    return searchFilters[coinType] || { serial: '', address: '', balance: '', status: '' };
  };

  const filterAddresses = (addresses: Array<{ serial: string; address: string }>, coinType: string) => {
    const filters = getSearchFilters(coinType);
    
    return addresses.filter(({ serial, address }) => {
      const balanceData = balances[address];
      const balance = balanceData?.final_balance?.toFixed(8) || '0.00000000';
      const status = balanceData?.status?.label || 'Unknown';
      
      const serialMatch = !filters.serial || serial.toLowerCase().includes(filters.serial.toLowerCase());
      const addressMatch = !filters.address || address.toLowerCase().includes(filters.address.toLowerCase());
      const balanceMatch = !filters.balance || balance.includes(filters.balance);
      const statusMatch = !filters.status || status.toLowerCase().includes(filters.status.toLowerCase());
      
      return serialMatch && addressMatch && balanceMatch && statusMatch;
    });
  };

  const clearSearchFilters = (coinType: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [coinType]: { serial: '', address: '', balance: '', status: '' }
    }));
  };

  const openBlockchainExplorer = (address: string) => {
    window.open(`https://blockstream.info/address/${address}`, '_blank');
  };

  if (loading) {
    return (
      <div className="coin-set">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading {coinSet.name} data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coin-set">
        <div className="error">
          <h2>Error Loading {coinSet.name}</h2>
          <p>{error}</p>
          <button onClick={loadCoinData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="coin-set">
      <div className="coin-set-header">
        <Link to="/" className="back-link">← Back to Collections</Link>
        <div className="coin-set-info">
          <div>
            <h1>{coinSet.name}</h1>
            <p className="coin-set-description">{coinSet.description}</p>
            <div className="coin-set-stats">
              <span className="stat">
                <strong>{coinSet.totalCoins}</strong> total coins
              </span>
              <span className="stat">
                <strong>{coinSet.coinTypes.length}</strong> coin types
              </span>
            </div>
            {coinSet.buyUrl && coinSet.buyUrl.trim() !== '' && (
              <div className="buy-section">
                <a 
                  href={coinSet.buyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="buy-button"
                >
                  🛒 Buy Now
                </a>
              </div>
            )}
          </div>
          {coinSet.coinTypes.length > 0 && coinSet.coinTypes[0]?.frontImage && (
            <div className="coin-set-header-image">
              <img 
                src={coinSet.coinTypes[0]?.frontImage} 
                alt={`${coinSet.name} front`}
                className="coin-set-front-image"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <div className="tabs-nav">
          {coinSet.coinTypes.map((coinType) => { 
            const addresses = getAddressesByType(coinType);
            return (
              <button
                key={coinType.type}
                className={`tab-button ${activeTab === coinType.type ? 'active' : ''}`}
                onClick={() => setActiveTab(coinType.type)}
                style={{ borderBottomColor: activeTab === coinType.type ? coinType.borderColor : 'transparent' }}
              >
                <div className="tab-content">
                  <div className="tab-info">
                    <span className="tab-name">{coinType.name}</span>
                    <span className="tab-count">{addresses.length} coins</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="tab-content-panel">
          {coinSet.coinTypes.map((coinType) => {
            if (activeTab !== coinType.type) return null;
            
            const addresses = getAddressesByType(coinType);
            const filteredAddresses = filterAddresses(addresses, coinType.type);
            const filters = getSearchFilters(coinType.type);
            
            return (
              <div key={coinType.type} className="coin-type-content">
                <div className="coin-type-header" style={{ borderColor: coinType.borderColor }}>
                  <div className="coin-type-image-container">
                    {coinType.frontImage && (
                      <img 
                        src={coinType.frontImage} 
                        alt={`${coinType.name} front`}
                        className="coin-type-image front-image"
                        onMouseEnter={(e) => handleImageHover(coinType.frontImage!, `${coinType.name} front`, e)}
                        onMouseLeave={handleImageLeave}
                      />
                    )}
                    {coinType.backImage && (
                      <img 
                        src={coinType.backImage} 
                        alt={`${coinType.name} back`}
                        className="coin-type-image back-image"
                        onMouseEnter={(e) => handleImageHover(coinType.backImage!, `${coinType.name} back`, e)}
                        onMouseLeave={handleImageLeave}
                      />
                    )}
                    {!coinType.frontImage && !coinType.backImage && (
                      <img 
                        src={coinType.imagePath} 
                        alt={`${coinType.name} coin`}
                        className="coin-type-image"
                        onMouseEnter={(e) => handleImageHover(coinType.imagePath, `${coinType.name} coin`, e)}
                        onMouseLeave={handleImageLeave}
                      />
                    )}
                  </div>
                  <div>
                    <h2>{coinType.name}</h2>
                    <p className="coin-type-material">{coinType.material}</p>
                    <p className="coin-type-count">{filteredAddresses.length} of {addresses.length} coins</p>
                    {(filters.serial || filters.address || filters.balance || filters.status) && (
                      <button 
                        className="clear-search-btn"
                        onClick={() => clearSearchFilters(coinType.type)}
                        title="Clear all search filters"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </div>

                <div className="coins-table-container">
                  <table className="coins-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="search-header">
                            <span>Serial Number</span>
                            <input
                              type="text"
                              placeholder="Search serial..."
                              value={filters.serial}
                              onChange={(e) => updateSearchFilter(coinType.type, 'serial', e.target.value)}
                              className="search-input"
                            />
                          </div>
                        </th>
                        <th>
                          <div className="search-header">
                            <span>BTC Address</span>
                            <input
                              type="text"
                              placeholder="Search address..."
                              value={filters.address}
                              onChange={(e) => updateSearchFilter(coinType.type, 'address', e.target.value)}
                              className="search-input"
                            />
                          </div>
                        </th>
                        <th>
                          <div className="search-header">
                            <span>Balance</span>
                            <input
                              type="text"
                              placeholder="Search balance..."
                              value={filters.balance}
                              onChange={(e) => updateSearchFilter(coinType.type, 'balance', e.target.value)}
                              className="search-input"
                            />
                          </div>
                        </th>
                        <th>
                          <div className="search-header">
                            <span>Status</span>
                            <input
                              type="text"
                              placeholder="Search status..."
                              value={filters.status}
                              onChange={(e) => updateSearchFilter(coinType.type, 'status', e.target.value)}
                              className="search-input"
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAddresses.map(({ serial, address }, index) => {
                        const balanceData = balances[address];
                        return (
                          <tr 
                            key={address} 
                            className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                            style={{ borderLeft: `4px solid ${coinType.borderColor}` }}
                          >
                            <td>
                              <span className="serial-number">
                                #{serial}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="address-link"
                                onClick={() => openBlockchainExplorer(address)}
                                title="View on Blockchain Explorer"
                              >
                                {address}
                              </button>
                            </td>
                            <td>
                              <span className="balance">
                                {balanceData?.final_balance?.toFixed(8) || '0.00000000'} BTC
                              </span>
                            </td>
                            <td>
                              <span 
                                className="status"
                                style={{ color: balanceData?.status?.color || '#000000' }}
                              >
                                {balanceData?.status?.label || 'Unknown'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="status-legend">
        <h3>Status Legend</h3>
        <div className="legend-grid">
          {Object.entries(coinData.statusTypes).map(([key, status]) => (
            <div key={key} className="legend-card">
              <div className="legend-indicator" style={{ backgroundColor: status.color }}></div>
              <div className="legend-text">
                <div className="legend-label">{status.label}</div>
                <div className="legend-description">{status.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {coinSet.otherUrl && coinSet.otherUrl.trim() !== '' && (
        <div className="buy-section">
          <a 
            href={coinSet.otherUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="buy-button"
          >
            Other
          </a>
        </div>
      )}

      {/* Hover Zoom Popup */}
      {hoveredImage && (
        <div 
          className="hover-zoom-popup"
          style={{
            position: 'fixed',
            left: hoveredImage.x - 300,
            top: hoveredImage.y - 300,
            zIndex: 10000,
            pointerEvents: 'none'
          }}
        >
          <img 
            src={hoveredImage.src} 
            alt={hoveredImage.alt}
            className="hover-zoom-image"
          />
        </div>
      )}
    </div>
  );
};

export default CoinSet;
