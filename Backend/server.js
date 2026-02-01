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
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_123"; 

// --- DATABASE CONNECTION ---
const pool = new Pool({
    connectionString: process.env.db_url,
    ssl: { rejectUnauthorized: false }
});

const db = {
    query: (text, params = []) => {
        let i = 0;
        const formattedText = text.replace(/\?/g, () => `$${++i}`);
        return pool.query(formattedText, params);
    }
};

// --- MIDDLEWARE ---
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "https://nandhinicrafts.netlify.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

if (!fs.existsSync('./uploads')) { fs.mkdirSync('./uploads'); }

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });

// URL Helper
const getFullUrl = (req, path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${req.protocol}://${req.get('host')}${path}`;
};

// Auth Guard
const verifyAdmin = (req, res, next) => {
    const session = req.cookies.user_session;
    if (!session) return res.status(401).json({ error: "Unauthorized" });
    const user = typeof session === 'string' ? JSON.parse(session) : session;
    if (user.email === "admin@gmail.com") next();
    else res.status(403).json({ error: "Access denied" });
};

// --- AUTH ROUTES ---
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash]);
        res.status(201).json({ message: "User registered" });
    } catch (err) { res.status(500).json({ error: "Register failed" }); }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE email = ?', [email.trim()]);
        if (rows.length === 0) return res.status(401).json({ error: "User not found" });
        const match = await bcrypt.compare(password, rows[0].password);
        if (!match) return res.status(401).json({ error: "Invalid password" });
        const userData = { id: rows[0].id, username: rows[0].username, email: rows[0].email };
        res.cookie('user_session', JSON.stringify(userData), {
            maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: 'None', path: '/'
        });
        res.json({ success: true, user: userData });
    } catch (err) { res.status(500).json({ error: "Login failed" }); }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('user_session', { sameSite: 'None', secure: true, path: '/' });
    res.json({ message: "Logged out" });
});

// --- PRODUCT & CATEGORY DATA ---
app.get('/products', async (req, res) => {
    const { category, search, sort } = req.query;
    try {
        let sql = 'SELECT * FROM products WHERE 1=1';
        let params = [];
        if (category) { sql += ' AND category_id = ?'; params.push(category); }
        if (search) { sql += ' AND name ILIKE ?'; params.push(`%${search}%`); }
        
        if (sort === 'price_low') sql += ' ORDER BY price ASC';
        else if (sort === 'price_high') sql += ' ORDER BY price DESC';
        else sql += ' ORDER BY id DESC';

        const { rows } = await db.query(sql, params);
        res.json(rows.map(p => ({ ...p, image: getFullUrl(req, p.image) })));
    } catch (err) { res.status(500).json({ error: "Fetch error" }); }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });
        res.json({ ...rows[0], image: getFullUrl(req, rows[0].image) });
    } catch (err) { res.status(500).json({ error: "Fetch product error" }); }
});

app.get('/api/categories', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM categories ORDER BY id DESC');
        res.json(rows.map(c => ({ ...c, image: getFullUrl(req, c.image) })));
    } catch (err) { res.status(500).json({ error: "Category error" }); }
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
        res.json({ message: "Review added" });
    } catch (err) { res.status(500).json({ error: "Post review error" }); }
});

// --- ORDERS ---
app.post('/api/orders', async (req, res) => {
    const { userId, username, email, phone, address, cartItems, totalAmount } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID missing. Please re-login." });
    try {
        await db.query('BEGIN');
        const userCheck = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (userCheck.rows.length === 0) throw new Error("User invalid.");
        await db.query('INSERT INTO orders (user_id, username, email, phone, address, items, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [userId, username, email, phone, address, JSON.stringify(cartItems), totalAmount, 'Pending']);
        for (const item of cartItems) {
            await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.id]);
        }
        await db.query('COMMIT');
        res.json({ message: "Order placed!" });
    } catch (err) { 
        await db.query('ROLLBACK');
        res.status(500).json({ error: err.message }); 
    }
});

app.get('/api/orders/:userId', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId]);
        const fixed = rows.map(o => {
            let items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
            return { ...o, items: items.map(i => ({ ...i, image: getFullUrl(req, i.image) })) };
        });
        res.json(fixed);
    } catch (err) { res.status(500).json({ error: "Fetch orders error" }); }
});

app.patch('/api/orders/:id/cancel', async (req, res) => {
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', ['Cancelled', req.params.id]);
        res.json({ message: "Order Cancelled" });
    } catch (err) { res.status(500).json({ error: "Cancel failed" }); }
});

