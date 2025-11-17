// server.js
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão MySQL
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Biel10403923@",
  database: "safedial_admin",
});

// ================================
// LOGIN ADMIN
// ================================
app.post("/admin/login", async (req, res) => {
  console.log("BODY RECEBIDO:", req.body); // <---- MOSTRA O QUE CHEGA DO FRONT

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Credenciais incompletas" });
  }

  try {
    const [rows] = await db.query(
      "SELECT id, email FROM admins WHERE email = ? AND password = ? AND isActive = 'Sim'",
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Credenciais inválidas ou usuário inativo",
      });
    }

    const admin = rows[0];
    res.json({ success: true, id: admin.id, email: admin.email });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// ================================
// Rotas de números oficiais
// ================================
app.get("/numbers/oficial", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT phone, bank, status, lastupdate FROM numbers WHERE status = 'oficial'"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar números" });
  }
});

app.post("/admin/update-number", async (req, res) => {
  const { phone, bank } = req.body;
  if (!phone || !bank)
    return res.status(400).json({ message: "Dados incompletos" });

  try {
    const [rows] = await db.query("SELECT * FROM numbers WHERE phone = ?", [
      phone,
    ]);

    if (rows.length === 0) {
      await db.query(
        "INSERT INTO numbers (phone, bank, status, reports, lastupdate) VALUES (?, ?, 'oficial', 0, NOW())",
        [phone, bank]
      );
    } else {
      await db.query(
        "UPDATE numbers SET status = 'oficial', bank = ?, lastupdate = NOW() WHERE phone = ?",
        [bank, phone]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar número" });
  }
});

// Inicializa servidor
const PORT = 3002;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
