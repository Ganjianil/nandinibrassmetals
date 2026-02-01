const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.db_url,
    ssl: {
        rejectUnauthorized: false
    }
});

// This object helps the transition from MySQL syntax to PostgreSQL
const db = {
    query: (text, params) => {
        // Automatically converts MySQL '?' to PostgreSQL '$1, $2, etc.'
        let i = 0;
        const formattedText = text.replace(/\?/g, () => `$${++i}`);
        return pool.query(formattedText, params);
    },
    pool: pool // Export the raw pool just in case
};

// Test the connection
pool.connect()
    .then(() => console.log('✅ Connected to Neon PostgreSQL'))
    .catch(err => console.error('❌ Connection error:', err.stack));

module.exports = db;