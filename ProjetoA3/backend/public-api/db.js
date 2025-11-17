// backend/public-api/db.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",      // usuário MySQL
  password: process.env.DB_PASS || "Biel10403923@",  // senha MySQL
  database: process.env.DB_NAME || "safedial",
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
