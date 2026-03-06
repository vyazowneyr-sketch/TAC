import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = "476158461658-cf99taf1bmcg4u7knrj63s0hs3qauq77.apps.googleusercontent.com"

// Tree Logo SVG
function TreeLogo() {
  return (
    <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Trunk */}
      <rect x="42" y="55" width="16" height="40" rx="2" fill="#8B4513"/>
      <rect x="44" y="55" width="4" height="40" fill="#6B3510" opacity="0.3"/>
      
      {/* Foliage - layered circles for depth */}
      <circle cx="50" cy="25" r="22" fill="#2D5A27"/>
      <circle cx="35" cy="35" r="15" fill="#4A7C44"/>
      <circle cx="65" cy="35" r="15" fill="#3D6B37"/>
      <circle cx="50" cy="18" r="12" fill="#5A9A54"/>
      
      {/* Highlight */}
      <circle cx="42" cy="20" r="5" fill="#90EE90" opacity="0.4"/>
    </svg>
  )
}

function RegisterForm() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (response) => {
      console.log('Google response:', response)
      const tokenToSend = response.access_token
      console.log('Sending to backend:', tokenToSend)
      try {
        const res = await fetch('http://localhost:8000/api/v1/auth/google', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ token: tokenToSend })
        })
        console.log('Backend response status:', res.status)
        const data = await res.json()
        console.log('Backend response data:', data)
        localStorage.setItem('token', data.access_token)
        window.location.href = '/tree'
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Ошибка регистрации через Google')
      }
    },
    onError: () => {
      setError('Ошибка регистрации через Google')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Ошибка регистрации')
      }

      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="logo-container">
          <TreeLogo />
          <h1>Регистрация</h1>
          <p style={{ color: 'var(--color-text-light)' }}>Создай свой аккаунт</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input 
              id="username"
              type="text" 
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit">Зарегистрироваться</button>
          
          {error && <p className="error">{error}</p>}
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={handleGoogleRegister}
            style={{ 
              background: '#fff', 
              color: '#333',
              border: '1px solid #ddd',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              width="20" 
              height="20" 
            />
            Зарегистрироваться через Google
          </button>
        </div>
        
        <p className="links">
          Уже есть аккаунт? <a href="/login">Войти</a>
        </p>
      </div>
    </div>
  )
}

export default function Register() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RegisterForm />
    </GoogleOAuthProvider>
  )
}
