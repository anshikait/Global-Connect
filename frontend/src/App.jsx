
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserDashboard from './pages/UserDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route 
          path='/user-dashboard' 
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard/>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/recruiter-dashboard' 
          element={
            <ProtectedRoute requiredRole="recruiter">
              <RecruiterDashboard/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
