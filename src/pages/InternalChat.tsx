// src/pages/InternalChat.tsx
import { useState } from 'react';
import { Layout, List, Avatar, Badge, Input, Button, Tag, Space, Typography, Divider, Card } from 'antd';
import { SearchOutlined, SendOutlined, PaperClipOutlined, TeamOutlined, CalculatorOutlined, CarOutlined, ToolOutlined } from '@ant-design/icons';
import { AppButton, AppInput } from '@/components/UI';
import { useInternalChatStore } from '@/store/useInternalChatStore';
import type { InternalMessage } from '@/types/chat';

// В хуке:

const { Content } = Layout;
const { Text } = Typography;

const internalChats = [
  {
    id: 'economist',
    department: 'economist',
    departmentName: 'Экономисты',
    icon: <CalculatorOutlined />,
    members: 5
  },
  {
    id: 'logistics',
    department: 'logistics',
    departmentName: 'Логистика',
    icon: <CarOutlined />,
    members: 3
  },
  {
    id: 'production',
    department: 'production',
    departmentName: 'Производство',
    icon: <ToolOutlined />,
    members: 8
  },
  {
    id: 'all',
    department: 'all',
    departmentName: 'Общий чат',
    icon: <TeamOutlined />,
    members: 24
  },
];

const departmentColors: Record<string, string> = {
  economist: 'blue',
  logistics: 'green',
  production: 'orange',
  all: 'purple',
  manager: 'default'
};

function InternalChat() {
  const [selectedChatId, setSelectedChatId] = useState<string>('economist');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { messages: internalMessages, addMessage } = useInternalChatStore<InternalMessage>();


  const selectedChat = internalChats.find(c => c.id === selectedChatId);
  const chatMessages = internalMessages[selectedChatId] || [];


  const filteredChats = internalChats.filter(chat =>
    chat.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChatId) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      department: selectedChatId as any,
      author: 'Менеджер',
      authorAvatar: 'М',
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    addMessage(selectedChatId, newMessage);
    setMessageText('');
  };

  return (
    <Layout style={{ background: 'transparent', minHeight: 'calc(100vh - 136px)' }}>
      <Content style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 200px)' }}>
        {/* 🔹 Левая панель: Список отделов */}
        <div style={{
          width: '350px',
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              <TeamOutlined style={{ marginRight: '8px' }} />
              Технический чат
            </Typography.Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Внутренняя коммуникация между отделами
            </Text>
          </div>

          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <AppInput
              placeholder="Поиск по отделам..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              size="small"
              fullWidth
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <List
              dataSource={filteredChats}
              renderItem={(chat) => {
                const chatMessagesCount = (internalMessages[chat.id] || []).length;
                return (
                  <List.Item
                    onClick={() => setSelectedChatId(chat.id)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      background: selectedChatId === chat.id ? '#e6f4ff' : 'transparent',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#f0f2f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          color: '#0052cc'
                        }}>
                          {chat.icon}
                        </div>
                      }
                      title={
                        <Space>
                          <Text strong>{chat.departmentName}</Text>
                          <Tag color={departmentColors[chat.department]} style={{ fontSize: '12px' }}>
                            {chat.members}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <Text type="secondary" ellipsis style={{ fontSize: '12px' }}>
                            {chatMessagesCount > 0 && chatMessages[chatMessagesCount - 1]?.text
                              ? chatMessages[chatMessagesCount - 1].text
                              : 'Нет сообщений'}
                          </Text>
                          <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                            {chatMessagesCount} сообщений
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </div>
        </div>

        {/* 🔹 Правая панель: Окно чата */}
        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {selectedChat ? (
            <>
              {/* Хедер чата */}
              <div style={{
                padding: '16px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Space>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#f0f2f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#0052cc'
                  }}>
                    {selectedChat.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {selectedChat.departmentName}
                      <Tag
                        color={departmentColors[selectedChat.department]}
                        style={{ marginLeft: '8px', fontSize: '12px' }}
                      >
                        {selectedChat.members} участников
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Внутренний чат для координации
                    </Text>
                  </div>
                </Space>
              </div>

              {/* Сообщения */}
              <div style={{
                flex: 1,
                padding: '24px',
                overflowY: 'auto',
                background: '#fafafa',
              }}>
                {chatMessages.length > 0 ? (
                  chatMessages.map((message) => (
                    <div key={message.id} style={{ marginBottom: '16px' }}>
                      <Space align="start">
                        <Avatar style={{ backgroundColor: '#0052cc' }}>
                          {message.authorAvatar}
                        </Avatar>
                        <div>
                          <div style={{ marginBottom: '4px' }}>
                            <Text strong style={{ marginRight: '8px' }}>
                              {message.author}
                            </Text>
                            <Tag color={departmentColors[message.department]} size="small">
                              {message.department}
                            </Tag>
                            {message.isForwarded && (
                              <Tag color="orange" size="small">
                                ↪ Переслано
                              </Tag>
                            )}
                            <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Text>
                          </div>
                          <Card
                            size="small"
                            style={{
                              maxWidth: '70%',
                              background: message.isForwarded ? '#fffbe6' : '#fff',
                              border: message.isForwarded ? '1px solid #ffe58f' : '1px solid #f0f0f0',
                            }}
                          >
                            <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>
                            {message.forwardedFrom && (
                              <div style={{
                                marginTop: '8px',
                                paddingTop: '8px',
                                borderTop: '1px solid #f0f0f0',
                                fontSize: '12px',
                                color: '#666'
                              }}>
                                От: {message.forwardedFrom.clientName}
                              </div>
                            )}
                          </Card>
                        </div>
                      </Space>
                    </div>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '48px',
                    color: '#999'
                  }}>
                    <p>Нет сообщений</p>
                    <p style={{ fontSize: '14px' }}>
                      Перешлите сообщение из чата с клиентом
                    </p>
                  </div>
                )}
              </div>

              {/* Ввод сообщения */}
              <Divider style={{ margin: 0 }} />
              <div style={{ padding: '16px' }}>
                <Input.TextArea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Напишите сообщение..."
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={{ marginBottom: '12px' }}
                />
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Space>
                    <Button icon={<PaperClipOutlined />} />
                  </Space>
                  <AppButton
                    icon={<SendOutlined />}
                    disabled={!messageText.trim()}
                    onClick={handleSendMessage}
                  >
                    Отправить
                  </AppButton>
                </Space>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h3>Выберите отдел для начала общения</h3>
              </div>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default InternalChat;