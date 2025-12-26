import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from './theme';
import { useAuthStore } from './stores/authStore';
import LandingPage from './pages/public/LandingPage';
import PublicLetterPage from './pages/public/PublicLetterPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import LetterListPage from './pages/admin/LetterListPage';
import LetterFormPage from './pages/admin/LetterFormPage';
import LetterTypeListPage from './pages/admin/LetterTypeListPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/letter/:slug" element={<PublicLetterPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/letters"
            element={
              <ProtectedRoute>
                <LetterListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/letters/new"
            element={
              <ProtectedRoute>
                <LetterFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/letters/:id/edit"
            element={
              <ProtectedRoute>
                <LetterFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/letter-types"
            element={
              <ProtectedRoute>
                <LetterTypeListPage />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
