import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Payments from './pages/Payments';
import Announcements from './pages/Announcements';
import Documents from './pages/Documents';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Maintenance from './pages/Maintenance';
import Tenancies from './pages/Tenancies';
import Reports from './pages/Reports';
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
        <Route path="/properties/:id" element={<LayoutRoute><PropertyDetail /></LayoutRoute>} />
        <Route path="/crm" element={<Navigate to="/" replace />} />
        <Route path="/calendar" element={<Navigate to="/" replace />} />
        <Route path="/contracts" element={<LayoutRoute><Tenancies /></LayoutRoute>} />
        <Route path="/payments" element={<LayoutRoute><Payments /></LayoutRoute>} />
        <Route path="/maintenance" element={<LayoutRoute><Maintenance /></LayoutRoute>} />
        <Route path="/announcements" element={<LayoutRoute><Announcements /></LayoutRoute>} />
        <Route path="/documents" element={<LayoutRoute><Documents /></LayoutRoute>} />
        <Route path="/messages" element={<LayoutRoute><Messages /></LayoutRoute>} />
        <Route path="/analytics" element={<LayoutRoute><Reports /></LayoutRoute>} />
        <Route path="/profile" element={<LayoutRoute><Profile /></LayoutRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
