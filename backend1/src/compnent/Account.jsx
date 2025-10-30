import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './auth.css'

export default function Account(){
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('fb_user')
      if(!raw) return navigate('/login')
      setUser(JSON.parse(raw))
    }catch(e){ navigate('/login') }
  },[])

  function logout(){
    localStorage.removeItem('fb_user')
    navigate('/login')
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h2>Account</h2>
        {user ? (
          <>
            <p className="muted">Signed in as <strong>{user.username}</strong></p>
            <div style={{marginTop:12}}>
              <button className="btn" onClick={logout}>Log out</button>
            </div>
          </>
        ) : (
          <p className="muted">Redirecting...</p>
        )}
      </div>
    </div>
  )
}
