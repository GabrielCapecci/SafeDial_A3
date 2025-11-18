import React, { useState } from "react";
import { adminApi } from "../services/api";

export default function LoginAdmin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await adminApi.post("/admin/login", { email, password });

      if (!res.data.success) {
        setError("Login inválido");
        return;
      }

      const adminInfo = {
        email: res.data.email,
        bank: res.data.bank, // pega o banco do servidor
      };

      onLoginSuccess(adminInfo);
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="login-admin">
      <h2>Login Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
