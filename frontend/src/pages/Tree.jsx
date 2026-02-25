import { useState, useEffect } from 'react'

// Beautiful Tree Logo SVG
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

// Modal window for timer
function TimerModal({ isOpen, onClose, activityName, time, onStop }) {
  if (!isOpen) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--spacing-xxl)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>
          🌱 {activityName}
        </h2>
        
        <TreeVisual time={time} />
        
        <div style={{
          fontSize: '3rem',
          fontWeight: '700',
          color: 'var(--color-primary)',
          margin: 'var(--spacing-lg) 0'
        }}>
          {formatTime(time)}
        </div>
        
        <p style={{ 
          color: 'var(--color-text-light)', 
          fontSize: '0.9rem',
          marginBottom: 'var(--spacing-lg)'
        }}>
          Сохраняется каждые 5 секунд...
        </p>
        
        <button 
          onClick={onStop}
          className="secondary"
          style={{ padding: '12px 40px', fontSize: '1.1rem' }}
        >
          ⏹ Стоп
        </button>
      </div>
    </div>
  )
}

function formatTime(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
}

// Beautiful growing tree visualization
function TreeVisual({ time }) {
  // Calculate growth stages based on time (in seconds)
  // 0-60s: sprout, 60-300s: small tree, 300-1800s: medium, 1800+: full tree
  const minutes = time / 60
  
  // Tree dimensions
  const trunkHeight = Math.min(30 + minutes * 0.5, 60)
  const trunkWidth = Math.min(8 + minutes * 0.1, 16)
  const foliageSize = Math.min(20 + minutes * 0.3, 50)
  
  // Color transitions - from light green to deep green
  const greenIntensity = Math.min(180 + minutes * 0.5, 220)
  const foliageColor = `rgb(34, ${greenIntensity}, 34)`
  
  // Growth stages for visual variety
  const isSprout = time < 60
  const isSmall = time >= 60 && time < 300
  const isMedium = time >= 300 && time < 1800
  const isFull = time >= 1800
  
  return (
    <svg width="120" height="180" viewBox="0 0 120 180">
      {/* Ground/grass */}
      <ellipse cx="60" cy="175" rx="45" ry="8" fill="#4a7c44" opacity="0.3"/>
      
      {/* Trunk - gets thicker and taller with time */}
      <path 
        d={`
          M ${60 - trunkWidth/2} 175 
          L ${60 - trunkWidth/3} ${175 - trunkHeight}
          L ${60 + trunkWidth/3} ${175 - trunkHeight}
          L ${60 + trunkWidth/2} 175 
          Z
        `}
        fill="#8B4513"
      />
      
      {/* Trunk texture */}
      <path 
        d={`
          M ${60 - trunkWidth/4} 175 
          L ${60 - trunkWidth/5} ${175 - trunkHeight}
        `}
        stroke="#6B3510"
        strokeWidth="2"
        opacity="0.4"
      />
      
      {/* Sprout stage - just a small green shoot */}
      {isSprout && (
        <g>
          <line x1="60" y1={175 - trunkHeight} x2="60" y2={175 - trunkHeight - 15} stroke="#5A9A54" strokeWidth="3"/>
          <ellipse cx="60" cy={175 - trunkHeight - 18} rx="6" ry="8" fill="#90EE90"/>
        </g>
      )}
      
      {/* Small tree - small foliage */}
      {isSmall && (
        <g>
          <circle cx="60" cy={175 - trunkHeight - 10} r="15" fill={foliageColor}/>
          <circle cx="52" cy={175 - trunkHeight - 5} r="10" fill="#4a7c44"/>
          <circle cx="68" cy={175 - trunkHeight - 5} r="10" fill="#3d6b37"/>
        </g>
      )}
      
      {/* Medium tree - more foliage */}
      {isMedium && (
        <g>
          <circle cx="60" cy={175 - trunkHeight - 20} r="22" fill={foliageColor}/>
          <circle cx="45" cy={175 - trunkHeight - 10} r="15" fill="#4a7c44"/>
          <circle cx="75" cy={175 - trunkHeight - 10} r="15" fill="#3d6b37"/>
          <circle cx="60" cy={175 - trunkHeight - 30} r="12" fill="#5a9a54"/>
        </g>
      )}
      
      {/* Full tree - big and beautiful */}
      {isFull && (
        <g>
          {/* Multiple layers for depth */}
          <circle cx="60" cy={175 - trunkHeight - 30} r="28" fill={foliageColor}/>
          <circle cx="40" cy={175 - trunkHeight - 15} r="20" fill="#4a7c44"/>
          <circle cx="80" cy={175 - trunkHeight - 15} r="20" fill="#3d6b37"/>
          <circle cx="50" cy={175 - trunkHeight - 40} r="15" fill="#5a9a54"/>
          <circle cx="70" cy={175 - trunkHeight - 40} r="15" fill="#5a9a54"/>
          <circle cx="60" cy={175 - trunkHeight - 48} r="10" fill="#90EE90" opacity="0.6"/>
        </g>
      )}
      
      {/* Sun/light effect */}
      <circle cx="95" cy="20" r="8" fill="#FFD700" opacity="0.6"/>
      <circle cx="95" cy="20" r="12" fill="#FFD700" opacity="0.2"/>
    </svg>
  )
}

