// AdminPanel.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const PUBLIC_API = "http://localhost:3001/api"; // porta da public API

export default function AdminPanel({ user }) {
  const [phone, setPhone] = useState("");
  const [bank, setBank] = useState("");
  const [officialNumbers, setOfficialNumbers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Buscar números oficiais ao montar o componente
  useEffect(() => {
    async function fetchOfficialNumbers() {
      try {
        const res = await axios.get(`${PUBLIC_API}/numbers/official`);
        // Garante que res.data seja um array
        setOfficialNumbers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erro ao buscar números oficiais:", err);
        setOfficialNumbers([]);
      }
    }

    fetchOfficialNumbers();
  }, []);

  // Submeter novo número oficial
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || !bank) {
      alert("Preencha telefone e banco.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${PUBLIC_API}/sync-official`, { phone, bank });
      if (res.data.success) {
        alert("Número atualizado com sucesso!");
        setPhone("");
        setBank("");
        // Atualiza a lista de números oficiais
        setOfficialNumbers(prev => [...prev, { phone, bank, status: "oficial", lastUpdate: new Date().toISOString() }]);
      }
    } catch (err) {
      console.error("Erro ao atualizar número oficial", err);
      alert("Erro ao atualizar número oficial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      {/* Proteção para user undefined */}
      <p>Logado como: {user?.email || "Usuário desconhecido"}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Telefone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>
        <div>
          <label>Banco:</label>
          <input
            type="text"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            placeholder="Nome do banco"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar número oficial"}
        </button>
      </form>

      <h3>Números Oficiais</h3>
      <ul>
        {Array.isArray(officialNumbers) && officialNumbers.length > 0 ? (
          officialNumbers.map((num) => (
            <li key={num.phone}>
              {num.phone} - {num.bank} (Última atualização: {num.lastUpdate || "-"})
            </li>
          ))
        ) : (
          <li>Nenhum número oficial encontrado.</li>
        )}
      </ul>
    </div>
  );
}
