const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg'); 
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
// FIX 1: Use process.env.PORT for Render compatibility
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "your_super_secret_key_123"; 

// --- DATABASE CONNECTION (Neon PostgreSQL) ---
const pool = new Pool({
    connectionString: process.env.db_url,
    ssl: {
        rejectUnauthorized: false 
    }
});

const db = {
    query: (text, params) => {
        let i = 0;
        const formattedText = text.replace(/\?/g, () => `$${++i}`);
        return pool.query(formattedText, params);
    }
};

// --- MIDDLEWARE ---
app.use(cookieParser());

// FIX 2: Correct CORS for Netlify + Render production
app.use(cors({
    origin: ["http://localhost:5173", "https://nandhinicrafts.netlify.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use((req, res, next) => {
    console.log(`>>> ${req.method} ${req.url}`);
    next();
});

// --- AUTH ROUTES ---

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed." });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows: users } = await db.query('SELECT * FROM users WHERE email = ?', [email.trim()]);
        if (users.length === 0) return res.status(401).json({ error: "Email not found." });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password." });

        const userData = { id: user.id, username: user.username, email: user.email };

        // FIX 3: Secure cookies for Production (Netlify <-> Render)
        res.cookie('user_session', JSON.stringify(userData), {
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            httpOnly: true, // Recommended for security
            secure: true,   // MUST be true for HTTPS (Netlify/Render)
            sameSite: 'None', // MUST be 'None' for cross-domain cookies
            path: '/'
        });

        res.json({ success: true, user: userData });
    } catch (err) {
        res.status(500).json({ error: "Login error." });
    }
});

// --- PRODUCT & CATEGORY PUBLIC ROUTES ---

app.get('/products', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: "Fetch error" }); }
});

app.get('/api/categories', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM categories');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- REVIEWS ---

app.get("/api/products/:id/reviews", async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC", [req.params.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: "Fetch reviews error" }); }
});

app.post("/api/products/:id/reviews", async (req, res) => {
    const { user_name, rating, comment } = req.body;
    try {
        await db.query("INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)", [req.params.id, user_name, rating, comment]);
        res.json({ message: "Review posted!" });
    } catch (err) { res.status(500).json({ error: "Post review error" }); }
});

// --- PROMO VALIDATION ---

app.post('/api/validate-promo', async (req, res) => {
    const { code } = req.body;
    const today = new Date().toISOString().split('T')[0];
    try {
        const { rows } = await db.query(
            'SELECT * FROM promo_codes WHERE code = ? AND is_active = 1 AND expiry_date >= ?', 
            [code, today]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: "Invalid or expired code." });
        res.json({ success: true, discount_percent: rows[0].discount_percent });
    } catch (err) { res.status(500).json({ error: "Validation error" }); }
});

// --- ORDER ROUTES ---

app.post('/api/orders', async (req, res) => {
    const { userId, username, email, phone, address, cartItems, totalAmount } = req.body;
    try {
        const sql = `INSERT INTO orders (user_id, username, email, phone, address, items, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [userId, username, email, phone, address, JSON.stringify(cartItems), totalAmount, 'Pending']);
        res.status(200).json({ message: "Order Placed!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders/:userId', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: "Fetch error" }); }
});

app.patch('/api/orders/:orderId/cancel', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT created_at, status FROM orders WHERE id = ?', [req.params.orderId]);
        if (rows.length === 0) return res.status(404).json({ error: "Order not found" });

        const diffInHours = (new Date() - new Date(rows[0].created_at)) / (1000 * 60 * 60);
        if (diffInHours > 6) return res.status(403).json({ error: "Cancellation window (6hrs) expired." });
        
        await db.query('UPDATE orders SET status = ? WHERE id = ?', ['Cancelled', req.params.orderId]);
        res.json({ message: "Order cancelled successfully" });
    } catch (err) { res.status(500).json({ error: "Cancel error" }); }
});

// --- ADMIN ROUTES ---

app.get('/api/admin/orders', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/admin/orders/:id", async (req, res) => {
    try {
        await db.query("UPDATE orders SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
        res.json({ message: "Status updated" });
    } catch (err) { res.status(500).json({ error: "Update failed" }); }
});

app.post('/api/admin/categories', upload.single('image'), async (req, res) => {
    const { name } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        await db.query('INSERT INTO categories (name, image) VALUES (?, ?)', [name, imagePath]);
        res.status(201).json({ message: "Category created!" });
    } catch (err) { res.status(500).json({ error: "Server error" }); }
});

app.delete('/api/admin/categories/:id', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [req.params.id]);
        if (parseInt(rows[0].count) > 0) return res.status(400).json({ message: "Category still has products." });
        await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json("Deleted.");
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

app.post("/api/admin/products", upload.single('image'), async (req, res) => {
    const { name, price, stock, description, long_description, category_id } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        await db.query("INSERT INTO products (name, price, stock, description, long_description, category_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [name, price, stock, description, long_description, category_id, imagePath]);
        res.json({ message: "Product Added!" });
    } catch (err) { res.status(500).json({ error: "Add failed" }); }
});

app.get('/api/admin/promos', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM promo_codes ORDER BY id DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: "Fetch error" }); }
});

app.post('/api/admin/promos', async (req, res) => {
    const { code, discount, start_date, expiry_date } = req.body;
    try {
        // We must list the columns EXPLICITLY to avoid order issues
        const sql = `
            INSERT INTO promo_codes (code, discount_percent, is_active, start_date, expiry_date) 
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.query(sql, [
            code.toUpperCase(), 
            parseInt(discount), 
            true,               // Set is_active to true (Boolean)
            start_date, 
            expiry_date
        ]);

        res.json({ message: "Promo created!" });
    } catch (err) { 
        console.error("Postgres Error:", err.message);
        res.status(500).json({ error: "Creation error: " + err.message }); 
    }
});

app.delete('/api/admin/promos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await db.query('DELETE FROM promo_codes WHERE id = ?', [id]);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));