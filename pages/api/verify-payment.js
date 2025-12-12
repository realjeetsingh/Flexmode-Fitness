// pages/api/verify-payment.js
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const PRODUCTS = {
  'beginner-program': {
    name: 'FlexMode Beginner Program',
    pdfUrl: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_1',
  },
  'intermediate-program': {
    name: 'FlexMode Intermediate Program',
    pdfUrl: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_2',
  },
  'advanced-program': {
    name: 'FlexMode Advanced Program',
    pdfUrl: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_3',
  },
  'nutrition-guide': {
    name: 'FlexMode Nutrition Guide',
    pdfUrl: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_4',
  },
  'home-gym-bundle': {
    name: 'Home Gym Mastery Bundle',
    pdfUrl: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_5',
  },
  'full-bundle': {
    name: 'FlexMode Complete Bundle',
    pdfUrl: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_6',
  },
};

const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const emailTemplate = (name, productName, pdfUrl) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #D4AF37 0%, #e8c547 100%); color: #000; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
    .download-btn { display: inline-block; background: #D4AF37; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
    .download-btn:hover { background: #e8c547; }
    .footer { background: #0a0a0a; color: #fff; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Thank You for Your Purchase!</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your payment was successful! Your <strong>${productName}</strong> is ready to download.</p>
      
      <p><strong>What's Next?</strong></p>
      <ol>
        <li>Click the button below to download your PDF</li>
        <li>Check your email in 24 hours for bonus content (if applicable)</li>
        <li>Reply to this email if you have questions</li>
      </ol>

      <center>
        <a href="${pdfUrl}" class="download-btn">📥 Download Your PDF</a>
      </center>

      <p><strong>Direct Link:</strong><br>
      <a href="${pdfUrl}" style="color: #D4AF37; word-break: break-all;">${pdfUrl}</a></p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

      <p><strong>Need Help?</strong></p>
      <p>Reply to this email or visit our support page. We're here to help! 💪</p>

      <p>Welcome to the FlexMode community!</p>
      <p><strong>– FlexMode Team</strong></p>
    </div>
    <div class="footer">
      <p>&copy; 2025 FlexMode Fitness Systems. All rights reserved.</p>
      <p>Premium Training Programs | <a href="https://flexmode.in" style="color: #D4AF37;">Visit Website</a></p>
    </div>
  </div>
</body>
</html>
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      customer,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch');
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

    // Get product details
    const product = PRODUCTS[productId];
    if (!product) {
      return res.status(400).json({ success: false, error: 'Invalid product' });
    }

    // Send email with PDF link
    const transporter = getTransporter();
    const htmlEmail = emailTemplate(customer.name, product.name, product.pdfUrl);

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: customer.email,
      subject: `🎉 Your FlexMode Purchase - ${product.name}`,
      html: htmlEmail,
    });

    // Optional: Log to database or file
    console.log(`✅ Payment verified and email sent to ${customer.email}`);
    console.log({
      timestamp: new Date().toISOString(),
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      productId,
      customerEmail: customer.email,
      customerName: customer.name,
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified and email sent',
      paymentId: razorpay_payment_id,
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    return res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      details: err.message,
    });
  }
}
