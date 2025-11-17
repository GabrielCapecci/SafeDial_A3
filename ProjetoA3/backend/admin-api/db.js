// admin-api/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_ADMIN_HOST || 'localhost',
  user: process.env.DB_ADMIN_USER || 'root',
  password: process.env.DB_ADMIN_PASS || 'senha',
  database: process.env.DB_ADMIN_NAME || 'safedial_admin',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
