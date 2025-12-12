// components/CheckoutModal.jsx
import { useState } from 'react';
import { loadRazorpayScript } from '../utils/razorpay';

const CheckoutModal = ({ isOpen, product, onClose, onSuccess }) => {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  const subtotal = product.price;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!customer.name || !customer.email || !customer.phone || !customer.city) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      setError('Invalid email address');
      return false;
    }
    if (!/^[0-9]{10}$/.test(customer.phone.replace(/[^0-9]/g, ''))) {
      setError('Phone number must be 10 digits');
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Step 1: Create order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Step 2: Load Razorpay
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Step 3: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FlexMode Fitness Systems',
        description: product.name,
        order_id: orderData.orderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        handler: async (response) => {
          // Step 4: Verify payment
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              productId: product.id,
              customer,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            onSuccess(response.razorpay_payment_id);
          } else {
            throw new Error(verifyData.error || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled');
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={() => !loading && onClose()}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Complete Your Purchase</h2>

        <div className="modal-section">
          <h3>Order Summary</h3>
          <div className="product-summary">
            <div className="summary-row">
              <span>{product.name}</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="modal-section">
          <h3>Your Details</h3>
          {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</div>}
          
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="form-group">
            <label>City/Location *</label>
            <input
              type="text"
              name="city"
              value={customer.city}
              onChange={handleChange}
              placeholder="Enter your city"
            />
          </div>
        </div>

        <button 
          className="btn-checkout" 
          onClick={handleCheckout}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;
