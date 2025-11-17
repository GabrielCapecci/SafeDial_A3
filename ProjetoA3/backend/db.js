// backend/db.js
import mysql from "mysql2";

const db = mysql.createPool({
  host: "localhost",
  user: "root",     // coloque seu usuário do MySQL
  password: "Biel10403923@",     // coloque sua senha do MySQL
  database: "safedial"
});

export default db;
