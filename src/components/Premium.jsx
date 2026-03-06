import { useState } from 'react';

export default function Premium({ user, themeColors, onClose }) {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [premiumActive, setPremiumActive] = useState(localStorage.getItem(`premium_${user?.id}`) === 'true');
  const [investOpen, setInvestOpen] = useState(false);

  const PREMIUM_PRICE = 2000;

  const aiStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', risk: 'Low', return: '12%', reason: 'Stable dividend payer' },
    { symbol: 'INFY', name: 'Infosys', risk: 'Medium', return: '18%', reason: 'Tech growth play' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', risk: 'Medium', return: '22%', reason: 'Finance sector growth' },
    { symbol: 'HCLTECH', name: 'HCL Technologies', risk: 'Medium', return: '15%', reason: 'IT sector potential' },
  ];

  const API_BASE = (window?.location?.hostname === 'localhost') ? 'http://localhost:5000' : '';

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    try {
      // Create order on backend
      const resp = await fetch(`${API_BASE}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: PREMIUM_PRICE }),
      });
      const data = await resp.json();
      if (!data?.order) {
        alert('Failed to create payment order.');
        return;
      }

      const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!ok) {
        alert('Could not load payment SDK.');
        return;
      }

      const options = {
        key: data.key_id || data.order.key_id || '',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Tigon Finance',
        description: 'Premium Annual Plan',
        order_id: data.order.id,
        handler: async function (response) {
          // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          const verify = await fetch(`${API_BASE}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verifyJson = await verify.json();
          if (verifyJson.ok) {
            localStorage.setItem(`premium_${user?.id}`, 'true');
            localStorage.setItem(`premium_date_${user?.id}`, new Date().toISOString());
            setPremiumActive(true);
            setShowPayment(false);
            alert('✅ Payment successful and verified! Premium activated.');
            try { window.open(`${API_BASE}/invoice/${user?.id}`, '_blank'); } catch (err) { console.error(err); }
          } else {
            alert('Payment completed but verification failed. Contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: { color: themeColors.accent },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', function (resp) {
        console.error('Payment failed', resp);
        alert('Payment failed or cancelled.');
      });
    } catch (err) {
      console.error(err);
      alert('Payment error. Check console for details.');
    }
  };

  if (premiumActive) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.card, backgroundColor: themeColors.cardBg, width: 'min(1100px, 96%)' }}>
          <button onClick={onClose} style={{ ...styles.backBtn, color: themeColors.text }}>← Back to Dashboard</button>
          <button onClick={onClose} style={{ ...styles.closeBtn, color: themeColors.text }}>✕</button>
          <h2 style={{ color: themeColors.text }}>🚀 AI Stock Recommendations</h2>
          <p style={{ color: themeColors.textSecondary, marginBottom: '30px' }}>Based on your income (₹{localStorage.getItem(`tigon_income_${user?.id}`) || '0'}) and expenses</p>

          <div style={styles.stockGrid}>
            {aiStocks.map((stock, idx) => (
              <div key={idx} style={{ ...styles.stockCard, borderColor: stock.risk === 'Low' ? '#4ade80' : '#f97316' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: themeColors.text, margin: 0, fontSize: '18px' }}>{stock.symbol}</h4>
                    <p style={{ color: themeColors.textSecondary, fontSize: '12px', margin: '4px 0 0 0' }}>{stock.name}</p>
                  </div>
                  <span style={{ fontSize: '20px' }}>📈</span>
                </div>
                <p style={{ color: themeColors.textSecondary, fontSize: '13px', margin: '12px 0' }}>{stock.reason}</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: stock.risk === 'Low' ? '#4ade80' : '#f97316' }}>Risk: {stock.risk}</span>
                  <span style={{ color: '#667eea' }}>Return: {stock.return}</span>
                </div>
                <button onClick={() => (premiumActive ? setInvestOpen(true) : setShowPayment(true))} style={{ ...styles.investBtn, marginTop: '12px', width: '100%' }}>{premiumActive ? 'Open Invest Options' : 'Invest Now'}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.card, backgroundColor: themeColors.cardBg, width: 'min(700px, 96%)', padding: '28px' }}>
          <button onClick={() => setShowPayment(false)} style={{ ...styles.closeBtn, color: themeColors.text }}>✕</button>
          <h2 style={{ color: themeColors.text, textAlign: 'center' }}>Unlock Premium</h2>

          {/* Bill */}
          <div style={{ ...styles.bill, backgroundColor: themeColors.bg, border: `1px solid ${themeColors.border}` }}>
            <h4 style={{ color: themeColors.text, margin: 0, marginBottom: '12px' }}>Invoice</h4>
            <div style={{ fontSize: '12px', color: themeColors.textSecondary, lineHeight: '1.8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Premium Annual Plan</span>
                <span style={{ color: themeColors.text, fontWeight: 'bold' }}>₹{PREMIUM_PRICE}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span>Tax (0%)</span>
                <span style={{ color: themeColors.text }}>₹0.00</span>
              </div>
              <div style={{ borderTop: `1px solid ${themeColors.border}`, paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total</span>
                <span style={{ color: '#667eea', fontSize: '14px' }}>₹{PREMIUM_PRICE}.00</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{ marginTop: '20px' }}>
            <p style={{ color: themeColors.text, fontWeight: 'bold', marginBottom: '12px' }}>Choose Payment Method</p>
            <div style={{ display: 'grid', gap: '10px' }}>
              {['card', 'upi', 'netbanking'].map((method) => (
                <label key={method} style={{ display: 'flex', alignItems: 'center', padding: '12px', border: `2px solid ${selectedPaymentMethod === method ? '#667eea' : themeColors.border}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: selectedPaymentMethod === method ? 'rgba(102,126,234,0.1)' : 'transparent' }}>
                  <input type="radio" checked={selectedPaymentMethod === method} onChange={() => setSelectedPaymentMethod(method)} style={{ marginRight: '10px' }} />
                  <span style={{ color: themeColors.text, fontWeight: '500' }}>{method === 'card' ? '💳 Credit/Debit Card' : method === 'upi' ? '📱 UPI' : '🏦 Net Banking'}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handlePayment} style={{ ...styles.payBtn, marginTop: '20px', width: '100%' }}>
            Pay ₹{PREMIUM_PRICE}
          </button>
        </div>
      </div>
    );
  }

  if (investOpen) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.card, backgroundColor: themeColors.cardBg, width: 'min(900px, 96%)' }}>
          <button onClick={() => setInvestOpen(false)} style={{ ...styles.backBtn, color: themeColors.text }}>← Back</button>
          <h2 style={{ color: themeColors.text }}>How to place orders</h2>
          <p style={{ color: themeColors.textSecondary }}>Tigon provides AI recommendations but does not execute trades directly. To invest, choose one of the broker options below. You can connect via broker APIs or use their apps/websites.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '18px' }}>
            {[
              { name: 'Zerodha (Kite)', url: 'https://kite.zerodha.com', note: 'API: Kite Connect' },
              { name: 'Upstox', url: 'https://upstox.com', note: 'API available for partners' },
              { name: 'Angel One', url: 'https://angelone.in', note: 'Retail trading + API' },
              { name: 'Groww', url: 'https://groww.in', note: 'Mutual funds + stocks' },
            ].map((b, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: '10px', backgroundColor: themeColors.bg, border: `1px solid ${themeColors.border}` }}>
                <h4 style={{ margin: 0, color: themeColors.text }}>{b.name}</h4>
                <p style={{ margin: '6px 0 10px 0', color: themeColors.textSecondary, fontSize: '13px' }}>{b.note}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={b.url} target="_blank" rel="noreferrer" style={{ ...styles.linkBtn }}>Open Site</a>
                  <button onClick={() => alert('To integrate: obtain broker API keys, implement OAuth/login flow, and place orders via backend.') } style={{ ...styles.smallBtn }}>Integration Guide</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '18px', color: themeColors.textSecondary }}>
            <h4 style={{ color: themeColors.text }}>Other options</h4>
            <ul>
              <li>Use a broker app (Zerodha/Upstox/Groww) and execute orders manually following our AI list.</li>
              <li>Integrate broker APIs (Kite Connect, Upstox API) to place orders from Tigon—requires backend work and user consent.</li>
              <li>Invest via mutual funds or SIPs directly through MF platforms (Groww, Kuvera).</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, backgroundColor: themeColors.cardBg, width: 'min(1000px, 96%)' }}>
        <button onClick={onClose} style={{ ...styles.closeBtn, color: themeColors.text }}>✕</button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: themeColors.text, fontSize: 'clamp(30px, 8vw, 48px)', margin: 0 }}>✨ Go Premium</h1>
          <p style={{ color: themeColors.textSecondary, fontSize: '16px', marginTop: '10px' }}>Unlock AI stock recommendations & investment insights</p>

          <div style={{ ...styles.priceBox, backgroundColor: themeColors.bg, border: `2px solid #667eea`, marginTop: '30px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea' }}>₹{PREMIUM_PRICE}</div>
            <div style={{ color: themeColors.textSecondary, fontSize: '14px', marginTop: '8px' }}>One-time payment • Lifetime access</div>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <h3 style={{ color: themeColors.text, marginBottom: '16px' }}>What You Get:</h3>
            {['💰 AI Stock Recommendations', '📊 Portfolio Analytics', '🤖 AI Investment Advisor', '📈 Real-time Market Updates'].map((feature, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: themeColors.text }}>
                <span style={{ marginRight: '10px' }}>✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setShowPayment(true)} style={styles.ctaBtn}>
            🚀 Unlock Premium Now
          </button>
          <button onClick={onClose} style={{ ...styles.ctaBtn, background: 'transparent', border: `2px solid ${themeColors.border}`, color: themeColors.text, marginTop: '12px' }}>
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '16px',
    overflowY: 'auto',
  },
  card: {
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '1100px',
    width: '100%',
    maxHeight: 'calc(100vh - 32px)',
    overflowY: 'auto',
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '18px',
    right: '18px',
    background: 'none',
    border: 'none',
    fontSize: '26px',
    cursor: 'pointer',
  },
  backBtn: {
    position: 'absolute',
    top: '18px',
    left: '18px',
    background: 'transparent',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '6px 10px',
    borderRadius: '8px',
  },
  priceBox: {
    borderRadius: '12px',
    padding: '30px',
  },
  stockGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  stockCard: {
    border: '2px solid',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: 'rgba(102,126,234,0.05)',
  },
  investBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  linkBtn: {
    background: 'transparent',
    color: '#667eea',
    border: `1px solid #667eea`,
    padding: '8px 10px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
  },
  smallBtn: {
    background: 'rgba(102,126,234,0.12)',
    color: '#334155',
    border: 'none',
    padding: '8px 10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  bill: {
    borderRadius: '12px',
    padding: '20px',
    marginTop: '20px',
  },
  payBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  ctaBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
