// LoginAdmin.jsx
import React, { useState } from "react";

export default function LoginAdmin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    console.log("Enviando para o backend:", { email, password });

    try {
      const res = await fetch("http://localhost:3002/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Resposta do backend:", data);

      if (data.success) {
        onLogin({
          id: data.id,
          email: data.email,
        });
      } else {
        alert(data.message || "Credenciais inválidas!");
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className="login-admin">
      <h2>Login Administrador</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          console.log("Digitando email:", e.target.value);
          setEmail(e.target.value);
        }}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => {
          console.log("Digitando senha:", e.target.value);
          setPassword(e.target.value);
        }}
      />

      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
