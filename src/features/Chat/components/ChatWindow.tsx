// src/features/Chat/components/ChatWindow.tsx
import { useState } from 'react';
import { Layout, Avatar, Badge, Input, Button, Tag, Space, Typography, Divider, Card, Dropdown, MenuProps } from 'antd';
import {
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  MoreOutlined,
  ForwardOutlined,
} from '@ant-design/icons';
import { AppButton } from '@/components/UI';
import { ForwardMessageModal } from './ForwardMessageModal';

const { Content } = Layout;
const { Text } = Typography;

interface Message {
  id: string;
  chatId: string;
  text: string;
  direction: 'incoming' | 'outgoing';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatWindowProps {
  chatId: string;
  messages: Message[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, messages }) => {
  const [messageText, setMessageText] = useState('');
  const [forwardModalVisible, setForwardModalVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  // Моковые данные для отображения
  const chatData = {
    id: chatId,
    clientName: 'ООО "Вектор Принт"',
    isVip: true,
    isOnline: true,
    channel: 'whatsapp',
  };

  const handleForwardClick = (messageId: string) => {
    setSelectedMessageId(messageId);
    setForwardModalVisible(true);
  };

  const messageMenuItems: MenuProps['items'] = (messageId: string) => [
    {
      key: 'forward',
      label: 'Переслать в тех. чат',
      icon: <ForwardOutlined />,
      onClick: () => handleForwardClick(messageId),
    },
    {
      key: 'copy',
      label: 'Копировать',
      onClick: () => {
        const msg = messages.find(m => m.id === messageId);
        if (msg) navigator.clipboard.writeText(msg.text);
      },
    },
  ];

  return (
    <Layout style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Хедер чата */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Space>
          <Avatar style={{ backgroundColor: chatData.isVip ? '#ff4d4f' : '#0052cc' }}>
            {chatData.clientName.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {chatData.clientName}
              {chatData.isVip && <Tag color="red" style={{ marginLeft: '8px' }}>VIP</Tag>}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {chatData.isOnline && <span style={{ color: '#52c41a' }}>● Онлайн</span>}
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
      <Content style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        background: '#f5f5f5',
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.direction === 'outgoing' ? 'flex-end' : 'flex-start',
              marginBottom: '16px',
            }}
          >
            <Dropdown
              menu={{ items: messageMenuItems(message.id) }}
              trigger={['contextMenu']}
            >
              <Card
                size="small"
                style={{
                  maxWidth: '60%',
                  background: message.direction === 'outgoing' ? '#0052cc' : '#fff',
                  color: message.direction === 'outgoing' ? '#fff' : '#333',
                  border: '1px solid #f0f0f0',
                  cursor: 'pointer',
                }}
              >
                <div style={{ marginBottom: '4px' }}>{message.text}</div>
                <div style={{ fontSize: '11px', opacity: 0.7, textAlign: 'right' }}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </Card>
            </Dropdown>
          </div>
        ))}
      </Content>

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
            onClick={() => setMessageText('')}
          >
            Отправить
          </AppButton>
        </Space>
      </div>

      {/* Модалка пересылки */}
      {forwardModalVisible && selectedMessageId && (
        <ForwardMessageModal
          visible={forwardModalVisible}
          onClose={() => {
            setForwardModalVisible(false);
            setSelectedMessageId(null);
          }}
          messageId={selectedMessageId}
          chatId={chatId}
        />
      )}
    </Layout>
  );
};