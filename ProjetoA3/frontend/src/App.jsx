// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBox from "./components/SearchBox";
import ResultCard from "./components/ResultCard";
import ReportForm from "./components/ReportForm";
import LoginAdmin from "./components/LoginAdmin";
import AdminPanel from "./components/AdminPanel";
import { publicApi, adminApi } from "./services/api";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [adminLogged, setAdminLogged] = useState(false);
  const [adminData, setAdminData] = useState(null);

  // =======================
  // Carrega adminData do localStorage ao iniciar
  // =======================
  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("adminData"));
    if (storedAdmin && storedAdmin.bank) { // <-- trocado public_key por bank
      setAdminData(storedAdmin);
      setAdminLogged(true);
    }
  }, []);

  // =======================
  // Usuário comum: verificar número
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

  // =======================
  // Usuário comum: enviar report
  // =======================
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
  // Admin login
  // =======================
  function handleAdminLogin(adminInfo) {
    setAdminData(adminInfo);
    setAdminLogged(true);
    localStorage.setItem("adminData", JSON.stringify(adminInfo));
  }

  // =======================
  // Logout admin
  // =======================
  function handleAdminLogout() {
    setAdminData(null);
    setAdminLogged(false);
    localStorage.removeItem("adminData");
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

        {showReport && result && (
          <ReportForm
            phone={result.phone}
            onCancel={() => setShowReport(false)}
            onSubmit={handleReport}
          />
        )}

        {/* Admin */}
        {!adminLogged && (
          <LoginAdmin onLoginSuccess={handleAdminLogin} />
        )}

        {adminLogged && adminData && (
          <div>
            <p>
              Bem-vindo, <strong>{adminData.email}</strong>
            </p>
            <p>
              Banco: <strong>{adminData.bank}</strong>
            </p>
            <button onClick={handleAdminLogout}>Logout</button>
            <AdminPanel adminData={adminData} />
          </div>
        )}
      </main>
    </div>
  );
}
