import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Tree from './pages/Tree'
import Register from './pages/Register'
import Verify from './pages/Verify'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route 
          path="/tree" 
          element={
            <ProtectedRoute>
              <Tree />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/tree" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
