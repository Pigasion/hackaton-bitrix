// src/App.tsx
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 🔹 Импорт Layout
import { AppLayout } from '@/components/Layout/AppLayout';

// 🔹 Импорт приватных страниц (с меню)
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import Chats from '@/pages/Chats';
import InternalChat from '@/pages/InternalChat';
import Onboarding from '@/pages/Onboarding';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

// 🔹 Импорт публичных страниц (без меню)
import Registration from '@/pages/Registration';
import Login from '@/pages/Login';

// 🔹 React Query клиент
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={ruRU}
        theme={{
          token: {
            colorPrimary: '#0052cc',
            borderRadius: 8,
          },
        }}
      >
        <BrowserRouter>
          <Routes>
            {/* 🔹 ПУБЛИЧНЫЕ РОУТЫ (без AppLayout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />

            {/* 🔹 ПРИВАТНЫЕ РОУТЫ (с AppLayout) */}
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/clients" element={<AppLayout><Clients /></AppLayout>} />
            <Route path="/chats" element={<AppLayout><Chats /></AppLayout>} />
            <Route path="/internal-chat" element={<AppLayout><InternalChat /></AppLayout>} />
            <Route path="/onboarding" element={<AppLayout><Onboarding /></AppLayout>} />
            <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />

            {/* 🔹 404 — ПОСЛЕДНИЙ */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;