// pages/api/create-order.js
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PRODUCTS = {
  'beginner-program': { name: 'FlexMode Beginner Program', price: 499 },
  'intermediate-program': { name: 'FlexMode Intermediate Program', price: 699 },
  'advanced-program': { name: 'FlexMode Advanced Program', price: 899 },
  'nutrition-guide': { name: 'FlexMode Nutrition Guide', price: 399 },
  'home-gym-bundle': { name: 'Home Gym Mastery Bundle', price: 1199 },
  'full-bundle': { name: 'FlexMode Complete Bundle', price: 1999 },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productId } = req.body;
    const product = PRODUCTS[productId];

    if (!product) {
      return res.status(400).json({ error: 'Invalid product' });
    }

    const gstAmount = product.price * 0.18;
    const totalAmount = Math.round((product.price + gstAmount) * 100); // in paise

    const options = {
      amount: totalAmount,
      currency: 'INR',
      receipt: `flexmode_${productId}_${Date.now()}`,
      notes: {
        productId,
        productName: product.name,
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      productId,
      productName: product.name,
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
}
