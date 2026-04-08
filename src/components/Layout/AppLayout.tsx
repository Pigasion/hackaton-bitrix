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
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Sider, Content } = Layout;

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    { key: '/', icon: <DashboardOutlined />, label: 'Дашборд' },
    { key: '/clients', icon: <TeamOutlined />, label: 'Клиенты' },
    { key: '/chats', icon: <MessageOutlined />, label: 'Чаты', badge: 3 },
    { key: '/internal-chat', icon: <ToolOutlined />, label: 'Тех. чат' },
    { key: '/onboarding', icon: <BookOutlined />, label: 'Онбординг' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Настройки' },
  ];

  const profileMenu: MenuProps['items'] = [
    { key: 'profile', label: 'Профиль' },
    { key: 'logout', label: 'Выйти', danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 🔹 Sidebar — ФИКСИРОВАННЫЙ */}
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
        {/* Логотип (без иконки домика) */}
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
          PolyRouter
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

      {/* 🔹 Основной контейнер */}
      <Layout
        style={{
          marginLeft: 250,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* 🔹 Header — ФИКСИРОВАННЫЙ (не скроллится) */}
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
            Единая система коммуникаций
          </div>

          <Space size="large">
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

        {/* 🔹 Content — СКРОЛЛИТСЯ ТОЛЬКО ЭТА ОБЛАСТЬ */}
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