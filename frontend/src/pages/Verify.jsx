import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function Verify() {
  const { token } = useParams()
  const [status, setStatus] = useState('Проверка...')

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/auth/verify/${token}`)
      .then(res => res.json())
      .then(data => setStatus(data.message || 'Подтверждено!'))
      .catch(() => setStatus('Ошибка подтверждения'))
  }, [token])

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '20px' }}>
          {status}
        </h2>
        {status === 'Подтверждено!' || status.includes('подтверждён') ? (
          <p style={{ color: 'var(--color-success)' }}>
            ✓ Ваш email подтверждён
          </p>
        ) : null}
        <Link to="/login" style={{ 
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 30px',
          background: 'var(--color-primary)',
          color: 'white',
          borderRadius: '25px',
          textDecoration: 'none'
        }}>
          Войти
        </Link>
      </div>
    </div>
  )
}
