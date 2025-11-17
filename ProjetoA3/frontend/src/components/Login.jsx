// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { adminApi } from '../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await adminApi.post('/auth/login', { email, password });

      if (res.data && res.data.success) {
        onLogin(); // chama a função passada do App.jsx
      } else {
        setError(res.data?.message || 'Credenciais incorretas.');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Falha ao conectar com o servidor.');
    }
  }

  return (
    <div className="login-container">
      <h2>Login Admin</h2>
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
