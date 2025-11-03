import React, { useState } from 'react'
import Header from './components/Header'
import SearchBox from './components/SearchBox'
import ResultCard from './components/ResultCard'
import ReportForm from './components/ReportForm'
import api from './services/api'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showReport, setShowReport] = useState(false)

  async function handleCheck(phone) {
    setLoading(true)
    try {
      const res = await api.get(`/numbers/${encodeURIComponent(phone)}`)
      setResult(res.data)
    } catch (err) {
      console.error(err)
      setResult({ status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleReport(payload) {
    try {
      await api.post('/report', payload)
      setShowReport(false)
      if (result) handleCheck(result.phone)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="app">
      <Header />

      <main className="container">
        {/* Caixa de busca */}
        <SearchBox onCheck={handleCheck} loading={loading} />

        {/* Resultado de busca */}
        {result && (
          <ResultCard
            data={result}
            onReport={() => setShowReport(true)}
          />
        )}

        {/* Formulário de denúncia */}
        {showReport && (
          <ReportForm
            phone={result?.phone}
            onCancel={() => setShowReport(false)}
            onSubmit={handleReport}
          />
        )}

        {/* DICAS DE SEGURANÇA */}
        <section className="tips-section">
          <h2>Dicas de Segurança</h2>

          <div className="tips-grid">
            <div className="tip-card">
              <h3>1. Desconfie de mensagens urgentes</h3>
              <p>Golpistas costumam usar o senso de urgência para enganar. Sempre confirme a informação por canais oficiais antes de agir.</p>
            </div>

            <div className="tip-card">
              <h3>2. Não compartilhe códigos de verificação</h3>
              <p>Esses códigos são pessoais e nunca devem ser informados a terceiros, mesmo que se passem por empresas conhecidas.</p>
            </div>

            <div className="tip-card">
              <h3>3. Verifique o número antes de responder</h3>
              <p>Confirme se o número realmente pertence à instituição antes de clicar em links ou enviar dados pessoais. Para isso use a barra acima!</p>
            </div>

            <div className="tip-card">
              <h3>4. Cuidado com links suspeitos</h3>
              <p>Evite clicar em links recebidos por SMS, WhatsApp ou e-mail que peçam dados pessoais ou financeiros.</p>
            </div>

            <div className="tip-card">
              <h3>5. Mantenha seus aplicativos atualizados</h3>
              <p>Atualizações corrigem falhas de segurança e mantêm seu dispositivo protegido contra novas ameaças.</p>
            </div>

            <div className="tip-card">
              <h3>6. Use autenticação em duas etapas</h3>
              <p>Ative a autenticação em dois fatores em todos os aplicativos e redes sociais que oferecem essa opção.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}