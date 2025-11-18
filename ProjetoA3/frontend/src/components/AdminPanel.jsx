// frontend/src/components/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { publicApi } from "../services/api";

export default function AdminPanel({ adminData }) {
  const [phone, setPhone] = useState("");
  const [oficialNumbers, setOficialNumbers] = useState([]);

  if (!adminData || !adminData.bank) {
    return <h2>Acesso negado. Faça login novamente.</h2>;
  }

  const { bank } = adminData;
  const bankNorm = bank.trim(); // Remove espaços extras

  console.log("AdminData recebido no painel:", adminData);

  // ======================================
  // BUSCAR NÚMEROS OFICIAIS DO ADMIN PELO BANCO
  // ======================================
  useEffect(() => {
    async function fetchOficialNumbers() {
      try {
        console.log("Buscando números oficiais do banco:", bankNorm);
        const response = await publicApi.get("/api/numbers/oficial", {
          params: { bank: bankNorm },
        });
        console.log("Números oficiais recebidos:", response.data);
        setOficialNumbers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Erro ao buscar números oficiais:", err);
        setOficialNumbers([]);
      }
    }

    fetchOficialNumbers();
  }, [bankNorm]);

  // ======================================
  // CADASTRAR/ATUALIZAR NÚMERO
  // ======================================
  async function atualizarNumero() {
    if (!phone) return alert("Preencha o campo número!");

    try {
      const phoneNorm = phone.replace(/\D/g, ""); // Remove tudo que não for número

      console.log("Enviando sync-oficial:", { phone: phoneNorm, bank: bankNorm });

      await publicApi.post("/api/sync-oficial", {
        phone: phoneNorm,
        bank: bankNorm,
      });

      alert("Número oficial atualizado com sucesso!");

      // Atualiza a tabela em tela
      const response = await publicApi.get("/api/numbers/oficial", {
        params: { bank: bankNorm },
      });
      setOficialNumbers(Array.isArray(response.data) ? response.data : []);
      setPhone("");
    } catch (err) {
      console.error("Erro ao atualizar número oficial", err);
      alert("Erro ao atualizar número oficial");
    }
  }

  return (
    <div className="admin-panel">
      <h1>Painel Administrativo</h1>
      <p>
        <strong>Admin:</strong> {adminData.email}
      </p>
      <p>
        <strong>Banco:</strong> {bankNorm}
      </p>

      <h2>Cadastrar / Atualizar Número Oficial</h2>
      <input
        type="text"
        placeholder="Número (ex: 11988887777)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={atualizarNumero}>Salvar</button>

      <hr />

      <h2>Meus Números Oficiais</h2>
      {oficialNumbers.length === 0 ? (
        <p>Nenhum número cadastrado ainda para este banco.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Telefone</th>
              <th>Banco</th>
              <th>Status</th>
              <th>Última Atualização</th>
            </tr>
          </thead>
          <tbody>
            {oficialNumbers.map((n, index) => (
              <tr key={index}>
                <td>{n.phone}</td>
                <td>{n.bank}</td>
                <td>{n.status}</td>
                <td>{n.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
