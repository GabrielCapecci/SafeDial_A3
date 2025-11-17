// Atualizar número oficial do admin na tabela numbers
app.post("/admin/update-number", async (req, res) => {
  const { phone, bank } = req.body;
  if (!phone || !bank) return res.status(400).json({ message: "Dados incompletos" });

  try {
    // Verifica se já existe esse número na tabela
    const [rows] = await db.query("SELECT * FROM numbers WHERE phone = ?", [phone]);

    if (rows.length === 0) {
      // Insere novo número como oficial
      await db.query(
        "INSERT INTO numbers (phone, bank, status, reports, lastupdate) VALUES (?, ?, 'oficial', 0, NOW())",
        [phone, bank]
      );
    } else {
      // Atualiza status para oficial
      await db.query(
        "UPDATE numbers SET status = 'oficial', bank = ?, lastupdate = NOW() WHERE phone = ?",
        [bank, phone]
      );
    }

    res.json({ success: true, phone, bank, status: "oficial" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar número" });
  }
});
