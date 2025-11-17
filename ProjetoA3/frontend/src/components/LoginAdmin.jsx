import React, { useState } from "react";

export default function LoginAdmin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    // Aqui você pode validar email/senha localmente ou via API
    if (email === "admin@teste.com" && password === "123456") {
      const adminData = {
        id: 1,
        email,
      };
      onLogin(adminData);
    } else {
      alert("Credenciais inválidas!");
    }
  }

  return (
    <div className="login-admin">
      <h2>Login Administrador</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
