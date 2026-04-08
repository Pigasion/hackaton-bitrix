// src/pages/Chats.tsx
import { useState } from 'react';
import { Layout, List, Avatar, Badge, Input, Button, Tag, Space, Typography, Empty, Select, Divider } from 'antd';
import { SearchOutlined, SendOutlined, PaperClipOutlined, SmileOutlined, PhoneOutlined, VideoCameraOutlined, MoreOutlined, WhatsAppOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';
import type { Chat, Message } from '@/types/chat';
import { AppButton, AppInput, AppCard, EmptyState } from '@/components/UI';

const { Content } = Layout;
const { Text } = Typography;

// 🔹 Мок-данные (сокращено)
const mockChats: Chat[] = [
  { id: '1', clientId: 'c1', clientName: 'ООО "Вектор Принт"', clientPhone: '+7 (999) 000-00-00', channel: 'whatsapp', isVip: true, isOnline: true, unreadCount: 3, lastMessage: 'Добрый день, какой статус по тиражу визиток?', lastMessageTime: '10:45', managerId: 'm1', managerName: 'Иванов И.И.' },
  { id: '2', clientId: 'c2', clientName: 'ИП Смирнов А.В.', clientPhone: '+7 (900) 123-45-67', channel: 'telegram', isVip: false, isOnline: false, unreadCount: 0, lastMessage: 'Спасибо, всё получил!', lastMessageTime: '09:30', managerId: 'm1', managerName: 'Иванов И.И.' },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', chatId: '1', text: 'Здравствуйте! Интересуют визитки 5000 шт.', direction: 'incoming', timestamp: '10:30', status: 'read' },
    { id: 'm2', chatId: '1', text: 'Добрый день! Да, конечно. Какой формат и материал?', direction: 'outgoing', timestamp: '10:32', status: 'read' },
  ],
};

const channelIcons: Record<string, React.ReactNode> = {
  whatsapp: <WhatsAppOutlined style={{ color: '#25D366' }} />,
  telegram: <MessageOutlined style={{ color: '#0088cc' }} />,
  email: <MailOutlined style={{ color: '#EA4335' }} />,
  phone: <PhoneOutlined style={{ color: '#1677ff' }} />,
};

function Chats() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');

  const selectedChat = mockChats.find(c => c.id === selectedChatId);
  const messages = selectedChatId ? (mockMessages[selectedChatId] || []) : [];

  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = chat.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = channelFilter === 'all' || chat.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  return (
    <Layout style={{ background: 'transparent', minHeight: 'calc(100vh - 136px)' }}>
      <Content style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 200px)' }}>
        {/* Список чатов */}
        <div style={{ width: '400px', background: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <AppInput placeholder="Поиск по клиентам..." prefix={<SearchOutlined />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} allowClear fullWidth />
              <Select value={channelFilter} onChange={setChannelFilter} style={{ width: '100%' }} options={[
                { value: 'all', label: 'Все каналы' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'telegram', label: 'Telegram' },
                { value: 'email', label: 'Email' },
              ]} />
            </Space>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <List dataSource={filteredChats} renderItem={(chat) => (
              <List.Item onClick={() => setSelectedChatId(chat.id)} style={{ padding: '12px 16px', cursor: 'pointer', background: selectedChatId === chat.id ? '#e6f4ff' : 'transparent', borderBottom: '1px solid #f0f0f0' }}>
                <List.Item.Meta
                  avatar={<Badge count={chat.unreadCount} offset={[-5, 5]} size="small"><Avatar style={{ backgroundColor: chat.isVip ? '#ff4d4f' : '#0052cc' }}>{chat.clientName.charAt(0)}</Avatar></Badge>}
                  title={<Space><Text strong>{chat.clientName}</Text>{chat.isVip && <Tag color="red" style={{ fontSize: '10px' }}>VIP</Tag>}{channelIcons[chat.channel]}</Space>}
                  description={<div style={{ maxWidth: '250px' }}><Text type="secondary" ellipsis style={{ fontSize: '12px' }}>{chat.lastMessage}</Text><div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{chat.lastMessageTime} • {chat.managerName}</div></div>}
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
                  <Avatar style={{ backgroundColor: selectedChat.isVip ? '#ff4d4f' : '#0052cc' }}>{selectedChat.clientName.charAt(0)}</Avatar>
                  <div>
                    <div style={{ fontWeight: 600 }}>{selectedChat.clientName}{selectedChat.isVip && <Tag color="red" style={{ marginLeft: '8px' }}>VIP</Tag>}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{selectedChat.clientPhone} • {selectedChat.channel}{selectedChat.isOnline && <span style={{ color: '#52c41a', marginLeft: '8px' }}>● Онлайн</span>}</Text>
                  </div>
                </Space>
                <Space>
                  <Button icon={<PhoneOutlined />} /><Button icon={<VideoCameraOutlined />} /><Button icon={<MoreOutlined />} />
                </Space>
              </div>

              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f5f5f5' }}>
                {messages.map((message) => (
                  <div key={message.id} style={{ display: 'flex', justifyContent: message.direction === 'outgoing' ? 'flex-end' : 'flex-start', marginBottom: '16px' }}>
                    <div style={{ maxWidth: '60%', padding: '12px 16px', borderRadius: '12px', background: message.direction === 'outgoing' ? '#0052cc' : '#fff', color: message.direction === 'outgoing' ? '#fff' : '#333', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                      <div style={{ marginBottom: '4px' }}>{message.text}</div>
                      <div style={{ fontSize: '11px', opacity: 0.7, textAlign: 'right' }}>{message.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Divider style={{ margin: 0 }} />
              <div style={{ padding: '16px' }}>
                <Input.TextArea value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Введите сообщение..." autoSize={{ minRows: 2, maxRows: 4 }} style={{ marginBottom: '12px' }} />
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Space><Button icon={<PaperClipOutlined />} /><Button icon={<SmileOutlined />} /></Space>
                  <AppButton icon={<SendOutlined />} disabled={!messageText.trim()}>Отправить</AppButton>
                </Space>
              </div>
            </>
          ) : (
            <EmptyState title="Чат не выбран" description="Выберите чат из списка слева для начала переписки" />
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default Chats;