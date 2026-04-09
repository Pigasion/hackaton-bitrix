// src/pages/Chats.tsx
import { useState, useEffect } from 'react';
import {
  Layout as AntLayout,
  List,
  Avatar,
  Badge,
  Input,
  Button,
  Tag,
  Space,
  Typography,
  Dropdown,
  MenuProps,
  Divider,
  Modal,
  Select,
  Form,
} from 'antd';
import {
  SearchOutlined,
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  MoreOutlined,
  WhatsAppOutlined,
  MailOutlined,
  MessageOutlined,
  ForwardOutlined,
  CopyOutlined,
  CalculatorOutlined,
  CarOutlined,
  ToolOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { AppButton, AppInput } from '@/components/UI';
import { useInternalChatStore } from '@/store/useInternalChatStore';

const { Content } = AntLayout;
const { Text } = Typography;

// Моковые данные чатов
const mockChats = [
  {
    id: '1',
    clientName: 'ООО "Вектор Принт"',
    channel: 'whatsapp' as const,
    isVip: true,
    unreadCount: 3,
    lastMessage: 'Добрый день, какой статус по тиражу визиток?',
    lastMessageTime: '10:45',
    managerName: 'Иванов И.И.',
  },
  {
    id: '2',
    clientName: 'ИП Смирнов А.В.',
    channel: 'telegram' as const,
    isVip: false,
    unreadCount: 0,
    lastMessage: 'Спасибо, всё получил!',
    lastMessageTime: '09:30',
    managerName: 'Иванов И.И.',
  },
];

// Моковые данные сообщений
const mockMessagesData: Record<string, any[]> = {
  '1': [
    {
      id: 'm1',
      chatId: '1',
      text: 'Здравствуйте! Интересуют визитки 5000 шт.',
      direction: 'incoming' as const,
      timestamp: '2026-04-09T10:30:00',
      status: 'read' as const,
    },
    {
      id: 'm2',
      chatId: '1',
      text: 'Добрый день! Да, конечно. Какой формат и материал?',
      direction: 'outgoing' as const,
      timestamp: '2026-04-09T10:32:00',
      status: 'read' as const,
    },
    {
      id: 'm3',
      chatId: '1',
      text: 'Добрый день, какой статус по тиражу визиток?',
      direction: 'incoming' as const,
      timestamp: '2026-04-09T10:45:00',
      status: 'read' as const,
    },
  ],
  '2': [],
};

const channelIcons: Record<string, React.ReactNode> = {
  whatsapp: <WhatsAppOutlined style={{ color: '#25D366' }} />,
  telegram: <MessageOutlined style={{ color: '#0088cc' }} />,
  email: <MailOutlined style={{ color: '#EA4335' }} />,
};

const departments = [
  { value: 'economist', label: 'Экономисты', icon: <CalculatorOutlined /> },
  { value: 'logistics', label: 'Логистика', icon: <CarOutlined /> },
  { value: 'production', label: 'Производство', icon: <ToolOutlined /> },
  { value: 'all', label: 'Общий чат', icon: <TeamOutlined /> },
];

function Chats() {
  const { addMessage: addInternalMessage } = useInternalChatStore();
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(mockMessagesData);

  // Модалка пересылки
  const [forwardModalVisible, setForwardModalVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [selectedMessageChatId, setSelectedMessageChatId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const filteredChats = mockChats.filter(chat =>
    chat.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChat = mockChats.find(c => c.id === selectedChatId);
  const currentMessages = selectedChatId ? (messages[selectedChatId] || []) : [];

  // Обработчик пересылки сообщения
  const handleForwardMessage = async (values: any) => {
    if (!selectedMessageId || !selectedMessageChatId) return;

    const sourceMessages = messages[selectedMessageChatId];
    const originalMessage = sourceMessages?.find(m => m.id === selectedMessageId);

    if (!originalMessage) return;

    // Создаём сообщение для технического чата
    const internalMessage = {
      id: `internal_${Date.now()}`,
      department: values.department as string,
      author: 'Менеджер',
      authorAvatar: 'М',
      text: values.comment
        ? `${values.comment}\n\n---\nПереслано от клиента:\n${originalMessage.text}`
        : `---\nПереслано от клиента:\n${originalMessage.text}`,
      timestamp: new Date().toISOString(),
      isForwarded: true,
      forwardedFrom: {
        clientId: selectedMessageChatId,
        clientName: selectedChat?.clientName || 'Клиент',
        originalMessageId: selectedMessageId,
      },
    };

    // Добавляем в технический чат
    addInternalMessage(values.department, internalMessage);

    // Закрываем модалку
    setForwardModalVisible(false);
    setSelectedMessageId(null);
    setSelectedMessageChatId(null);
    form.resetFields();

    // Показываем уведомление
    const dept = departments.find(d => d.value === values.department);
    alert(`Сообщение переслано в отдел: ${dept?.label}`);
  };

  // Меню для сообщения (ПКМ)
  const getMessageMenuItems = (messageId: string, chatId: string): MenuProps['items'] => [
    {
      key: 'forward',
      label: 'Переслать в тех. чат',
      icon: <ForwardOutlined />,
      onClick: () => {
        setSelectedMessageId(messageId);
        setSelectedMessageChatId(chatId);
        setForwardModalVisible(true);
      },
    },
    {
      key: 'copy',
      label: 'Копировать',
      icon: <CopyOutlined />,
      onClick: () => {
        const msg = messages[chatId]?.find(m => m.id === messageId);
        if (msg) {
          navigator.clipboard.writeText(msg.text);
        }
      },
    },
  ];

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChatId) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      chatId: selectedChatId,
      text: messageText,
      direction: 'outgoing' as const,
      timestamp: new Date().toISOString(),
      status: 'sent' as const,
    };

    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage],
    }));
    setMessageText('');
  };

  return (
    <AntLayout style={{ background: 'transparent', minHeight: 'calc(100vh - 136px)' }}>
      <Content style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 200px)' }}>

        {/* Левая панель: Список чатов */}
        <div style={{
          width: '400px',
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Поиск */}
          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <AppInput
              placeholder="Поиск по клиентам..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              fullWidth
            />
          </div>

          {/* Список чатов */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <List
              dataSource={filteredChats}
              renderItem={(chat) => (
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
                      <Badge count={chat.unreadCount} offset={[-5, 5]} size="small">
                        <Avatar style={{ backgroundColor: chat.isVip ? '#ff4d4f' : '#0052cc' }}>
                          {chat.clientName.charAt(0)}
                        </Avatar>
                      </Badge>
                    }
                    title={
                      <Space>
                        <Text strong>{chat.clientName}</Text>
                        {chat.isVip && <Tag color="red" style={{ fontSize: '10px' }}>VIP</Tag>}
                        {channelIcons[chat.channel]}
                      </Space>
                    }
                    description={
                      <div style={{ maxWidth: '250px' }}>
                        <Text type="secondary" ellipsis style={{ fontSize: '12px' }}>
                          {chat.lastMessage}
                        </Text>
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                          {chat.lastMessageTime} • {chat.managerName}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </div>

        {/* Правая панель: Окно чата */}
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
                  <Avatar style={{ backgroundColor: selectedChat.isVip ? '#ff4d4f' : '#0052cc' }}>
                    {selectedChat.clientName.charAt(0)}
                  </Avatar>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {selectedChat.clientName}
                      {selectedChat.isVip && <Tag color="red" style={{ marginLeft: '8px' }}>VIP</Tag>}
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {channelIcons[selectedChat.channel]} {selectedChat.clientName}
                    </Text>
                  </div>
                </Space>
                <Space>
                  <Button icon={<PhoneOutlined />} />
                  <Button icon={<VideoCameraOutlined />} />
                  <Button icon={<MoreOutlined />} />
                </Space>
              </div>

              {/* Сообщения */}
              <div style={{
                flex: 1,
                padding: '24px',
                overflowY: 'auto',
                background: '#f5f5f5',
              }}>
                {currentMessages.map((message) => (
                  <Dropdown
                    key={message.id}
                    menu={{ items: getMessageMenuItems(message.id, message.chatId) }}
                    trigger={['contextMenu']}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: message.direction === 'outgoing' ? 'flex-end' : 'flex-start',
                        marginBottom: '16px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '60%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: message.direction === 'outgoing' ? '#0052cc' : '#fff',
                          color: message.direction === 'outgoing' ? '#fff' : '#333',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      >
                        <div style={{ marginBottom: '4px' }}>{message.text}</div>
                        <div style={{ fontSize: '11px', opacity: 0.7, textAlign: 'right' }}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </Dropdown>
                ))}
              </div>

              {/* Ввод сообщения */}
              <Divider style={{ margin: 0 }} />
              <div style={{ padding: '16px' }}>
                <Input.TextArea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Введите сообщение..."
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={{ marginBottom: '12px' }}
                />
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Space>
                    <Button icon={<PaperClipOutlined />} />
                    <Button icon={<SmileOutlined />} />
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
              color: '#999',
            }}>
              <div style={{ textAlign: 'center' }}>
                <h3>Выберите чат для начала переписки</h3>
                <p>ПКМ на сообщении → "Переслать в тех. чат"</p>
              </div>
            </div>
          )}
        </div>
      </Content>

      {/* Модалка пересылки */}
      <Modal
        title={<Space><ForwardOutlined style={{ color: '#0052cc' }} /> Переслать сообщение</Space>}
        open={forwardModalVisible}
        onCancel={() => {
          setForwardModalVisible(false);
          setSelectedMessageId(null);
          setSelectedMessageChatId(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleForwardMessage}>
          <Form.Item
            label="Куда переслать"
            name="department"
            rules={[{ required: true, message: 'Выберите отдел' }]}
          >
            <Select
              placeholder="Выберите отдел"
              size="large"
              options={departments.map((dept) => ({
                value: dept.value,
                label: (
                  <Space>
                    {dept.icon}
                    {dept.label}
                  </Space>
                ),
              }))}
            />
          </Form.Item>

          <Form.Item label="Комментарий (необязательно)" name="comment">
            <Input.TextArea
              rows={3}
              placeholder="Добавьте комментарий для коллег..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setForwardModalVisible(false);
                setSelectedMessageId(null);
                setSelectedMessageChatId(null);
                form.resetFields();
              }}>
                Отмена
              </Button>
              <AppButton type="primary" htmlType="submit">
                Переслать
              </AppButton>
            </Space>
          </Form.Item>
        </Form>

        <div style={{ marginTop: '16px', padding: '12px', background: '#f0f8ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ℹ️ Сообщение будет отправлено в выбранный технический чат с пометкой о пересылке
          </Text>
        </div>
      </Modal>
    </AntLayout>
  );
}

export default Chats;