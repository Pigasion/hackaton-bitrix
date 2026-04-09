// src/features/Chat/components/ChatList.tsx
import { List, Avatar, Badge, Typography, Tag, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { WhatsAppOutlined, MessageOutlined, MailOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Chat {
  id: string;
  clientName: string;
  channel: 'whatsapp' | 'telegram' | 'email';
  isVip: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  managerName: string;
}

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelect: (chatId: string) => void;
}

const channelIcons: Record<string, React.ReactNode> = {
  whatsapp: <WhatsAppOutlined style={{ color: '#25D366' }} />,
  telegram: <MessageOutlined style={{ color: '#0088cc' }} />,
  email: <MailOutlined style={{ color: '#EA4335' }} />,
};

export const ChatList: React.FC<ChatListProps> = ({
                                                    chats,
                                                    selectedChatId,
                                                    onSelect,
                                                  }) => {
  return (
    <div style={{ width: '400px', background: '#fff', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
      {/* Поиск */}
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <Input
          placeholder="Поиск по клиентам..."
          prefix={<SearchOutlined />}
          size="large"
        />
      </div>

      {/* Список чатов */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <List
          dataSource={chats}
          renderItem={(chat) => (
            <List.Item
              onClick={() => onSelect(chat.id)}
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
  );
};