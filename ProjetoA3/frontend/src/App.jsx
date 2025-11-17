import React, { useState } from "react";
import Header from "./components/Header";
import SearchBox from "./components/SearchBox";
import ResultCard from "./components/ResultCard";
import ReportForm from "./components/ReportForm";
import LoginAdmin from "./components/LoginAdmin";
import AdminPanel from "./components/AdminPanel";
import { publicApi } from "./services/api";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [adminLogged, setAdminLogged] = useState(false);
  const [adminData, setAdminData] = useState(null); // Armazena dados do admin logado

  // =======================
  // Usuário comum
  // =======================
  async function handleCheck(phone) {
    setLoading(true);
    try {
      const res = await publicApi.get(`/api/numbers/${encodeURIComponent(phone)}`);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ status: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleReport(payload) {
    try {
      await publicApi.post("/api/report", payload);
      setShowReport(false);
      if (result) handleCheck(result.phone);
    } catch (err) {
      console.error(err);
    }
  }

  // =======================
  // Admin
  // =======================
  function handleAdminLogin(adminInfo) {
    setAdminData(adminInfo); // Recebe {id, email} do LoginAdmin
    setAdminLogged(true);
  }

  return (
    <div className="app">
      <Header />

      <main className="container">
        {/* Usuário comum */}
        <SearchBox onCheck={handleCheck} loading={loading} />

        {result && (
          <ResultCard data={result} onReport={() => setShowReport(true)} />
        )}

        {showReport && (
          <ReportForm
            phone={result?.phone}
            onCancel={() => setShowReport(false)}
            onSubmit={handleReport}
          />
        )}

        {/* Admin */}
        {!adminLogged && <LoginAdmin onLogin={handleAdminLogin} />}
        {adminLogged && adminData && (
          <div>
            <p>Bem-vindo, {adminData.email}</p>
            <p>Você está logado como administrador.</p>
            <AdminPanel />
          </div>
        )}
      </main>
    </div>
  );
}
