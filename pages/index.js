// pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import CheckoutModal from '../components/CheckoutModal';
import { PRODUCTS } from '../utils/products';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
  };

  const handlePaymentSuccess = (paymentId) => {
    handleCheckoutClose();
    setSuccessMessage(`✅ Payment successful! Check your email for the PDF download link. (Payment ID: ${paymentId})`);
    setTimeout(() => setSuccessMessage(''), 6000);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Head>
        <title>FlexMode - Fitness E-Books & Training Programs</title>
        <meta name="description" content="Premium fitness e-books with science-based training programs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style>{`
        :root {
          --primary: #000000;
          --secondary: #D4AF37;
          --text: #FFFFFF;
          --bg-dark: #0a0a0a;
          --bg-card: #1a1a1a;
          --border: #333333;
          --success: #4CAF50;
          --error: #ff6b6b;
          --warning: #ffa500;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, var(--bg-dark) 0%, #1a1a1a 100%);
          color: var(--text);
          line-height: 1.6;
          min-height: 100vh;
        }

        /* Navigation */
        nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(10, 10, 10, 0.95);
          border-bottom: 2px solid var(--secondary);
          padding: 1rem 0;
          box-shadow: 0 2px 20px rgba(212, 175, 55, 0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: 2px;
          background: linear-gradient(135deg, var(--secondary) 0%, #e8c547 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          gap: 3rem;
          list-style: none;
          align-items: center;
        }

        .nav-links a {
          color: var(--text);
          text-decoration: none;
          font-weight: 500;
          position: relative;
          transition: color 0.3s ease;
          cursor: pointer;
        }

        .nav-links a:hover {
          color: var(--secondary);
        }

        .btn-nav {
          background: var(--secondary);
          color: var(--primary);
          padding: 0.7rem 1.5rem;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .btn-nav:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        /* Hero Section */
        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 6rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .hero::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -5%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          letter-spacing: -1px;
          background: linear-gradient(135deg, var(--text) 0%, var(--secondary) 50%, var(--text) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: slideInDown 0.8s ease;
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero p {
          font-size: 1.2rem;
          color: #b0b0b0;
          margin-bottom: 2rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          animation: slideInUp 0.8s ease 0.2s both;
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: slideInUp 0.8s ease 0.4s both;
        }

        .btn-primary, .btn-secondary {
          padding: 1rem 2.5rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 1px;
          border: 2px solid var(--secondary);
        }

        .btn-primary {
          background: var(--secondary);
          color: var(--primary);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(212, 175, 55, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: var(--secondary);
        }

        .btn-secondary:hover {
          background: var(--secondary);
          color: var(--primary);
          transform: translateY(-3px);
        }

        /* Features Section */
        .features {
          max-width: 1200px;
          margin: 4rem auto;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.02) 100%);
          border-radius: 15px;
          border: 1px solid var(--border);
        }

        .section-title {
          text-align: center;
          margin-bottom: 3rem;
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--text);
        }

        .section-title span {
          color: var(--secondary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: var(--bg-card);
          padding: 2rem;
          border-radius: 10px;
          border: 1px solid var(--border);
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .feature-card:hover {
          border-color: var(--secondary);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.15);
          transform: translateY(-5px);
        }

        .feature-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: var(--secondary);
        }

        .feature-card p {
          color: #b0b0b0;
          font-size: 0.95rem;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2.5rem;
          margin-top: 3rem;
        }

        .product-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .product-card:hover {
          border-color: var(--secondary);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.2);
          transform: translateY(-8px);
        }

        .product-image {
          width: 100%;
          height: 280px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }

        .product-image img {
          width: 120px;
          height: 120px;
          object-fit: contain;
          filter: brightness(1.1);
        }

        .product-info {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .product-level {
          display: inline-block;
          background: rgba(212, 175, 55, 0.2);
          color: var(--secondary);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
          width: fit-content;
        }

        .product-name {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text);
        }

        .product-description {
          color: #b0b0b0;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          flex-grow: 1;
        }

        .product-features {
          list-style: none;
          margin-bottom: 1rem;
        }

        .product-features li {
          padding: 0.4rem 0;
          color: #d0d0d0;
          font-size: 0.85rem;
        }

        .product-features li::before {
          content: '✓ ';
          color: var(--secondary);
          font-weight: 700;
          margin-right: 0.5rem;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--secondary);
        }

        .btn-buy {
          background: var(--secondary);
          color: var(--primary);
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .btn-buy:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
        }

        /* CTA Section */
        .cta-section {
          max-width: 1200px;
          margin: 6rem auto;
          padding: 4rem;
          background: linear-gradient(135deg, var(--secondary) 0%, #e8c547 100%);
          border-radius: 15px;
          text-align: center;
          color: var(--primary);
        }

        .cta-section h2 {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          letter-spacing: -1px;
        }

        .cta-section p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .cta-button {
          background: var(--primary);
          color: var(--secondary);
          padding: 1rem 3rem;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 1px;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        /* Modal */
        .modal {
          display: none;
          position: fixed;
          z-index: 2000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          animation: fadeIn 0.3s ease;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px 0;
        }

        .modal.open {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: var(--bg-dark);
          padding: 2.5rem;
          border: 2px solid var(--secondary);
          border-radius: 15px;
          width: 90%;
          max-width: 550px;
          box-shadow: 0 20px 60px rgba(212, 175, 55, 0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .close {
          color: var(--secondary);
          float: right;
          font-size: 2rem;
          font-weight: bold;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .close:hover {
          color: #fff;
        }

        .modal h2 {
          color: var(--secondary);
          margin-bottom: 2rem;
          font-size: 2rem;
        }

        .modal-section {
          margin-bottom: 2rem;
        }

        .modal-section h3 {
          color: var(--text);
          font-size: 1.1rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--secondary);
        }

        .product-summary {
          background: var(--bg-card);
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          margin-bottom: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem;
        }

        .summary-row:last-child {
          padding-top: 0.8rem;
          border-top: 1px solid var(--border);
          margin-bottom: 0;
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--secondary);
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text);
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text);
          font-size: 1rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--secondary);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
        }

        .btn-checkout {
          width: 100%;
          background: var(--secondary);
          color: var(--primary);
          padding: 1rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 1px;
        }

        .btn-checkout:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
        }

        /* Footer */
        footer {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          border-top: 2px solid var(--secondary);
          padding: 3rem 0;
          margin-top: 6rem;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .footer-section h4 {
          color: var(--secondary);
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .footer-section ul {
          list-style: none;
        }

        .footer-section li {
          margin-bottom: 0.5rem;
        }

        .footer-section a {
          color: #b0b0b0;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-section a:hover {
          color: var(--secondary);
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          margin-top: 2rem;
          border-top: 1px solid var(--border);
          color: #808080;
          font-size: 0.9rem;
        }

        .success-message {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--success);
          color: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          z-index: 3000;
          animation: slideInRight 0.3s ease;
          max-width: 400px;
        }

        @keyframes slideInRight {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.2rem;
          }
          .hero p {
            font-size: 1rem;
          }
          .nav-links {
            gap: 1rem;
          }
          .modal-content {
            width: 95%;
          }
          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav>
        <div className="nav-container">
          <div className="logo">FLEXMODE</div>
          <ul className="nav-links">
            <li><a onClick={() => scrollToSection('features')}>Why Us</a></li>
            <li><a onClick={() => scrollToSection('shop')}>Shop</a></li>
            <li><a onClick={() => scrollToSection('contact')}>Contact</a></li>
            <li><button className="btn-nav" onClick={() => scrollToSection('shop')}>Get Started</button></li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Structured Training Programs for Every Level</h1>
          <p>Beginner, Intermediate, Advanced & Nutrition Guides — designed with RPE progression, weekly structure, and simple execution.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollToSection('shop')}>View All E-Books</button>
            <button className="btn-secondary" onClick={() => scrollToSection('features')}>Learn More</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <h2 className="section-title">Why <span>FlexMode</span> Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Science-Based Training</h3>
            <p>Programs follow proper progression, RPE, volume, and recovery principles for maximum results.</p>
          </div>
          <div className="feature-card">
            <h3>Clear PDF Guides</h3>
            <p>Easy-to-follow layouts, weekly plans, and home/gym versions for flexibility.</p>
          </div>
          <div className="feature-card">
            <h3>Nutrition Included</h3>
            <p>Calorie targets, macros, templates, sample meals, and grocery lists.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Transform Your Fitness Journey</h2>
        <p>Join thousands of people who've achieved their goals with FlexMode structured programs.</p>
        <button className="cta-button" onClick={() => scrollToSection('shop')}>Explore Programs Now</button>
      </section>

      {/* Shop */}
      <section id="shop" style={{ maxWidth: '1200px', margin: '4rem auto', padding: '2rem' }}>
        <h2 className="section-title">Choose Your <span>Program</span></h2>
        <p style={{ textAlign: 'center', color: '#b0b0b0', marginBottom: '2rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Select the e-book PDF that matches your fitness level or goal. All programs include detailed instructions, progression protocols, and nutrition guidance.
        </p>
        <div className="products-grid">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <span className="product-level">{product.level}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <ul className="product-features">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="product-footer">
                <span className="product-price">₹{product.price}</span>
                <button className="btn-buy" onClick={() => handleBuyClick(product)}>Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact">
        <div className="footer-content">
          <div className="footer-section">
            <h4>FlexMode</h4>
            <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>Premium fitness e-books and training programs designed by coaches for athletes of all levels.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={() => scrollToSection('features')}>Features</a></li>
              <li><a onClick={() => scrollToSection('shop')}>Shop</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Refund Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">YouTube</a></li>
              <li><a href="#">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 FlexMode Fitness Systems. All rights reserved.</p>
        </div>
      </footer>

      {/* Checkout Modal */}
      <div className={`modal ${isCheckoutOpen ? 'open' : ''}`} onClick={handleCheckoutClose}>
        <CheckoutModal
          isOpen={isCheckoutOpen}
          product={selectedProduct}
          onClose={handleCheckoutClose}
          onSuccess={handlePaymentSuccess}
        />
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
    </>
  );
}
