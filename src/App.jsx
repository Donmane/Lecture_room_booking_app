import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login/login'
import Signup from './pages/signup/Signup'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}