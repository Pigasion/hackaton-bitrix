// src/pages/InternalChat.tsx
import { useState } from 'react';
import { Layout, List, Avatar, Badge, Input, Button, Tag, Space, Typography, Empty, Divider, Card } from 'antd';
import { SearchOutlined, SendOutlined, PaperClipOutlined, TeamOutlined, CalculatorOutlined, CarOutlined, ToolOutlined } from '@ant-design/icons';
import { AppButton, AppInput, AppCard, PageHeader } from '@/components/UI';

const { Content } = Layout;
const { Text } = Typography;

const internalChats = [
  { id: '1', department: 'economist', departmentName: 'Экономисты', icon: <CalculatorOutlined />, unreadCount: 2, lastMessage: 'Расчёт по заказу №1234 готов', lastMessageTime: '11:30', members: 5 },
  { id: '2', department: 'logistics', departmentName: 'Логистика', icon: <CarOutlined />, unreadCount: 0, lastMessage: 'Доставка завтра в 14:00', lastMessageTime: '10:15', members: 3 },
  { id: '3', department: 'production', departmentName: 'Производство', icon: <ToolOutlined />, unreadCount: 1, lastMessage: 'Тираж в печати, будет готов к 18:00', lastMessageTime: '09:45', members: 8 },
  { id: '4', department: 'all', departmentName: 'Общий чат', icon: <TeamOutlined />, unreadCount: 5, lastMessage: 'Коллеги, не забудьте про планёрку', lastMessageTime: '09:00', members: 24 },
];

const mockMessages: Record<string, any[]> = {
  '1': [
    { id: 'm1', author: 'Петрова А.С.', department: 'economist', text: 'Привет! Нужен расчёт по заказу №1234', time: '11:00', avatar: 'П' },
    { id: 'm2', author: 'Сидоров М.К.', department: 'economist', text: 'Расчёт по заказу №1234 готов', time: '11:30', avatar: 'С' },
  ],
};

const departmentColors: Record<string, string> = { economist: 'blue', logistics: 'green', production: 'orange', all: 'purple', manager: 'default' };

function InternalChat() {
  const [selectedChatId, setSelectedChatId] = useState<string>('1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedChat = internalChats.find(c => c.id === selectedChatId);
  const messages = selectedChatId ? (mockMessages[selectedChatId] || []) : [];

  const filteredChats = internalChats.filter(chat => chat.departmentName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Layout style={{ background: 'transparent', minHeight: 'calc(100vh - 136px)' }}>
      <Content style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 200px)' }}>
        {/* Список отделов */}
        <div style={{ width: '350px', background: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <Typography.Title level={4} style={{ margin: 0 }}><TeamOutlined style={{ marginRight: '8px' }} />Технический чат</Typography.Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>Внутренняя коммуникация между отделами</Text>
          </div>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <AppInput placeholder="Поиск по отделам..." prefix={<SearchOutlined />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} allowClear size="small" fullWidth />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <List dataSource={filteredChats} renderItem={(chat) => (
              <List.Item onClick={() => setSelectedChatId(chat.id)} style={{ padding: '12px 16px', cursor: 'pointer', background: selectedChatId === chat.id ? '#e6f4ff' : 'transparent', borderBottom: '1px solid #f0f0f0' }}>
                <List.Item.Meta
                  avatar={<Badge count={chat.unreadCount} size="small"><div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#0052cc' }}>{chat.icon}</div></Badge>}
                  title={<Space><Text strong>{chat.departmentName}</Text><Tag color={departmentColors[chat.department]} size="small">{chat.members}</Tag></Space>}
                  description={<div><Text type="secondary" ellipsis style={{ fontSize: '12px' }}>{chat.lastMessage}</Text><div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{chat.lastMessageTime}</div></div>}
                />
              </List.Item>
            )} />
          </div>
        </div>

        {/* Окно чата */}
        <div style={{ flex: 1, background: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
          {selectedChat ? (
            <>
              <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#0052cc' }}>{selectedChat.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{selectedChat.departmentName}<Tag color={departmentColors[selectedChat.department]} style={{ marginLeft: '8px' }}>{selectedChat.members} участников</Tag></div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Внутренний чат для координации</Text>
                  </div>
                </Space>
              </div>
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#fafafa' }}>
                {messages.map((message) => (
                  <div key={message.id} style={{ marginBottom: '16px' }}>
                    <Space align="start">
                      <Avatar style={{ backgroundColor: '#0052cc' }}>{message.avatar}</Avatar>
                      <div>
                        <div style={{ marginBottom: '4px' }}><Text strong style={{ marginRight: '8px' }}>{message.author}</Text><Tag color={departmentColors[message.department]} size="small">{message.department}</Tag><Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>{message.time}</Text></div>
                        <Card size="small" style={{ maxWidth: '70%', background: '#fff', border: '1px solid #f0f0f0' }}>{message.text}</Card>
                      </div>
                    </Space>
                  </div>
                ))}
              </div>
              <Divider style={{ margin: 0 }} />
              <div style={{ padding: '16px' }}>
                <Input.TextArea value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Задайте вопрос коллегам из отдела..." autoSize={{ minRows: 2, maxRows: 4 }} style={{ marginBottom: '12px' }} />
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Space><Button icon={<PaperClipOutlined />} /></Space>
                  <AppButton icon={<SendOutlined />} disabled={!messageText.trim()}>Отправить</AppButton>
                </Space>
              </div>
            </>
          ) : (
            <EmptyState title="Отдел не выбран" description="Выберите отдел из списка слева для начала общения" />
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default InternalChat;