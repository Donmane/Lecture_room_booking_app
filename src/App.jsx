import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login/login'
import Signup from './pages/signup/Signup'
import AdminDashboard from './pages/admin/Admindashboard'
import LecturerDashboard from './pages/lecturer/Lecturerdashboard'
import StudentDashboard from './pages/student/Studentdashboard'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/lecturer" element={<LecturerDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}