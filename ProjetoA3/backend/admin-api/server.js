import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Biel10403923@", 
  database: "safedial_admin",
});

// Login admin
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM admins WHERE email = ? AND password = ?",
      [email, password]
    );

    console.log(">>> ADMIN DO BANCO:", rows[0]); // <-- ADICIONE ISSO

    if (rows.length === 0) return res.json({ success: false });

    const admin = rows[0];

    res.json({
      success: true,
      email: admin.email,
      bank: admin.bank, // SE rows[0].bank existir, aqui NÃO será undefined
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Atualizar número oficial
app.post("/admin/update-number", async (req, res) => {
  try {
    const { phone, bank } = req.body;
    if (!phone || !bank) return res.status(400).json({ success: false });

    const phoneNorm = phone.replace(/\D/g, "");

    await axios.post("http://localhost:3001/api/sync-oficial", {
      phone: phoneNorm,
      bank,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Buscar números oficiais do banco do admin
app.get("/numbers/oficial", async (req, res) => {
  try {
    const { bank } = req.query;
    if (!bank) return res.status(400).json({ error: "bank obrigatório" });

    const [rows] = await db.query(
      "SELECT * FROM numbers WHERE status = 'oficial' AND bank = ?",
      [bank]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

const PORT = process.env.ADMIN_API_PORT || 3002;
app.listen(PORT, () => console.log(`admin-api rodando: http://localhost:${PORT}`));
