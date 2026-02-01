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

// Use Render's dynamic port or default to 5000 for local testing
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_123";

// --- DATABASE CONNECTION (Neon PostgreSQL) ---
const pool = new Pool({
    connectionString: process.env.db_url,
    ssl: {
        rejectUnauthorized: false // Required for Neon
    }
});

// PostgreSQL Helper: Converts MySQL '?' placeholders to PostgreSQL '$1, $2...'
const db = {
    query: (text, params) => {
        let i = 0;
        const formattedText = text.replace(/\?/g, () => `$${++i}`);
        return pool.query(formattedText, params);
    }
};

// --- MIDDLEWARE ---
app.use(cookieParser());

// CORS Configuration for Production (Netlify) and Localhost
const allowedOrigins = [
    "http://localhost:5173",
    "https://nandhinicrafts.netlify.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads folder exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Logger
app.use((req, res, next) => {
    console.log(`>>> ${req.method} ${req.url}`);
    next();
});

// --- ROUTES ---

// Health Check (Check if server is live)
app.get('/', (req, res) => res.send('Server is running and healthy!'));

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

        // Production-ready cookies (Secure for Netlify/Render)
        res.cookie('user_session', JSON.stringify(userData), {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,   // Required for cross-site (HTTPS)
            sameSite: 'None', // Required for cross-site (Netlify to Render)
            path: '/'
        });

        res.json({ success: true, user: userData });
    } catch (err) {
        res.status(500).json({ error: "Login error." });
    }
});

// --- SHOP ROUTES ---

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
    } catch (err) { res.status(500).json({ error: "Fetch error" }); }
});

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

app.post('/api/validate-promo', async (req, res) => {
    const { code } = req.body;
    const today = new Date().toISOString().split('T')[0];
    try {
        const { rows } = await db.query(
            'SELECT * FROM promo_codes WHERE code = ? AND is_active = TRUE AND expiry_date >= ?',
            [code, today]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: "Invalid code." });
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

// --- ADMIN ROUTES ---

app.get('/api/admin/orders', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: "Fetch error" }); }
});

app.post('/api/admin/categories', upload.single('image'), async (req, res) => {
    const { name } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        await db.query('INSERT INTO categories (name, image) VALUES (?, ?)', [name, imagePath]);
        res.status(201).json({ message: "Category created!" });
    } catch (err) { res.status(500).json({ error: "Server error" }); }
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

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));