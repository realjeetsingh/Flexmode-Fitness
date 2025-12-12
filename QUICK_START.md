# FlexMode Next.js - Quick Start Guide

## 📦 What You've Got

Complete Next.js + Razorpay + Gmail integration for your fitness e-books store.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create the Next.js Project
```bash
npx create-next-app@latest flexmode-store
# Choose: TypeScript: No, ESLint: Yes, Tailwind: No, src/ dir: No

cd flexmode-store
npm install razorpay nodemailer
```

### Step 2: Copy API Routes
Create these files in `pages/api/`:
- `create-order.js` (from artifact)
- `verify-payment.js` (from artifact)

### Step 3: Create Components & Utils
Create these directories and files:
```
components/
  └── CheckoutModal.jsx

utils/
  ├── razorpay.js
  └── products.js
```

### Step 4: Replace Home Page
Replace `pages/index.js` with the one provided

### Step 5: Setup Environment Variables
Create `.env.local` with:
```
RAZORPAY_KEY_ID=rzp_test_1DP5MMOk9HVJBB
RAZORPAY_KEY_SECRET=your_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1DP5MMOk9HVJBB

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

FROM_EMAIL="FlexMode <noreply@flexmode.in>"
BASE_URL=http://localhost:3000
```

### Step 6: Run It
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🔧 Configuration

### Update PDF URLs
In `verify-payment.js`, update the `PRODUCTS` object with your Google Drive links:
```javascript
'beginner-program': {
  name: 'FlexMode Beginner Program',
  pdfUrl: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_HERE',
}
```

### Get Google Drive File IDs
1. Upload PDF to Google Drive
2. Right-click → Share → Make "Anyone with the link can view"
3. Copy the link: `https://drive.google.com/file/d/FILE_ID_HERE/view?usp=sharing`
4. Use that FILE_ID in pdfUrl

---

## 🧪 Test Payment Flow

1. Click "Buy Now" on any product
2. Fill in customer details:
   - Name: Test User
   - Email: your-email@gmail.com
   - Phone: 1234567890
   - City: Test City
3. Click "Proceed to Payment"
4. Use test card: `4111 1111 1111 1111`
5. Any future date (e.g., 12/25)
6. Any 3-digit CVV

---

## 📧 Email Setup (Gmail App Password)

1. Go to: https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to **App Passwords**
4. Select Mail + Your Device
5. Copy the 16-character password
6. Add to `.env.local` as `EMAIL_PASS`

---

## 🚢 Deploy to Vercel

```bash
git init
git add .
git commit -m "Initial FlexMode setup"
git push -u origin main

# Visit vercel.com, import repo, add env variables
```

---

## 📊 What Happens When Customer Buys

1. ✅ Customer fills form → clicks "Proceed to Payment"
2. ✅ Next.js calls `/api/create-order` → Razorpay creates order
3. ✅ Razorpay opens payment modal
4. ✅ Customer pays (test or real)
5. ✅ Razorpay returns to frontend with payment ID
6. ✅ Frontend calls `/api/verify-payment` with signature
7. ✅ Backend verifies signature with Razorpay secret
8. ✅ Backend sends email with PDF download link
9. ✅ Success message shown to customer
10. ✅ Customer gets email with PDF download

---

## 🎯 Next Steps

### Optional but Recommended:
1. Add MongoDB to store orders
2. Add retry logic for failed emails
3. Create admin dashboard to view orders
4. Set up Cloudflare R2 for PDF storage (cheaper than GDrive)
5. Add custom domain email (noreply@yourdomain.com)

---

## 💡 Pro Tips

- **Test Mode**: Use `rzp_test_*` keys to test without charging
- **Production Mode**: Switch to `rzp_live_*` keys when ready
- **PDF Links**: Use direct download links (not share links)
- **Email Delivery**: Check Gmail spam folder during testing
- **Logs**: Check browser console (frontend) and server logs (API)

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Razorpay not defined" | Clear browser cache, restart dev server |
| Email not sending | Check GMAIL_PASS is 16 chars (with spaces) |
| Signature mismatch | Verify RAZORPAY_KEY_SECRET is correct |
| API route not found | Check file is in `pages/api/` folder |
| CORS errors | Should not happen with Next.js API routes |

---

## 📱 Mobile Responsive

The design is fully responsive. Test on:
- iPhone 12 (390px)
- iPad (768px)
- Desktop (1200px+)

---

## 💳 Real Payment (When Ready)

1. Get Razorpay live keys from dashboard
2. Update `.env.local`:
   ```
   RAZORPAY_KEY_ID=rzp_live_xxx
   RAZORPAY_KEY_SECRET=secret_xxx
   ```
3. Update product prices in `create-order.js`
4. Redeploy to Vercel
5. Test with real card (small amount)

---

## 📞 Support

For issues:
1. Check Razorpay dashboard → Payments
2. Check Gmail sent folder
3. Check Next.js server logs
4. Check browser console for errors

---

**You're all set! 🎉 Start selling fitness programs today!**
