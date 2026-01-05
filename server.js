require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize SQLite Database
const db = new sqlite3.Database('./preorders.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('✓ Connected to SQLite database');
        initializeDatabase();
    }
const db = new sqlite3.Database('./preorders.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('✓ Connected to SQLite database');
        initializeDatabase();
    }
});

// Create tables if they don't exist
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS preorders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            guests INTEGER NOT NULL,
            dietary TEXT,
            total REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating preorders table:', err.message);
        } else {
            console.log('✓ Preorders table ready');
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS email_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            preorder_id INTEGER,
            recipient TEXT NOT NULL,
            subject TEXT NOT NULL,
            status TEXT NOT NULL,
            error_message TEXT,
            sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (preorder_id) REFERENCES preorders(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating email_log table:', err.message);
        } else {
            console.log('✓ Email log table ready');
        }
    });
}

// Email transporter setup (using Gmail as example)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email templates
function getCustomerEmailHTML(preorder) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Arial', sans-serif; background: #0a1628; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #050d1a; border: 2px solid #00ffd5; border-radius: 20px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #00ffd5 0%, #00e5ff 100%); padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 36px; color: #0a1628; font-weight: 900; }
        .content { padding: 40px 30px; }
        .content h2 { color: #00ffd5; margin-top: 0; }
        .details { background: rgba(0, 255, 213, 0.1); border: 1px solid #00ffd5; border-radius: 10px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: bold; color: #00ffd5; }
        .detail-value { color: #ffffff; }
        .total { background: #00ffd5; color: #0a1628; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .total-label { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
        .total-amount { font-size: 36px; font-weight: 900; }
        .footer { background: rgba(0, 255, 213, 0.05); padding: 30px; text-align: center; font-size: 14px; color: rgba(255,255,255,0.7); }
        .button { display: inline-block; background: #00ffd5; color: #0a1628; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MIDNIGHT BRUNCH</h1>
            <p style="margin: 10px 0 0; font-size: 14px; color: #0a1628; font-weight: bold;">RESERVATION CONFIRMED</p>
        </div>
        <div class="content">
            <h2>Hi ${preorder.name}! ✨</h2>
            <p>Thank you for your pre-order! We're thrilled to have you join us for an unforgettable Midnight Brunch experience.</p>
            
            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${process.env.EVENT_DATE}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${process.env.EVENT_TIME}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${process.env.EVENT_LOCATION}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Number of Guests:</span>
                    <span class="detail-value">${preorder.guests}</span>
                </div>
                ${preorder.dietary ? `
                <div class="detail-row">
                    <span class="detail-label">Dietary Requirements:</span>
                    <span class="detail-value">${preorder.dietary}</span>
                </div>
                ` : ''}
            </div>

            <div class="total">
                <div class="total-label">Total Amount</div>
                <div class="total-amount">$${preorder.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>

            <h3 style="color: #00ffd5;">What to Expect:</h3>
            <ul style="line-height: 1.8;">
                <li>3-course inclusive brunch experience</li>
                <li>High-energy atmosphere with great vibes</li>
                <li>Premium breakfast favorites reimagined</li>
                <li>An unforgettable night under the stars</li>
            </ul>

            <p><strong>Important:</strong> Please arrive by 7:00 PM to ensure you don't miss the first course!</p>

            <center>
                <a href="https://wa.me/${process.env.WHATSAPP_NUMBER}?text=Hi%20I%20have%20a%20question%20about%20my%20Midnight%20Brunch%20reservation" class="button">Contact Us on WhatsApp</a>
            </center>
        </div>
        <div class="footer">
            <p><strong>Mr. Breakfast Jamaica</strong></p>
            <p>${process.env.EVENT_LOCATION}</p>
            <p>Phone: ${process.env.RESTAURANT_PHONE}</p>
            <p style="margin-top: 20px; font-size: 12px;">
                If you need to cancel or modify your reservation, please contact us as soon as possible.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

function getRestaurantEmailHTML(preorder) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: #00ffd5; color: #0a1628; padding: 20px; text-align: center; }
        .content { background: white; padding: 30px; }
        .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #00ffd5; }
        .highlight { background: #00ffd5; color: #0a1628; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 NEW MIDNIGHT BRUNCH PRE-ORDER</h1>
        </div>
        <div class="content">
            <h2>Order #${preorder.id}</h2>
            <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
            
            <div style="margin: 20px 0;">
                <div class="detail-row">
                    <span class="label">Customer Name:</span> ${preorder.name}
                </div>
                <div class="detail-row">
                    <span class="label">Email:</span> <a href="mailto:${preorder.email}">${preorder.email}</a>
                </div>
                <div class="detail-row">
                    <span class="label">Phone:</span> <a href="tel:${preorder.phone}">${preorder.phone}</a>
                </div>
                <div class="detail-row">
                    <span class="label">Number of Guests:</span> ${preorder.guests}
                </div>
                ${preorder.dietary ? `
                <div class="detail-row">
                    <span class="label">Dietary Requirements:</span> ${preorder.dietary}
                </div>
                ` : ''}
            </div>

            <div class="highlight">
                TOTAL: $${preorder.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>

            <p style="margin-top: 30px;">
                <strong>Action Required:</strong> Please follow up with the customer to confirm payment details and finalize the reservation.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

// Send confirmation emails
async function sendConfirmationEmails(preorder) {
    const results = {
        customer: { success: false, error: null },
        restaurant: { success: false, error: null }
    };

    // Send email to customer
    try {
        const customerMailOptions = {
            from: `"Mr. Breakfast Jamaica" <${process.env.EMAIL_USER}>`,
            to: preorder.email,
            subject: '✨ Your Midnight Brunch Reservation is Confirmed!',
            html: getCustomerEmailHTML(preorder)
        };

        await transporter.sendMail(customerMailOptions);
        results.customer.success = true;

        // Log email
        db.run(`INSERT INTO email_log (preorder_id, recipient, subject, status) VALUES (?, ?, ?, ?)`,
            [preorder.id, preorder.email, customerMailOptions.subject, 'sent']);

    } catch (error) {
        console.error('Error sending customer email:', error);
        results.customer.error = error.message;
        
        // Log error
        db.run(`INSERT INTO email_log (preorder_id, recipient, subject, status, error_message) VALUES (?, ?, ?, ?, ?)`,
            [preorder.id, preorder.email, 'Customer Confirmation', 'failed', error.message]);
    }

    // Send notification to restaurant
    try {
        const restaurantMailOptions = {
            from: `"Midnight Brunch System" <${process.env.EMAIL_USER}>`,
            to: process.env.RESTAURANT_EMAIL,
            subject: `New Pre-Order: ${preorder.name} - ${preorder.guests} guests`,
            html: getRestaurantEmailHTML(preorder)
        };

        await transporter.sendMail(restaurantMailOptions);
        results.restaurant.success = true;

        // Log email
        db.run(`INSERT INTO email_log (preorder_id, recipient, subject, status) VALUES (?, ?, ?, ?)`,
            [preorder.id, process.env.RESTAURANT_EMAIL, restaurantMailOptions.subject, 'sent']);

    } catch (error) {
        console.error('Error sending restaurant email:', error);
        results.restaurant.error = error.message;

        // Log error
        db.run(`INSERT INTO email_log (preorder_id, recipient, subject, status, error_message) VALUES (?, ?, ?, ?, ?)`,
            [preorder.id, process.env.RESTAURANT_EMAIL, 'Restaurant Notification', 'failed', error.message]);
    }

    return results;
}

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Midnight Brunch API is running',
        timestamp: new Date().toISOString()
    });
});

// Submit pre-order
app.post('/api/preorder', async (req, res) => {
    const { name, email, phone, guests, dietary } = req.body;

    // Validation
    if (!name || !email || !phone || !guests) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: name, email, phone, and guests are required'
        });
    }

    const guestsNum = parseInt(guests);
    if (isNaN(guestsNum) || guestsNum < 1) {
        return res.status(400).json({
            success: false,
            error: 'Number of guests must be at least 1'
        });
    }

    // Calculate total
    const pricePerPerson = parseFloat(process.env.PRICE_PER_PERSON) || 7000;
    const total = guestsNum * pricePerPerson;

    // Insert into database
    const sql = `INSERT INTO preorders (name, email, phone, guests, dietary, total) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [name, email, phone, guestsNum, dietary || null, total], async function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to save pre-order'
            });
        }

        const preorderId = this.lastID;

        // Get the complete preorder data
        db.get('SELECT * FROM preorders WHERE id = ?', [preorderId], async (err, preorder) => {
            if (err) {
                console.error('Error retrieving preorder:', err.message);
                return res.status(500).json({
                    success: false,
                    error: 'Pre-order saved but could not retrieve details'
                });
            }

            // Send confirmation emails
            const emailResults = await sendConfirmationEmails(preorder);

            res.json({
                success: true,
                message: 'Pre-order submitted successfully!',
                data: {
                    id: preorder.id,
                    name: preorder.name,
                    email: preorder.email,
                    guests: preorder.guests,
                    total: preorder.total,
                    status: preorder.status,
                    created_at: preorder.created_at
                },
                emailsSent: {
                    customer: emailResults.customer.success,
                    restaurant: emailResults.restaurant.success
                }
            });
        });
    });
});

// Get all pre-orders (admin view)
app.get('/api/preorders', (req, res) => {
    const sql = 'SELECT * FROM preorders ORDER BY created_at DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to retrieve pre-orders'
            });
        }

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    });
});

// Get single pre-order by ID
app.get('/api/preorders/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM preorders WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to retrieve pre-order'
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                error: 'Pre-order not found'
            });
        }

        res.json({
            success: true,
            data: row
        });
    });
});

// Update pre-order status
app.put('/api/preorders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
    }

    const sql = 'UPDATE preorders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    
    db.run(sql, [status, id], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to update pre-order status'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'Pre-order not found'
            });
        }

        res.json({
            success: true,
            message: 'Pre-order status updated successfully',
            data: { id: parseInt(id), status }
        });
    });
});

// Get statistics
app.get('/api/stats', (req, res) => {
    const queries = {
        totalOrders: 'SELECT COUNT(*) as count FROM preorders',
        totalGuests: 'SELECT SUM(guests) as total FROM preorders',
        totalRevenue: 'SELECT SUM(total) as total FROM preorders',
        statusBreakdown: 'SELECT status, COUNT(*) as count FROM preorders GROUP BY status'
    };

    const stats = {};

    db.get(queries.totalOrders, [], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        stats.totalOrders = row.count;

        db.get(queries.totalGuests, [], (err, row) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            stats.totalGuests = row.total || 0;

            db.get(queries.totalRevenue, [], (err, row) => {
                if (err) return res.status(500).json({ success: false, error: err.message });
                stats.totalRevenue = row.total || 0;

                db.all(queries.statusBreakdown, [], (err, rows) => {
                    if (err) return res.status(500).json({ success: false, error: err.message });
                    stats.statusBreakdown = rows;

                    res.json({
                        success: true,
                        data: stats
                    });
                });
            });
        });
    });
});

// Delete pre-order (admin only - use with caution)
app.delete('/api/preorders/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM preorders WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to delete pre-order'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'Pre-order not found'
            });
        }

        res.json({
            success: true,
            message: 'Pre-order deleted successfully'
        });
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🌙 MIDNIGHT BRUNCH API SERVER 🌙        ║
╚════════════════════════════════════════════╝

✓ Server running on port ${PORT}
✓ Environment: ${process.env.NODE_ENV || 'development'}
✓ API Base URL: http://localhost:${PORT}/api

📋 Available endpoints:
   GET    /api/health
   POST   /api/preorder
   GET    /api/preorders
   GET    /api/preorders/:id
   PUT    /api/preorders/:id/status
   DELETE /api/preorders/:id
   GET    /api/stats

🚀 Ready to accept pre-orders!
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\nShutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✓ Database connection closed');
        }
        process.exit(0);
    });
});
