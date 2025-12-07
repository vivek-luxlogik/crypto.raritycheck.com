import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBalances, BalanceData } from '../utils/blockchain';
import coinData from '../data/coin-data.json';
import './SeeNoEvil.css';

interface AddressInfo {
  serial: string;
  address: string;
}

const SeeNoEvil: React.FC = () => {
  const [addressesExpanded, setAddressesExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<AddressInfo[]>([]);
  const [balances, setBalances] = useState<Record<string, BalanceData>>({});
  const [searchFilters, setSearchFilters] = useState({
    serial: '',
    address: '',
    balance: '',
    status: ''
  });
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (addressesExpanded && addresses.length === 0) {
      loadAddresses();
    }
  }, [addressesExpanded]);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/data/see_no_evil_addresses.txt');
      if (!response.ok) {
        throw new Error('Failed to load addresses');
      }
      const text = await response.text();
      const lines = text.trim().split('\n');
      
      const loadedAddresses: AddressInfo[] = [];
      for (const line of lines) {
        if (line) {
          const [serial, address] = line.split(',');
          if (address?.trim()) {
            loadedAddresses.push({
              serial: serial?.trim() || '',
              address: address.trim()
            });
          }
        }
      }

      setAddresses(loadedAddresses);

      // Get balances
      const addressList = loadedAddresses.map(a => a.address);
      const [, balanceData] = await getBalances(addressList);
      setBalances(balanceData);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSearchFilter = (field: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearSearchFilters = () => {
    setSearchFilters({
      serial: '',
      address: '',
      balance: '',
      status: ''
    });
  };

  const filterAddresses = (addressList: AddressInfo[]) => {
    return addressList.filter(({ serial, address }) => {
      const balanceData = balances[address];
      const balance = balanceData?.final_balance?.toFixed(8) || '0.00000000';
      const status = balanceData?.status?.label || 'Unknown';
      
      const serialMatch = !searchFilters.serial || serial.toLowerCase().includes(searchFilters.serial.toLowerCase());
      const addressMatch = !searchFilters.address || address.toLowerCase().includes(searchFilters.address.toLowerCase());
      const balanceMatch = !searchFilters.balance || balance.includes(searchFilters.balance);
      const statusMatch = !searchFilters.status || status.toLowerCase().includes(searchFilters.status.toLowerCase());
      
      return serialMatch && addressMatch && balanceMatch && statusMatch;
    });
  };

  const openBlockchainExplorer = (address: string) => {
    window.open(`https://www.blockchain.com/explorer/addresses/btc/${address}`, '_blank');
  };

  const copyToClipboard = async (address: string, event: React.MouseEvent) => {
    // Prevent event from triggering row click or navigation
    event.stopPropagation();
    event.preventDefault();
    
    // CRITICAL VALIDATION: Ensure we have a valid address string
    // This guarantees we're copying the exact address from the button's row
    if (!address || typeof address !== 'string') {
      console.error('Invalid address provided for copying:', address);
      return;
    }

    // Use exact address from parameter - only trim whitespace
    // This ensures we copy the exact same address displayed in the table
    const addressToCopy = address.trim();
    
    // Additional validation: Bitcoin addresses are typically 26-62 characters
    // This is just a sanity check, not a hard requirement
    if (addressToCopy.length < 26 || addressToCopy.length > 62) {
      console.warn('Address length unusual:', addressToCopy.length, 'characters');
      // Still allow copy - might be a valid address outside typical range
    }
    
    try {
      // Modern Clipboard API - supported in all browsers since 2018
      // Only works in secure contexts (HTTPS or localhost)
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not supported in this browser');
      }

      if (!window.isSecureContext) {
        throw new Error('Clipboard API requires secure context (HTTPS)');
      }

      // Write exact address to clipboard
      // This is guaranteed to be the same address from the table row
      await navigator.clipboard.writeText(addressToCopy);
      
      // Show visual feedback
      setCopiedAddress(addressToCopy);
      setTimeout(() => {
        setCopiedAddress(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy address to clipboard:', error);
      // User-friendly fallback - show address in prompt they can copy from
      const userConfirmed = confirm(
        `Automatic copy is not available. The address is:\n\n${addressToCopy}\n\nClick OK to open a dialog where you can copy it manually.`
      );
      if (userConfirmed) {
        // prompt() allows user to select and copy the text
        prompt('Copy this address (Ctrl+C / Cmd+C):', addressToCopy);
      }
    }
  };

  const filteredAddresses = filterAddresses(addresses);
  const hasActiveFilters = searchFilters.serial || searchFilters.address || searchFilters.balance || searchFilters.status;

  return (
    <div className="see-no-evil">
      <Link to="/" className="back-link">← Back to Collections</Link>
      
      {/* Hero Section */}
      <div className="hero-section">
        <img 
          src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/coin_background.png" 
          alt="See No Evil Coin"
          className="hero-image"
        />
        <h1 className="hero-title">🙈 INTRODUCING: SEE NO EVIL 🙈</h1>
        <p className="hero-subtitle">The First Release in the Three Wise Monkeys Series</p>
      </div>

      {/* Story Section */}
      <section className="content-section">
        <h2>📖 THE STORY BEHIND THE SERIES</h2>
        <p>
          The <a href="https://en.wikipedia.org/wiki/Three_wise_monkeys" target="_blank" rel="noopener noreferrer">Three Wise Monkeys</a> represent 
          an ancient principle: "see no evil, hear no evil, speak no evil." This philosophy embodies discretion, wisdom, 
          and the fundamental principles that align perfectly with Bitcoin's ethos of financial privacy and sovereignty.
        </p>
        <p>
          This exclusive series is a collaboration between RarityCheck and <strong><em>Ballet</em></strong>. Each coin has been 
          meticulously designed and minted at one of Europe's most sophisticated minting facilities in Germany.
        </p>
        <img 
          src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/box_front_2.png" 
          alt="Presentation Box"
          className="section-image"
        />
      </section>

      {/* Technical Specifications */}
      <section className="content-section">
        <h2>⚙️ TECHNICAL SPECIFICATIONS</h2>
        <table className="specs-table">
          <tbody>
            <tr>
              <td><strong>Material:</strong></td>
              <td>Pure Copper with Mirror Finish</td>
            </tr>
            <tr>
              <td><strong>Diameter:</strong></td>
              <td>39mm</td>
            </tr>
            <tr>
              <td><strong>Thickness:</strong></td>
              <td>2mm</td>
            </tr>
            <tr>
              <td><strong>Weight:</strong></td>
              <td>22 grams</td>
            </tr>
          </tbody>
        </table>
        <img 
          src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/bulk_coins.png" 
          alt="Bulk Coins"
          className="section-image"
        />
      </section>

      {/* Design Features */}
      <section className="content-section">
        <h2>🎨 DESIGN FEATURES</h2>
        
        <div className="design-features">
          <div className="feature-column">
            <h3>Obverse (Front):</h3>
            <ul>
              <li>Intricately detailed "See No Evil" monkey covering its eyes</li>
              <li>Surrounded by geometric Bitcoin-themed patterns</li>
              <li>"Money is not rock, metal or data, Money is trust in the system" text along the rim</li>
              <li>Bitcoin symbols (₿) integrated into the design</li>
              <li>"RC MINT" and "Ballet" branding</li>
              <li>Circuit board and blockchain motifs</li>
            </ul>
          </div>
          
          <div className="feature-column">
            <h3>Reverse (Back):</h3>
            <ul>
              <li>High-security holographic tamper-evident sticker</li>
              <li>Unique QR code for verification via Ballet Crypto app</li>
              <li>Rainbow holographic design with security features</li>
              <li>Certificate number repeated three times (printed, yellow label, copper engraved)</li>
              <li>Certificate number (CA series)</li>
            </ul>
          </div>
        </div>

        <div className="image-grid">
          <img 
            src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/coin_on_platform.png" 
            alt="Coin on Platform"
            className="grid-image"
          />
          <img 
            src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/coin_back_on_cloth.png" 
            alt="Coin Back"
            className="grid-image"
          />
        </div>
      </section>

      {/* What's Included */}
      <section className="content-section">
        <h2>📦 WHAT'S INCLUDED</h2>
        <div className="included-list">
          <div className="included-item">✅ One (1) "See No Evil" copper coin</div>
          <div className="included-item">✅ Premium black presentation box with gold foil printing</div>
          <div className="included-item">✅ Official Certificate of Authenticity</div>
          <div className="included-item">✅ Technical specification card</div>
          <div className="included-item">✅ Ballet Crypto integration for secure loading</div>
        </div>
        
        <div className="image-grid">
          <img 
            src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/coin_with_box.png" 
            alt="Coin with Box"
            className="grid-image"
          />
          <img 
            src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/coin_certificate.jpg" 
            alt="Certificate"
            className="grid-image"
          />
        </div>
      </section>

      {/* Available Editions */}
      <section className="content-section">
        <h2>🔢 AVAILABLE EDITIONS</h2>
        
        <div className="edition-card">
          <h3>1. Regular Coins (200 pieces)</h3>
          <ul>
            <li>Coin numbers: #001 through #200</li>
            <li>Certificate numbers: CA016201 through CA016400</li>
            <li>Fully loadable with Bitcoin via Ballet app</li>
            <li className="status-available">STATUS: AVAILABLE from #010(CA016210) till #200(CA016400)</li>
            <li className="auction-info">First 9 coins have been auctioned</li>
          </ul>
        </div>

        <div className="edition-card">
          <h3>2. TRIAL COINS - "SAMPLE" (3 pieces)</h3>
          <ul>
            <li>Special "Sample" designation</li>
            <li>Cannot be loaded (display purposes only)</li>
            <li>Includes all premium packaging</li>
            <li className="auction-info">These coins have been auctioned</li>
          </ul>
          <div className="sample-images">
            <img 
              src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/sample1.png" 
              alt="Sample 1"
              className="sample-image"
            />
            <img 
              src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/sample2.png" 
              alt="Sample 2"
              className="sample-image"
            />
            <img 
              src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/sample3.png" 
              alt="Sample 3"
              className="sample-image"
            />
          </div>
        </div>

        <div className="edition-card">
          <h3>3. TEST COIN (1 piece)</h3>
          <ul>
            <li>Unique "test_coin" label</li>
            <li>Cannot be loaded</li>
            <li>Slightly different design on the back</li>
            <li>Ultra-rare collector's item</li>
            <li className="auction-info">This coin has been auctioned</li>
          </ul>
          <img 
            src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/test_coin_1.png" 
            alt="Test Coin"
            className="section-image small"
          />
        </div>

        <div className="edition-card">
          <h3>4. PATTERN COINS (2 pieces)</h3>
          <ul>
            <li>No sticker application</li>
            <li>Not available for sale as of today</li>
            <li>Extremely rare prototype pieces</li>
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section className="content-section pricing-section">
        <h2>💰 PRICING</h2>
        <div className="pricing-card">
          <h3>Current Pricing:</h3>
          <div className="price-item">
            <strong>Regular coins (#010-#200):</strong> <span className="price">0.0011 BTC or $100 USD</span> (whichever is lower) + 0.001 BTC
          </div>
          <div className="price-item">
            <strong>Loading:</strong> All coins will be loaded post delivery.
          </div>
          <div className="price-item auction-info">
            <strong>Coin #001 till #009 + Sample coins + Test coin:</strong> Have been auctioned
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="content-section">
        <h2>🔐 SECURITY FEATURES</h2>
        <div className="security-grid">
          <div className="security-item">
            <strong>Ballet Crypto Integration:</strong> Industry-leading cold storage technology
          </div>
          <div className="security-item">
            <strong>Holographic Sticker:</strong> Multi-layer tamper-evident security
          </div>
          <div className="security-item">
            <strong>Triple Certificate Number:</strong> Printed, labeled, and engraved for verification
          </div>
          <div className="security-item">
            <strong>QR Code Authentication:</strong> Verifiable via Ballet app
          </div>
          <div className="security-item">
            <strong>Certificate of Authenticity:</strong> Numbered and traceable
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section className="content-section">
        <h2>📮 SHIPPING INFORMATION</h2>
        <ul className="shipping-list">
          <li><strong>Ships from:</strong> UK</li>
          <li><strong>Shipping costs:</strong> Free</li>
          <li><strong>International shipping:</strong> Available</li>
          <li><strong>Tracking:</strong> Provided for all orders</li>
        </ul>
      </section>

      {/* Coming Soon */}
      <section className="content-section coming-soon">
        <h2>🔮 COMING SOON</h2>
        <p>
          This is just the beginning! The remaining 400 coins have been minted and are awaiting sticker application by Ballet. 
          The complete Three Wise Monkeys series will include:
        </p>
        <div className="series-list">
          <div className="series-item available">1. <strong>See No Evil</strong> 🙈 - <span className="badge-available">NOW AVAILABLE</span></div>
          <div className="series-item">2. <strong>Hear No Evil</strong> 🙉 - <span className="badge-coming">COMING SOON</span></div>
          <div className="series-item">3. <strong>Speak No Evil</strong> 🙊 - <span className="badge-coming">COMING SOON</span></div>
        </div>
      </section>

      {/* Contact */}
      <section className="content-section contact-section">
        <h2>📞 CONTACT & ORDERING</h2>
        <p>To place an order or inquire about availability:</p>
        <div className="contact-links">
          <div className="contact-item">
            <strong>Website:</strong> <a href="https://www.raritycheck.com" target="_blank" rel="noopener noreferrer">www.raritycheck.com</a>
          </div>
          <div className="contact-item">
            <strong>PM us on BitcoinTalk</strong>
          </div>
          <div className="contact-item">
            <strong>Email:</strong> <a href="mailto:contact@raritycheck.com">contact@raritycheck.com</a>
          </div>
        </div>
        <div className="powered-by">
          <strong>Powered by</strong> 
          <img 
            src="https://rcpublicbucket.s3.us-east-1.amazonaws.com/monkey_coin_see_no_evil/ballet_log_transparent_bg.png" 
            alt="Ballet"
            className="ballet-logo"
          />
        </div> 
      </section>
 
      <section className="cta-section">
        <h2>Don't miss this opportunity to own a piece of physical Bitcoin history!</h2>
        <p className="cta-text">Reserve your "See No Evil" coin today! 🙈</p>
      </section>

      {/* Expandable Address Section */}
      <section className="content-section address-section">
        <button
          className="address-section-toggle"
          onClick={() => setAddressesExpanded(!addressesExpanded)}
          aria-expanded={addressesExpanded}
        >
          <h2>🔍 VIEW ALL ADDRESSES & TRACK STATUS</h2>
          <span className="toggle-icon">{addressesExpanded ? '▼' : '▶'}</span>
        </button>

        {addressesExpanded && (
          <div className="address-section-content">
            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading addresses and balances...</p>
              </div>
            ) : (
              <>
                <div className="address-info">
                  <p>Track the blockchain status of all {addresses.length} See No Evil coins (CA016201 - CA016400)</p>
                  {hasActiveFilters && (
                    <button className="clear-search-btn" onClick={clearSearchFilters}>
                      Clear Search Filters
                    </button>
                  )}
                </div>

                <div className="address-table-container">
                  <table className="addresses-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="search-header">
                            <span>Certificate Number</span>
                            <input
                              type="text"
                              placeholder="Search serial..."
                              value={searchFilters.serial}
                              onChange={(e) => updateSearchFilter('serial', e.target.value)}
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
                              value={searchFilters.address}
                              onChange={(e) => updateSearchFilter('address', e.target.value)}
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
                              value={searchFilters.balance}
                              onChange={(e) => updateSearchFilter('balance', e.target.value)}
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
                              value={searchFilters.status}
                              onChange={(e) => updateSearchFilter('status', e.target.value)}
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
                          >
                            <td>
                              <span className="serial-number">{serial}</span>
                            </td>
                            <td>
                              <div className="address-cell">
                                <button
                                  className="address-link"
                                  onClick={() => openBlockchainExplorer(address)}
                                  title="View on Blockchain Explorer"
                                >
                                  {address}
                                </button>
                                <button
                                  className={`copy-button ${copiedAddress === address ? 'copied' : ''}`}
                                  onClick={(e) => copyToClipboard(address, e)}
                                  title={copiedAddress === address ? 'Copied!' : 'Copy address'}
                                  type="button"
                                >
                                  {copiedAddress === address ? '✓' : '📋'}
                                </button>
                              </div>
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
                      {filteredAddresses.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                            No addresses found matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default SeeNoEvil;

