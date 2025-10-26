const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // conexão MySQL

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Função para normalizar número
function normalize(phone) {
  return phone.replace(/\D/g, '');
}

// pegar os numeros normalizados com GET
app.get('/api/numbers/:phone', async (req, res) => {
  try {
    const phone = normalize(req.params.phone);
    
    // Busca todos os números e compara normalizados
    const [rows] = await db.promise().query('SELECT * FROM numbers');
    const match = rows.find(row => normalize(row.phone) === phone);

    if (match) {
      res.json({
        phone: match.phone,
        bank: match.bank,
        status: match.status,
        reports: match.reports,
        lastUpdate: match.lastUpdate
      });
    } else {
      res.json({ status: 'desconhecido', phone: req.params.phone, reports: 0 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar número.' });
  }
});

// POST lançar report no banco
app.post('/api/report', (req, res) => {
  const { phone, description } = req.body;
  const date = new Date();

  if (!phone) return res.status(400).json({ error: 'phone é obrigatório' });

  const insertReport = 'INSERT INTO reports (phone, description, date) VALUES (?, ?, ?)';
  db.query(insertReport, [phone, description, date], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Atualiza ou insere número suspeito
    const updateNum = `
      INSERT INTO numbers (phone, bank, status, reports, lastUpdate)
      VALUES (?, '-', 'suspeito', 1, ?)
      ON DUPLICATE KEY UPDATE
        reports = reports + 1,
        status = IF(reports >= 3, 'suspeito', status),
        lastUpdate = ?
    `;
    db.query(updateNum, [phone, date, date], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true });
    });
  });
});

// ✅ POST para admin (admin)
app.post('/api/numbers', (req, res) => {
  const { phone, bank, status } = req.body;
  if (!phone || !bank) return res.status(400).json({ error: 'phone e bank são obrigatórios' });

  const sql = 'INSERT INTO numbers (phone, bank, status, reports, lastUpdate) VALUES (?, ?, ?, 0, ?)';
  db.query(sql, [phone, bank, status || 'oficial', new Date()], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// GET pegar lista de numeros
app.get('/api/numbers', (req, res) => {
  db.query('SELECT * FROM numbers', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(PORT, () => console.log(`✅ SafeDial backend rodando na porta ${PORT}`));
