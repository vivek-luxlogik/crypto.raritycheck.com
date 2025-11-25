import React from 'react';
import { Link } from 'react-router-dom';
import './SeeNoEvil.css';

const SeeNoEvil: React.FC = () => {
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
    </div>
  );
};

export default SeeNoEvil;

