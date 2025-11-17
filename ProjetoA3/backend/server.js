// backend/server.js
import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// FUNÇÃO AUXILIAR: normaliza telefone (só números)
// ----------------------------------------------------
function normalizePhone(phone) {
  return (phone || "").replace(/\D/g, "");
}

// ----------------------------------------------------
// 1) BUSCAR DADOS DO NÚMERO  (GET /api/numbers/:phone)
// ----------------------------------------------------
app.get("/api/numbers/:phone", (req, res) => {
  const phoneParam = req.params.phone;
  const phoneNorm = normalizePhone(phoneParam);

  db.query(
    "SELECT * FROM numbers WHERE phone = ?",
    [phoneNorm],
    (err, rows) => {
      if (err) {
        console.error("Erro SQL GET /numbers:", err);
        return res.status(500).json({ status: "error", message: err.message });
      }

      if (!rows.length) {
        return res.json({
          status: "not_found",
          phone: phoneParam,
          bank: "-",
          reports: 0
        });
      }

      // retorna o registro
      const row = rows[0];
      return res.json({
        phone: row.phone,
        bank: row.bank || "-",
        status: row.status || "desconhecido",
        reports: row.reports || 0,
        lastUpdate: row.lastUpdate || null
      });
    }
  );
});

// ----------------------------------------------------
// 2) ENVIAR REPORT / DENÚNCIA  (POST /api/report)
// ----------------------------------------------------
app.post("/api/report", (req, res) => {
  try {
    const { phone, description } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: "Telefone é obrigatório." });
    }

    const phoneNorm = normalizePhone(phone);

    // 1) Salva na tabela reports
    db.query(
      "INSERT INTO reports (phone, description, date) VALUES (?, ?, NOW())",
      [phoneNorm, description || ""],
      (err) => {
        if (err) {
          console.error("Erro SQL INSERT /reports:", err);
          return res.status(500).json({ success: false, message: err.message });
        }

        // 2) Atualiza ou insere na tabela numbers
        db.query(
          `
          INSERT INTO numbers (phone, bank, status, reports, lastUpdate)
          VALUES (?, '-', 'suspeito', 1, NOW())
          ON DUPLICATE KEY UPDATE
            reports = reports + 1,
            status = IF(reports + 1 >= 3, 'suspeito', status),
            lastUpdate = NOW()
          `,
          [phoneNorm],
          (err2) => {
            if (err2) {
              console.error("Erro SQL INSERT/UPDATE /numbers:", err2);
              return res.status(500).json({ success: false, message: err2.message });
            }

            return res.json({ success: true });
          }
        );
      }
    );
  } catch (err) {
    console.error("Erro inesperado POST /api/report:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando: http://localhost:${PORT}`);
});
