// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout/AppLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import Chats from '@/pages/Chats';
import InternalChat from '@/pages/InternalChat';
import Onboarding from '@/pages/Onboarding';
import Faq from '@/pages/Faq';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

// 🔹 Защита роутов
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* 1. Публичный вход */}
      <Route path="/login" element={<Login />} />

      {/* 2. Защищённые страницы (конкретные пути) */}
      <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><AppLayout><Clients /></AppLayout></ProtectedRoute>} />
      <Route path="/chats" element={<ProtectedRoute><AppLayout><Chats /></AppLayout></ProtectedRoute>} />
      <Route path="/internal-chat" element={<ProtectedRoute><AppLayout><InternalChat /></AppLayout></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><AppLayout><Onboarding /></AppLayout></ProtectedRoute>} />
      <Route path="/faq" element={<ProtectedRoute><AppLayout><Faq /></AppLayout></ProtectedRoute>} />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 3. 404 — СТРОГО ПОСЛЕДНИЙ, без защиты (чтобы ловил любые пути) */}
      <Route path="*" element={
        <AppLayout>
          <NotFound />
        </AppLayout>
      } />
    </Routes>
  );
}

export default App;