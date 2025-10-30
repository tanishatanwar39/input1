import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './auth.css'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    // Simple client-side auth for demo: accept any non-empty username/password
    await new Promise(r => setTimeout(r, 450))
    if (!form.username || !form.password) {
      setError('Please enter username and password')
      setLoading(false)
      return
    }
    // store simple token in localStorage
    localStorage.setItem('fb_user', JSON.stringify({ username: form.username }))
    setLoading(false)
    navigate('/form')

  }

  return (
    <div className="auth-root">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Sign in</h2>
        <p className="muted">Sign in to manage feedback and view submissions.</p>

        <label>Username</label>
        <input name="username" value={form.username} onChange={onChange} placeholder="your name" />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} placeholder="password" />

        {error && <div className="error">{error}</div>}

        <div className="actions">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing...' : 'Sign in'}</button>
        </div>
      </form>
    </div>
  )
}
