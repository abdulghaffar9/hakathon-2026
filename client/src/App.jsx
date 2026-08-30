import Profile from './pages/Profile.jsx'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import OfficerDashboard from './pages/OfficerDashboard.jsx'
import PublicComplaints from './pages/PublicComplaints.jsx'
import ReportComplaint from './pages/ReportComplaint.jsx'
import ComplaintDetail from './pages/ComplaintDetail.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import PublicOnlyRoute from './routes/PublicOnlyRoute.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-8 md:py-10">
        <Routes>
        <Route element={<ProtectedRoute />}>
       <Route path="/profile" element={<Profile />} />
      </Route>

          <Route path="/" element={<Home />} />
          <Route path="/complaints" element={<PublicComplaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetail />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute citizenOnly />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/report" element={<ReportComplaint />} />
          </Route>

          <Route element={<ProtectedRoute officerOnly />}>
            <Route path="/officer" element={<OfficerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/legacy-dashboard" element={<UserDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 text-sm text-slate-500">CivicConnect · A transparent bridge between citizens and local authorities.</div>
      </footer>
    </div>
  )
}
