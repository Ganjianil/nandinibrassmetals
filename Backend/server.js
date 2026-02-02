const express = require('express');
const nodemailer = require("nodemailer"); // --- ADDED THIS ---

const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg'); 
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// --- NEW CLOUDINARY IMPORTS ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_123"; 

// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// --- NODEMAILER TRANSPORTER CONFIG ---
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // Your 16-digit App Password
    },
});

// --- EMAIL LOGIC FUNCTION ---
const sendOrderEmails = async (orderData) => {
    // 1. Alert for YOU (Owner)
    const ownerMailOptions = {
        from: `"Nandini Orders" <${process.env.EMAIL_USER}>`,
        to: "ganjanilkumar1998@gmail.com",
        subject: `🚨 NEW ORDER - ₹${orderData.totalAmount} from ${orderData.username}`,
        html: `
            <div style="font-family: Arial, sans-serif; border: 2px solid #fbbf24; padding: 20px; border-radius: 15px;">
                <h2 style="color: #92400e;">New Order Received!</h2>
                <p><strong>Customer:</strong> ${orderData.username}</p>
                <p><strong>Mobile:</strong> ${orderData.phone}</p>
                <p><strong>Address:</strong> ${orderData.address}</p>
                <hr/>
                <p><strong>Total Amount:</strong> ₹${orderData.totalAmount}</p>
                <p><strong>Payment:</strong> ${orderData.paymentMethod}</p>
                <p>Check Admin Panel for details.</p>
            </div>
        `,
    };

    // 2. Confirmation for CUSTOMER
    const customerMailOptions = {
        from: `"Nandini Brass Metals" <${process.env.EMAIL_USER}>`,
        to: orderData.email,
        subject: `Order Confirmed! | Nandini Brass Metals`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                <div style="background-color: #0f172a; padding: 30px; text-align: center; color: #fbbf24;">
                    <h1>Nandini Brass Metals</h1>
                </div>
                <div style="padding: 20px;">
                    <h2>Hi ${orderData.username},</h2>
                    <p>Your order for <strong>₹${orderData.totalAmount}</strong> has been successfully placed!</p>
                    <p>We are preparing your items for delivery to: <br/><em>${orderData.address}</em></p>
                    <hr/>
                    <p>Thank you for shopping with us!</p>
                </div>
            </div>
        `
    };

    try {
        await Promise.all([
            transporter.sendMail(ownerMailOptions),
            transporter.sendMail(customerMailOptions)
        ]);
        console.log("Emails sent successfully!");
    } catch (error) {
        console.error("Email error:", error);
    }
};






// --- DATABASE CONNECTION ---
const pool = new Pool({
    connectionString: process.env.db_url,
    ssl: { rejectUnauthorized: false }
});

// Note: Your db.query helper automatically converts '?' to '$1, $2'
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

// --- UPDATED MULTER FOR CLOUDINARY ---
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'nandini_products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});
const upload = multer({ storage });

// --- FIXED URL HELPER ---
const getFullUrl = (req, imagePath) => {
    if (!imagePath) return null;
    return imagePath; // Cloudinary returns full URL
};

// Keep static for any legacy files left on the server
app.use('/uploads', express.static('uploads'));

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
// --- UPDATED ORDERS ROUTE ---
app.post('/api/orders', async (req, res) => {
    const { userId, username, email, phone, address, cartItems, totalAmount } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID missing." });

    try {
        await db.query('BEGIN');
        
        await db.query('INSERT INTO orders (user_id, username, email, phone, address, items, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [userId, username, email, phone, address, JSON.stringify(cartItems), totalAmount, 'Pending']);
        
        for (const item of cartItems) {
            await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.id]);
        }
        
        await db.query('COMMIT');

        // --- ADD THIS LINE HERE ---
        sendOrderEmails(req.body); 

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

// CREATE CATEGORY
app.post('/api/admin/categories', verifyAdmin, upload.single('image'), async (req, res) => {
    const img = req.file ? req.file.path : null; 
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

// ADD PRODUCT (Fixed to use '?' helper consistently)
app.post("/api/admin/products", verifyAdmin, upload.single('image'), async (req, res) => {
    const img = req.file ? req.file.path : null; 
    const { name, price, discount_price, stock, description, long_description, category_id } = req.body;

    try {
        await db.query(
            `INSERT INTO products 
             (name, price, discount_price, stock, description, long_description, category_id, image)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, 
                parseFloat(price) || 0, 
                parseFloat(discount_price) || 0, 
                parseInt(stock) || 0, 
                description, 
                long_description, 
                category_id ? parseInt(category_id) : null, 
                img
            ]
        );
        res.json({ message: "Product added successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add product", details: err.message });
    }
});

// DELETE PRODUCT
app.delete('/api/admin/products/:id', verifyAdmin, async (req, res) => {
    const productId = req.params.id;
    try {
        await db.query('BEGIN');
        await db.query('DELETE FROM reviews WHERE product_id = ?', [productId]);
        const result = await db.query('DELETE FROM products WHERE id = ?', [productId]);
        if (result.rowCount === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ error: "Product not found" });
        }
        await db.query('COMMIT');
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: "Delete failed" });
    }
});

// UPDATE PRODUCT
app.put("/api/admin/products/:id", verifyAdmin, upload.single('image'), async (req, res) => {
    const { name, price, discount_price, stock, description, long_description, category_id } = req.body;
    const img = req.file ? req.file.path : null;
    
    try {
        const d_price = discount_price ? parseFloat(discount_price) : null;
        if (img) {
            await db.query(
                "UPDATE products SET name=?, price=?, discount_price=?, stock=?, description=?, long_description=?, category_id=?, image=? WHERE id=?", 
                [name, parseFloat(price), d_price, parseInt(stock), description, long_description, parseInt(category_id), img, req.params.id]
            );
        } else {
            await db.query(
                "UPDATE products SET name=?, price=?, discount_price=?, stock=?, description=?, long_description=?, category_id=? WHERE id=?", 
                [name, parseFloat(price), d_price, parseInt(stock), description, long_description, parseInt(category_id), req.params.id]
            );
        }
        res.json({ message: "Updated successfully" });
    } catch (err) { 
        res.status(500).json({ error: "Update failed" }); 
    }
});

// PROMOS
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

