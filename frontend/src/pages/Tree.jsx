import { useState, useEffect } from 'react'

export default function Tree() {
  const [activities, setActivities] = useState([])
  const [newActivity, setNewActivity] = useState('')
  const [activeTimer, setActiveTimer] = useState(null)
  const [seconds, setSeconds] = useState(0)

  // Загружаем активности при открытии
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/activities')
      .then(res => res.json())
      .then(data => setActivities(data))
  }, [])

  // Создать активность
  const createActivity = async () => {
    const response = await fetch('http://localhost:8000/api/v1/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newActivity })
    })
    const activity = await response.json()
    setActivities([...activities, activity])
    setNewActivity('')
  }

  // Таймер
  useEffect(() => {
    let interval = null
    if (activeTimer) {
      interval = setInterval(() => {
        setSeconds(s => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeTimer])

  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
  }

  return (
    <div>
      <h1>Дерево активностей</h1>
      
      {/* Создать активность */}
      <div>
        <input 
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          placeholder="Название активности"
        />
        <button onClick={createActivity}>Создать</button>
      </div>

      {/* Список активностей */}
      <ul>
        {activities.map(a => (
          <li key={a.id}>
            {a.name} - {formatTime(a.total_time || 0)}
          </li>
        ))}
      </ul>

      {/* Таймер */}
      <div>
        <h2>Таймер: {formatTime(seconds)}</h2>
        <button onClick={() => setActiveTimer(!activeTimer)}>
          {activeTimer ? 'Стоп' : 'Старт'}
        </button>
      </div>
    </div>
  )
}
