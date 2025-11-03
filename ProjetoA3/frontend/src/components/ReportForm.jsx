import React, { useState } from 'react'

export default function ReportForm({ phone, onCancel, onSubmit }){
  const [desc, setDesc] = useState('')
  function submit(e){
    e.preventDefault()
    onSubmit({ phone, description: desc })
  }
  return (
    <div className="report-modal">
      <form className="report-form" onSubmit={submit}>
        <h3>Denunciar número</h3>
        <p><strong>Telefone:</strong> {phone}</p>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descreva a tentativa..." />
        <div className="actions">
          <button type="button" onClick={onCancel}>Cancelar</button>
          <button type="submit">Enviar denúncia</button>
        </div>
      </form>
    </div>
  )
}