export default function Tree() {
  const [activities, setActivities] = useState([])
  const [newActivity, setNewActivity] = useState('')
  const [selectedActivity, setSelectedActivity] = useState('')
  const [activeTimer, setActiveTimer] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/activities')
      .then(res => res.json())
      .then(data => setActivities(data))
  }, [])

  const createActivity = async () => {
    if (!newActivity.trim()) return
    
    const response = await fetch('http://localhost:8000/api/v1/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newActivity })
    })
    const activity = await response.json()
    setActivities([...activities, activity])
    setNewActivity('')
  }

  // Timer with auto-save every 5 seconds
  useEffect(() => {
    let interval = null
    let saveInterval = null
    let secondsCounter = 0
    
    if (activeTimer) {
      // Count seconds
      interval = setInterval(() => {
        secondsCounter++
        setSeconds(secondsCounter)
      }, 1000)
      
      // Auto-save every 5 seconds
      saveInterval = setInterval(async () => {
        if (selectedActivity) {
          await fetch(`http://localhost:8000/api/v1/activities/${selectedActivity}?time_add=5`, {
            method: 'PUT'
          })
          // Refresh activities to show updated time
          const res = await fetch('http://localhost:8000/api/v1/activities')
          const data = await res.json()
          setActivities(data)
        }
      }, 5000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
      if (saveInterval) clearInterval(saveInterval)
    }
  }, [activeTimer, selectedActivity])

  const stopTimer = async () => {
    // Save remaining seconds (not already saved)
    const remainingSeconds = seconds % 5
    if (selectedActivity && remainingSeconds > 0) {
      await fetch(`http://localhost:8000/api/v1/activities/${selectedActivity}?time_add=${remainingSeconds}`, {
        method: 'PUT'
      })
    }
    // Refresh activities
    const res = await fetch('http://localhost:8000/api/v1/activities')
    const data = await res.json()
    setActivities(data)
    
    setActiveTimer(false)
    setSeconds(0)
  }

  // Format time function
  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      createActivity()
    }
  }

  return (
    <div className="tree-page">
      {/* Header with logo */}
      <div className="tree-header">
        <TreeLogo />
        <h1>Дерево активностей</h1>
        <p style={{ color: 'var(--color-text-light)' }}>
          Вырасти своё дерево, фокусируясь на важных делах
        </p>
      </div>
      
      {/* Add activity */}
      <div className="add-activity-form">
        <input 
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Название активности (например: Чтение, Спорт, Медитация)"
        />
        <button onClick={createActivity}>Добавить</button>
      </div>
      
      {/* Activity selector */}
      <div style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
        <select 
          value={selectedActivity} 
          onChange={(e) => setSelectedActivity(e.target.value)}
          style={{ maxWidth: '300px' }}
        >
          <option value="">Выберите активность</option>
          {activities.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>
      {/* Activity trees grid */}
      {activities.length > 0 ? (
        <div className="activity-grid">
          {activities.map(a => (
            <div key={a.id} className="activity-card">
              <TreeVisual time={a.total_time || 0} />
              <h3 style={{ marginTop: 'var(--spacing-sm)' }}>{a.name}</h3>
              <p style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                {formatTime(a.total_time || 0)}
              </p>
              {a.total_time >= 1800 && (
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--color-success)',
                  background: 'rgba(39, 174, 96, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  🌳 Выросло!
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-xxl)',
          color: 'var(--color-text-light)'
        }}>
          <p>Пока нет активностей. Добавь свою первую активность!</p>
        </div>
      )}
      
      {/* Timer modal */}
      <TimerModal 
        isOpen={activeTimer}
        activityName={selectedActivity ? activities.find(a => a.id == selectedActivity)?.name : ''}
        time={(selectedActivity ? (activities.find(a => a.id == selectedActivity)?.total_time || 0) : 0) + seconds}
        onStop={stopTimer}
      />
      
      {/* Timer section */}
      <div className="timer-section">
        <h2>Таймер</h2>
        <div className="timer-display">
          {formatTime(seconds)}
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
          {!activeTimer ? (
            <button 
              onClick={() => setActiveTimer(true)}
            >
              ▶ Старт
            </button>
          ) : (
            <button 
              onClick={stopTimer}
              className="secondary"
            >
              ⏹ Стоп
            </button>
          )}
        </div>
        {selectedActivity && (
          <p style={{ 
            marginTop: 'var(--spacing-md)', 
            color: 'var(--color-text-light)',
            fontSize: '0.9rem'
          }}>
            Записывается для: {activities.find(a => a.id == selectedActivity)?.name}
          </p>
        )}
      </div>
    </div>
  )
}
