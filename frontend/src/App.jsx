import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import DonorRegistration from './pages/DonorRegistration';
import BloodRequest from './pages/BloodRequest';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import DonorDashboard from './pages/DonorDashboard';
import RequestStatus from './pages/RequestStatus';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<DonorRegistration />} />
                <Route path="/donor-registration" element={<DonorRegistration />} />
                <Route path="/request" element={<BloodRequest />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/donor-dashboard" element={<DonorDashboard />} />
                <Route path="/request-status" element={<RequestStatus />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;