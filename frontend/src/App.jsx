
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AuthSelection from './pages/AuthSelection'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import RecruiterLogin from './pages/RecruiterLogin'
import RecruiterSignup from './pages/RecruiterSignup'
import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/UserDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        
        {/* Auth Selection */}
        <Route path='/auth' element={<AuthSelection/>}/>
        
        {/* User Authentication */}
        <Route path='/user/login' element={<UserLogin/>}/>
        <Route path='/user/signup' element={<UserSignup/>}/>
        
        {/* Recruiter Authentication */}
        <Route path='/recruiter/login' element={<RecruiterLogin/>}/>
        <Route path='/recruiter/signup' element={<RecruiterSignup/>}/>
        
        {/* Dashboard Routes */}
        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        />
        
        {/* Specific Role Dashboards */}
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
