import React from 'react'

export default function ResultCard({ data, onReport }){
  if(data.status === 'error') return <div className="card">Erro ao consultar. Tente novamente.</div>

  if(data.status === 'oficial'){
    return (
      <div className="card success">
        <h3>✅ Número oficial</h3>
        <p><strong>Telefone:</strong> {data.phone}</p>
        <p><strong>Banco:</strong> {data.bank}</p>
        <p><strong>Última atualização:</strong> {data.lastUpdate}</p>
      </div>
    )
  }

  if(data.status === 'suspeito'){
    return (
      <div className="card warn">
        <h3>⚠️ Número suspeito</h3>
        <p><strong>Telefone:</strong> {data.phone}</p>
        <p>Denunciado <strong>{data.reports}</strong> vezes. Evite fornecer informações.</p>
        <button onClick={onReport}>Denunciar</button>
      </div>
    )
  }

  return (
    <div className="card unknown">
      <h3>❌ Número não reconhecido</h3>
      <p>{data.phone}</p>
      <button onClick={onReport}>Denunciar</button>
    </div>
  )
}
