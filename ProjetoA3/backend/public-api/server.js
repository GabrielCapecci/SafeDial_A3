// public-api/server.js
import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// Função auxiliar: normaliza telefone (remove tudo que não for número)
// ----------------------------------------------------
function normalizePhone(phone) {
  return (phone || "").replace(/\D/g, "");
}

// ----------------------------------------------------
// 1) BUSCAR DADOS DO NÚMERO (GET /api/numbers/:phone)
// ----------------------------------------------------
app.get("/api/numbers/:phone", async (req, res) => {
  try {
    const phoneParam = req.params.phone;
    const phoneNorm = normalizePhone(phoneParam);

    const [rows] = await db.query("SELECT * FROM numbers");

    const found = rows.find(r => normalizePhone(r.phone) === phoneNorm);

    if (!found) {
      return res.json({
        status: "desconhecido",
        phone: phoneParam,
        bank: "-",
        reports: 0
      });
    }

    return res.json({
      phone: found.phone,
      bank: found.bank || "-",
      status: (found.status || "desconhecido").toLowerCase(),
      reports: found.reports || 0,
      lastUpdate: found.lastUpdate || null
    });
  } catch (err) {
    console.error("Erro GET /numbers:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
});

// ----------------------------------------------------
// 2) ENVIAR REPORT (POST /api/report)
// ----------------------------------------------------
app.post("/api/report", async (req, res) => {
  try {
    const { phone, description } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Telefone é obrigatório." });

    const phoneNorm = normalizePhone(phone);
    const date = new Date();

    await db.query("INSERT INTO reports (phone, description, date) VALUES (?, ?, ?)", [
      phoneNorm,
      description || "",
      date
    ]);

    await db.query(
      `
      INSERT INTO numbers (phone, bank, status, reports, lastUpdate)
      VALUES (?, '-', 'suspeito', 1, ?)
      ON DUPLICATE KEY UPDATE
        reports = reports + 1,
        status = IF(reports + 1 >= 3, 'suspeito', status),
        lastUpdate = VALUES(lastUpdate)
      `,
      [phoneNorm, date]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("Erro POST /report:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// 3) SYNC DO ADMIN (POST /api/sync-oficial)
// (corrigido para "oficial" com 1 F)
// ----------------------------------------------------
app.post("/api/sync-oficial", async (req, res) => {
  try {
    const { phone, bank } = req.body;
    if (!phone) return res.status(400).json({ error: "phone required" });

    const phoneNorm = normalizePhone(phone);
    const date = new Date();

    await db.query(
      `
      INSERT INTO numbers (phone, bank, status, reports, lastUpdate)
      VALUES (?, ?, 'oficial', 0, ?)
      ON DUPLICATE KEY UPDATE
        bank = VALUES(bank),
        status = 'oficial',
        lastUpdate = VALUES(lastUpdate)
      `,
      [phoneNorm, bank || "-", date]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("Erro POST /sync-oficial:", err);
    return res.status(500).json({ error: "server error", message: err.message });
  }
});

// ----------------------------------------------------
// 4) LISTAR NÚMEROS OFICIAIS (GET /api/numbers/oficial)
// (corrigido para 1 F)
// ----------------------------------------------------
app.get("/api/numbers/oficial", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM numbers WHERE status = 'oficial'");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar números oficiais" });
  }
});

// ----------------------------------------------------
const PORT = process.env.PUBLIC_API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`public-api rodando: http://localhost:${PORT}`);
});
