# 🚀 QUICK SETUP GUIDE - Midnight Brunch

## Complete in 5 Minutes!

### Step 1: Download All Files
Download all these files to a folder called `midnight-brunch`:
- package.json
- server.js
- .env.example
- index.html
- admin.html
- .gitignore
- README.md

### Step 2: Open in VS Code
1. Open VS Code
2. File → Open Folder → Select `midnight-brunch` folder
3. Open the integrated terminal (Ctrl + ` or View → Terminal)

### Step 3: Install Dependencies
In the terminal, run:
```bash
npm install
```

### Step 4: Configure Settings
1. Rename `.env.example` to `.env`
2. Update these critical settings in `.env`:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password-here
   RESTAURANT_EMAIL=mrbreakfast@example.com
   WHATSAPP_NUMBER=18765551234
   PRICE_PER_PERSON=5500
   ```

### Step 5: Get Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search for "App passwords"
4. Create new app password for "Mail"
5. Copy the password to `.env` as `EMAIL_PASS`

### Step 6: Start Backend
In VS Code terminal:
```bash
npm start
```

You should see the success message with the API running on port 3000.

### Step 7: Start Frontend
**Option A - VS Code Extension (Easiest)**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` 
3. Click "Open with Live Server"

**Option B - Python**
Open a NEW terminal (keep backend running) and run:
```bash
python -m http.server 8080
```

**Option C - Node.js**
```bash
npx http-server -p 8080
```

### Step 8: Access Your Site
- **Customer Website**: http://localhost:8080/index.html
- **Admin Dashboard**: http://localhost:8080/admin.html

---

## ✅ Checklist

Before going live, verify:
- [ ] Backend server running (terminal shows success message)
- [ ] Frontend accessible in browser
- [ ] Test form submission works
- [ ] Confirmation emails arrive
- [ ] Admin dashboard shows orders
- [ ] Price calculation is correct ($5,500 per person)

---

## 🆘 Quick Troubleshooting

**"Cannot find module"**
```bash
npm install
```

**"Port 3000 already in use"**
```bash
# Change PORT in .env to 3001
PORT=3001
```

**"Email not sending"**
- Check Gmail App Password is correct
- Verify EMAIL_USER is your full Gmail address
- Check 2-Factor Authentication is enabled

**"CORS error in browser"**
- Make sure backend is running
- Check API_URL in index.html matches your backend
- Default: `http://localhost:3000/api`

---

## 📱 Test Order Workflow

1. Open customer website
2. Fill in form:
   - Name: Test Customer
   - Email: your-test@email.com
   - Phone: 876-555-1234
   - Guests: 2
3. Click "Reserve My Spot"
4. Check email for confirmation
5. Open admin dashboard
6. Verify order appears
7. Update status to "Confirmed"

---

## 🚀 Going Live

When ready to deploy:

1. **Backend**: Deploy to Heroku, Railway, or Render
2. **Frontend**: Deploy to Netlify, Vercel, or GitHub Pages
3. **Update API_URL**: Change in index.html and admin.html to your production API
4. **Update CORS**: In server.js, change `FRONTEND_URL` to your production domain
5. **SSL**: Ensure HTTPS is enabled on both frontend and backend

---

## 💡 Pro Tips

- Keep terminal open to see API requests in real-time
- Use admin dashboard to monitor orders during event
- Export CSV before event for backup
- Test email delivery 24 hours before event
- Have WhatsApp ready as backup contact method

---

## 📞 Need Help?

Check the full README.md for detailed documentation on:
- All API endpoints
- Email configuration
- Database structure
- Deployment guides
- Security best practices

**Ready to accept pre-orders! 🌙✨**
