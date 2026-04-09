// src/components/Layout/AppLayout.tsx
import { Layout, Menu, Avatar, Dropdown, Space, Badge } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  MessageOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  BookOutlined,
  ToolOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { ManagerBadge } from '@/components/UI/ManagerBadge/ManagerBadge';


const { Sider, Content } = Layout;

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    navigate('/settings');
  };

  const handleLogout = () => {
    // Очищаем данные авторизации
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    // Перенаправляем на страницу входа
    navigate('/login');
  };

  const menuItems: MenuProps['items'] = [
    { key: '/', icon: <DashboardOutlined />, label: 'Дашборд' },
    { key: '/clients', icon: <TeamOutlined />, label: 'Клиенты' },
    { key: '/chats', icon: <MessageOutlined />, label: 'Чаты', badge: 3 },
    { key: '/internal-chat', icon: <ToolOutlined />, label: 'Технический чат' },
    { key: '/faq', icon: <QuestionCircleOutlined />, label: 'Умный FAQ' },
    { key: '/onboarding', icon: <BookOutlined />, label: 'Онбординг' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Настройки' },
  ];

  const profileMenu: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Профиль',
      onClick: handleProfileClick // ← Добавь это
    },
    {
      key: 'logout',
      label: 'Выйти',
      danger: true,
      onClick: handleLogout // ← Добавляем обработчик
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar — фиксированный */}
      <Sider
        width={250}
        theme="dark"
        breakpoint="lg"
        collapsedWidth="80"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          overflow: 'auto',
          zIndex: 1000,
        }}
      >
        {/* Логотип */}
        <div
          onClick={() => navigate('/')}
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #333',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          FlippiFlop
        </div>

        {/* Меню */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      {/* Основной контейнер */}
      <Layout
        style={{
          marginLeft: 250,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Header — фиксированный */}
        <header
          style={{
            height: '64px',
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: '500' }}>
            Flex-N-Roll  CRM
          </div>

          <Space size="large">
            {/* 🔹 Рейтинг менеджера */}
            <ManagerBadge />

            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items: profileMenu }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#0052cc' }}
                />
                <span style={{ color: '#333' }}>Менеджер</span>
              </Space>
            </Dropdown>
          </Space>
        </header>

        {/* Content — скроллится только эта область */}
        <Content
          style={{
            flex: 1,
            margin: '24px',
            padding: '24px',
            background: '#f0f2f5',
            borderRadius: '8px',
            overflowY: 'auto',
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};