import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import CRM from './pages/CRM';
import Login from './pages/Login';
import Payments from './pages/Payments';
import Announcements from './pages/Announcements';
import Documents from './pages/Documents';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import { useAuthStore } from './store/authStore';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const LayoutRoute = ({ children }) => (
  <PrivateRoute>
    <MainLayout>
      {children}
    </MainLayout>
  </PrivateRoute>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LayoutRoute><Dashboard /></LayoutRoute>} />
        <Route path="/properties" element={<LayoutRoute><Properties /></LayoutRoute>} />
        <Route path="/crm" element={<LayoutRoute><CRM /></LayoutRoute>} />
        <Route path="/calendar" element={<LayoutRoute><ComingSoon title="Takvim" /></LayoutRoute>} />
        <Route path="/contracts" element={<LayoutRoute><ComingSoon title="Sözleşmeler" /></LayoutRoute>} />
        <Route path="/payments" element={<LayoutRoute><Payments /></LayoutRoute>} />
        <Route path="/announcements" element={<LayoutRoute><Announcements /></LayoutRoute>} />
        <Route path="/documents" element={<LayoutRoute><Documents /></LayoutRoute>} />
        <Route path="/messages" element={<LayoutRoute><Messages /></LayoutRoute>} />
        <Route path="/analytics" element={<LayoutRoute><ComingSoon title="Analitik" /></LayoutRoute>} />
        <Route path="/profile" element={<LayoutRoute><Profile /></LayoutRoute>} />
      </Routes>
    </Router>
  );
}

// Placeholder for upcoming pages
function ComingSoon({ title }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '16px',
      animation: 'fadeIn 0.5s ease-out',
    }}>
      <div style={{
        width: 80, height: 80,
        borderRadius: '20px',
        background: 'rgba(201, 168, 76, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 32,
      }}>
        🚧
      </div>
      <h2 style={{
        color: '#F1F5F9',
        fontFamily: "'Outfit', sans-serif",
        fontSize: 24,
        fontWeight: 600,
        margin: 0,
      }}>
        {title}
      </h2>
      <p style={{
        color: '#64748B',
        fontSize: 14,
        margin: 0,
      }}>
        Bu modül yakında aktif olacaktır.
      </p>
    </div>
  );
}

export default App;