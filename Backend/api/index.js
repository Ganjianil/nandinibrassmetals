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
const transporter = nodemailer.createTransport({    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // Your 16-digit App Password
    },
});
const sendOTPByEmail = async (userEmail, otp) => {
  const mailOptions = {
    from: '"Nandhini Crafts" <security@nandhinicrafts.com>',
    to: userEmail,
    subject: `${otp} is your verification code`,
    html: `
      <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 40px; text-align: center;">
          <h1 style="color: #f59e0b; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Nandhini</h1>
          <p style="color: #94a3b8; margin: 5px 0 0 0; font-style: italic;">Crafts & Tradition</p>
        </div>
        <div style="padding: 40px; background-color: #ffffff; text-align: center;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Verify Your Identity</h2>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            We received a request to reset your password. Use the code below to proceed. 
            <strong>This code will expire in 5 minutes.</strong>
          </p>
          <div style="margin: 30px 0; padding: 20px; background-color: #fffbeb; border: 2px dashed #f59e0b; border-radius: 8px;">
            <span style="font-size: 42px; font-weight: bold; letter-spacing: 15px; color: #b45309; margin-left: 15px;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 12px;">
            If you did not request this, please ignore this email or contact support if you have concerns.
          </p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">&copy; 2026 Nandhini Crafts. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

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
    origin: ["http://localhost:5174", "https://nandhinicrafts.netlify.app"],
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
    if (!imagePath) return [];
    
    try {
        // This converts '["url1", "url2"]' into a real Javascript Array
        const parsed = JSON.parse(imagePath);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
        // Fallback: If it's already a plain string (legacy data), wrap it in an array
        return [imagePath];
    }
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
// --- BACKEND OTP LOGIC ---

let otpStore = {}; // Temporary memory (Use Redis or Database for production)

// 1. Send OTP
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save OTP with 5-minute expiry
  otpStore[email] = { otp, expires: Date.now() + 300000 };

  try {
    // Use Nodemailer to send the email
    await transporter.sendMail({
      from: '"Nandhini Crafts" <noreply@nandhini.com>',
      to: email,
      subject: "Your Verification Code",
      text: `Your security code is: ${otp}. It expires in 5 minutes.`,
    });
    res.json({ message: "OTP Sent" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

// 2. Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const entry = otpStore[email];

  if (entry && entry.otp === otp && Date.now() < entry.expires) {
    res.json({ message: "OTP Verified" });
  } else {
    res.status(400).json({ error: "Invalid or expired OTP" });
  }
});

// 3. Reset Password
// 1. MUST HAVE THIS AT THE TOP

// ... other imports ...

app.post("/api/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required" });
    }

    console.log("Attempting password reset for:", email);

    // 1. Hash the new password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 2. Update the Database using your 'db' helper
    // We use your '?' syntax which your helper converts to '$1, $2'
    const result = await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email.trim().toLowerCase()]
    );

    // result.rowCount tells us if any row was actually changed
    if (result.rowCount === 0) {
      console.log("User not found in DB for email:", email);
      return res.status(404).json({ error: "No account found with this email." });
    }

    // 3. Clear the OTP from your temporary memory
    if (otpStore[email]) {
      delete otpStore[email];
    }

    console.log("Password updated successfully in PostgreSQL for:", email);
    res.json({ message: "Password updated successfully!" });

  } catch (error) {
    console.error("BACKEND CRASH DETAILS:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
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
// ADD PRODUCT - FIXED FOR MULTIPLE IMAGES
app.post("/api/admin/products", verifyAdmin, upload.array('images', 10), async (req, res) => {
    // 1. Get ALL uploaded image paths from Cloudinary
    // req.files is an array when using upload.array
    const imageUrls = req.files ? req.files.map(file => file.path) : []; 

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
                // 2. Convert the array to a JSON string so getFullUrl can parse it later
                JSON.stringify(imageUrls) 
            ]
        );
        res.json({ message: "Product added successfully with " + imageUrls.length + " images!" });
    } catch (err) {
        console.error("DB Error:", err);
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
app.get('/api/admin/custom-inquiries', verifyAdmin, async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM custom_requests ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch inquiries" });
    }
});
// DELETE a custom inquiry
app.delete("/api/admin/custom-inquiries/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Replace 'custom_inquiries' with your actual table name
    const result = await db.query("DELETE FROM custom_inquiries WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    console.error("Error deleting inquiry:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// --- CUSTOM CONSULTATIONS ENDPOINT ---
app.post('/api/custom-consultations', async (req, res) => {
    const { metal, phone, height, weight, state, expectedDate, details } = req.body;

    try {
        // 1. Save to Database (Create this table first)
        await db.query(
            `INSERT INTO custom_requests 
             (metal, phone, height, weight, location, delivery_date, details, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [metal, phone, height, weight, state, expectedDate, details, 'New']
        );

        // 2. Send Email Alert to You
        const mailOptions = {
            from: `"Nandini CUSTOM" <${process.env.EMAIL_USER}>`,
            to: "ganjanilkumar1998@gmail.com", // Your email
            subject: `🕉️ NEW TEMPLE WORK: ${metal} Idol Inquiry from ${state}`,
            html: `
                <div style="font-family: serif; border: 5px solid #b45309; padding: 30px;">
                    <h1 style="color: #b45309;">New Custom Request</h1>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Metal:</strong> ${metal}</p>
                    <p><strong>Scale:</strong> ${height} ft / ${weight} kg</p>
                    <p><strong>Location:</strong> ${state}</p>
                    <p><strong>Deadline:</strong> ${expectedDate}</p>
                    <hr/>
                    <p><strong>Details:</strong> ${details}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Request captured" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process request" });
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

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server live on ${PORT}`));
}

module.exports = app;