// --- PROMO CODES ---
app.post('/api/validate-promo', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        const { rows } = await db.query('SELECT * FROM promo_codes WHERE code = ? AND is_active = true AND expiry_date >= ?', [req.body.code.toUpperCase(), today]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: "Invalid or expired code" });
        res.json({ success: true, discount_percent: rows[0].discount_percent });
    } catch (err) { res.status(500).json({ error: "Validation error" }); }
});

// --- ADMIN PANEL ---
app.get('/api/admin/orders', verifyAdmin, async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM orders ORDER BY id DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: "Admin fetch failed" }); }
});

app.put("/api/admin/orders/:id", verifyAdmin, async (req, res) => {
    try {
        await db.query("UPDATE orders SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
        res.json({ message: "Status updated" });
    } catch (err) { res.status(500).json({ error: "Update failed" }); }
});

app.post('/api/admin/categories', verifyAdmin, upload.single('image'), async (req, res) => {
    const img = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        await db.query('INSERT INTO categories (name, image) VALUES (?, ?)', [req.body.name, img]);
        res.json({ message: "Category created" });
    } catch (err) { res.status(500).json({ error: "Failed" }); }
});

app.delete('/api/admin/categories/:id', verifyAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: "Category linked to products" }); }
});

// --- ADMIN PRODUCT ACTIONS ---

// ADD PRODUCT
app.post("/api/admin/products", verifyAdmin, upload.single('image'), async (req, res) => {
    const img = req.file ? `/uploads/${req.file.filename}` : null;
    const { name, price, stock, description, long_description, category_id } = req.body;
    try {
        await db.query("INSERT INTO products (name, price, stock, description, long_description, category_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [name, parseFloat(price), parseInt(stock), description, long_description, parseInt(category_id), img]);
        res.json({ message: "Product added" });
    } catch (err) { res.status(500).json({ error: "Add failed" }); }
});

// DELETE PRODUCT (Corrected Version - Use this ONLY once)
app.delete('/api/admin/products/:id', verifyAdmin, async (req, res) => {
    const productId = req.params.id;
    try {
        // Start transaction
        await db.query('BEGIN');

        // Step 1: Delete all reviews linked to this product first
        // This prevents the "Foreign Key Constraint" error
        await db.query('DELETE FROM reviews WHERE product_id = ?', [productId]);

        // Step 2: Delete the actual product
        const result = await db.query('DELETE FROM products WHERE id = ?', [productId]);

        // If no product was found with that ID
        if (result.rowCount === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ error: "Product not found" });
        }

        await db.query('COMMIT');
        res.json({ message: "Product and associated reviews deleted successfully" });
    } catch (err) {
        // If anything fails, undo all changes
        await db.query('ROLLBACK');
        console.error("Delete operation failed:", err);
        res.status(500).json({ 
            error: "Delete failed. This product might be part of an existing order history." 
        });
    }
});

// UPDATE PRODUCT
app.put("/api/admin/products/:id", verifyAdmin, upload.single('image'), async (req, res) => {
    const { name, price, stock, description, long_description, category_id } = req.body;
    const img = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        if (img) {
            await db.query("UPDATE products SET name=?, price=?, stock=?, description=?, long_description=?, category_id=?, image=? WHERE id=?", 
            [name, parseFloat(price), parseInt(stock), description, long_description, parseInt(category_id), img, req.params.id]);
        } else {
            await db.query("UPDATE products SET name=?, price=?, stock=?, description=?, long_description=?, category_id=? WHERE id=?", 
            [name, parseFloat(price), parseInt(stock), description, long_description, parseInt(category_id), req.params.id]);
        }
        res.json({ message: "Updated" });
    } catch (err) { res.status(500).json({ error: "Update failed" }); }
});

// Admin Promo Management
app.get('/api/admin/promos', verifyAdmin, async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM promo_codes ORDER BY id DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: "Fetch error" }); }
});

app.post('/api/admin/promos', verifyAdmin, async (req, res) => {
    const { code, discount, start_date, expiry_date } = req.body;
    try {
        await db.query('INSERT INTO promo_codes (code, discount_percent, is_active, start_date, expiry_date) VALUES (?, ?, ?, ?, ?)', 
        [code.toUpperCase(), parseInt(discount), true, start_date, expiry_date]);
        res.json({ message: "Promo added" });
    } catch (err) { res.status(500).json({ error: "Creation error" }); }
});

app.delete('/api/admin/promos/:id', verifyAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM promo_codes WHERE id = ?', [req.params.id]);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

app.listen(PORT, () => console.log(`Server live on ${PORT}`));