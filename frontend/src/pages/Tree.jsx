import { useState, useEffect } from 'react'

// Компонент дерева
function TreeVisual({ time }) {
  const height = Math.min(time * 2, 200) + 20
  const green = Math.min(139 + time, 200)
  
  return (
    <svg width="100" height="220">
      <rect x="45" y={220 - height/3} width="10" height={height/3} fill="#8B4513" />
      <polygon 
        points={`50,${220 - height} 30,${220 - height/2} 70,${220 - height/2}`} 
        fill={`rgb(34, ${green}, 34)`}
      />
    </svg>
  )
}

export default function Tree() {
  const [activities, setActivities] = useState([])
  const [newActivity, setNewActivity] = useState('')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [activeTimer, setActiveTimer] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/activities')
      .then(res => res.json())
      .then(data => setActivities(data))
  }, [])

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

  useEffect(() => {
    let interval = null
    if (activeTimer) {
      interval = setInterval(() => {
        setSeconds(s => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeTimer])

  const stopTimer = async () => {
    if (selectedActivity && seconds > 0) {
      await fetch(`http://localhost:8000/api/v1/activities/${selectedActivity}?time_add=${seconds}`, {
        method: 'PUT'
      })
      const res = await fetch('http://localhost:8000/api/v1/activities')
      const data = await res.json()
      setActivities(data)
    }
    setActiveTimer(false)
    setSeconds(0)
  }

  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
  }

  return (
    <div>
      <h1>Дерево активностей</h1>
      
      <div>
        <input 
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          placeholder="Название активности"
        />
        <button onClick={createActivity}>Создать</button>
      </div>

      <div>
        <select onChange={(e) => setSelectedActivity(e.target.value)}>
          <option value="">Выберите активность</option>
          {activities.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {activities.map(a => (
          <div key={a.id} style={{ textAlign: 'center' }}>
            <TreeVisual time={a.total_time || 0} />
            <p>{a.name}</p>
            <small>{formatTime(a.total_time || 0)}</small>
          </div>
        ))}
      </div>

      <div>
        <h2>Таймер: {formatTime(seconds)}</h2>
        <button onClick={() => activeTimer ? stopTimer() : setActiveTimer(true)}>
          {activeTimer ? 'Стоп и сохранить' : 'Старт'}
        </button>
      </div>
    </div>
  )
}
