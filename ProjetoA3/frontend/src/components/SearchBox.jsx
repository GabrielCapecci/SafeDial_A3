import React, { useState } from 'react'

export default function SearchBox({ onCheck, loading }){
  const [phone, setPhone] = useState('')
  function submit(e){
    e.preventDefault()
    if(!phone) return
    onCheck(phone)
  }
  return (
    <form className="search-box" onSubmit={submit}>
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 98888-7777" />
      <button type="submit" disabled={loading}>{loading ? 'Verificando...' : 'Verificar'}</button>
    </form>
  )
}
