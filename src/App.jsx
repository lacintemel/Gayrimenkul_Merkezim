import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Maintenance from './pages/Maintenance';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <PrivateRoute>
              <MainLayout>
                <Maintenance />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <PrivateRoute>
              <MainLayout>
                <Payments />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <PrivateRoute>
              <MainLayout>
                <Announcements />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <PrivateRoute>
              <MainLayout>
                <Documents />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <MainLayout>
                <Messages />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;