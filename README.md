# Midnight Brunch - Pre-Order System

A complete full-stack application for managing pre-orders for the Midnight Brunch event at Mr. Breakfast Jamaica.

## 📋 Features

### Frontend
- ✨ Beautiful cosmic-themed website matching your event poster
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Animated starfield background with floating cosmic ribbons
- 💰 Real-time price calculation based on number of guests
- ✅ Form validation and error handling
- 📧 Email confirmation to customers and restaurant

### Backend
- 🚀 RESTful API built with Node.js & Express
- 💾 SQLite database for order storage
- 📧 Automated email notifications (customer + restaurant)
- 📊 Admin dashboard for order management
- 🔄 Real-time statistics and analytics
- 📥 CSV export functionality

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Email**: Nodemailer
- **Fonts**: Google Fonts (Orbitron, Playfair Display)

## 📦 Project Structure

```
midnight-brunch-backend/
├── server.js              # Main Express server
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── index.html            # Customer-facing website
├── admin.html            # Admin dashboard
├── preorders.db          # SQLite database (auto-created)
└── README.md             # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

Open VS Code, navigate to your project folder, and run:

```bash
npm install
```

This will install:
- express
- cors
- dotenv
- sqlite3
- nodemailer
- body-parser

### 2. Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Restaurant Contact
RESTAURANT_EMAIL=mrbreakfast@example.com
RESTAURANT_PHONE=+18765551234

# WhatsApp Configuration
WHATSAPP_NUMBER=18765551234

# Event Configuration
PRICE_PER_PERSON=5500
EVENT_DATE=Saturday, March 7, 2026
EVENT_TIME=7:00 PM - 1:00 AM
EVENT_LOCATION=17 Holborn Road, Kingston

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8080
```

### 3. Set Up Email (Gmail)

If using Gmail:

1. Go to your Google Account settings
2. Enable 2-factor authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password
4. Use this password in `.env` as `EMAIL_PASS`

**Alternative Email Providers:**
- **Outlook**: `smtp-mail.outlook.com`, port 587
- **Yahoo**: `smtp.mail.yahoo.com`, port 587
- **Custom SMTP**: Update host and port accordingly

### 4. Start the Backend Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

You should see:

```
╔════════════════════════════════════════════╗
║   🌙 MIDNIGHT BRUNCH API SERVER 🌙        ║
╚════════════════════════════════════════════╝

✓ Server running on port 3000
✓ Environment: development
✓ API Base URL: http://localhost:3000/api

📋 Available endpoints:
   GET    /api/health
   POST   /api/preorder
   GET    /api/preorders
   GET    /api/preorders/:id
   PUT    /api/preorders/:id/status
   DELETE /api/preorders/:id
   GET    /api/stats

🚀 Ready to accept pre-orders!
```

### 5. Serve the Frontend

You need a simple web server for the HTML files. Options:

**Option A: VS Code Live Server Extension**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

**Option B: Python HTTP Server**
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**Option C: Node.js http-server**
```bash
npx http-server -p 8080
```

### 6. Access the Application

- **Customer Website**: http://localhost:8080/index.html
- **Admin Dashboard**: http://localhost:8080/admin.html
- **API Health Check**: http://localhost:3000/api/health

## 📡 API Endpoints

### Public Endpoints

#### Submit Pre-Order
```http
POST /api/preorder
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "876-555-1234",
  "guests": 2,
  "dietary": "No pork"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pre-order submitted successfully!",
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "guests": 2,
    "total": 11000,
    "status": "pending",
    "created_at": "2026-01-04T12:00:00.000Z"
  },
  "emailsSent": {
    "customer": true,
    "restaurant": true
  }
}
```

### Admin Endpoints

#### Get All Pre-Orders
```http
GET /api/preorders
```

#### Get Single Pre-Order
```http
GET /api/preorders/:id
```

#### Update Order Status
```http
PUT /api/preorders/:id/status
Content-Type: application/json

{
  "status": "confirmed"
}
```

Valid statuses: `pending`, `confirmed`, `cancelled`, `completed`

#### Get Statistics
```http
GET /api/stats
```

#### Delete Pre-Order
```http
DELETE /api/preorders/:id
```

## 🎨 Customization

### Update Event Details

Edit the `.env` file:
- `PRICE_PER_PERSON`: Price per guest
- `EVENT_DATE`: Event date
- `EVENT_TIME`: Event time
- `EVENT_LOCATION`: Venue address

### Update Frontend API URL

In `index.html` and `admin.html`, update line:
```javascript
const API_URL = 'http://localhost:3000/api';
```

For production, change to your deployed API URL:
```javascript
const API_URL = 'https://api.yourwebsite.com/api';
```

### Customize Email Templates

Edit the email HTML in `server.js`:
- `getCustomerEmailHTML()` - Customer confirmation email
- `getRestaurantEmailHTML()` - Restaurant notification email

### Add WhatsApp Integration

WhatsApp is already configured as a backup. Update your number in `.env`:
```env
WHATSAPP_NUMBER=18765551234
```

## 📊 Database

The application uses SQLite for simplicity. The database is automatically created on first run.

### Tables

**preorders**
- id (PRIMARY KEY)
- name
- email
- phone
- guests
- dietary
- total
- status (pending/confirmed/cancelled/completed)
- created_at
- updated_at

**email_log**
- id (PRIMARY KEY)
- preorder_id (FOREIGN KEY)
- recipient
- subject
- status (sent/failed)
- error_message
- sent_at

### View Database

Use a SQLite browser like:
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- VS Code SQLite extension
- Command line: `sqlite3 preorders.db`

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, Render)

1. Push code to GitHub
2. Connect to hosting platform
3. Set environment variables in platform dashboard
4. Deploy

### Frontend Deployment (Netlify, Vercel, GitHub Pages)

1. Update API_URL in HTML files to production URL
2. Deploy static files
3. Configure CORS in backend to allow your frontend domain

### Update CORS Settings

In `server.js`, update the CORS configuration:
```javascript
app.use(cors({
    origin: 'https://your-frontend-domain.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
```

## 🔒 Security Notes

1. **Never commit .env file** - It's in .gitignore
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** in production
4. **Add authentication** for admin endpoints in production
5. **Rate limiting** - Consider adding for production
6. **Input validation** - Already implemented but can be enhanced
7. **SQL injection protection** - Using parameterized queries

## 📧 Email Troubleshooting

### Gmail Issues

**Error: "Username and Password not accepted"**
- Enable 2-factor authentication
- Use App Password, not your regular password
- Allow "Less secure apps" if not using App Password

### Testing Emails

Use a service like [Mailtrap](https://mailtrap.io/) for testing:
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-username
EMAIL_PASS=your-mailtrap-password
```

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
kill -9 $(lsof -t -i:3000)
```

### CORS Errors
Update `FRONTEND_URL` in `.env` to match your frontend URL

### Database Locked
Close any SQLite browser connections to `preorders.db`

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📈 Future Enhancements

- [ ] Payment integration (Stripe, PayPal)
- [ ] SMS notifications
- [ ] QR code tickets
- [ ] Waitlist functionality
- [ ] Customer portal for managing orders
- [ ] Multi-event support
- [ ] Advanced analytics dashboard
- [ ] Automated reminder emails

## 📞 Support

For issues or questions about this system:
- Check the code comments
- Review this README
- Test API endpoints with tools like Postman
- Check browser console for frontend errors
- Check server logs for backend errors

## 📄 License

Private use for Mr. Breakfast Jamaica

---

**Made with ❤️ for Mr. Breakfast Jamaica's Midnight Brunch Event**
