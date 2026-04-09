// src/features/Chat/components/MessageItem.tsx
import { Avatar, Card, Space, Typography, Dropdown, MenuProps } from 'antd';
import { ForwardOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { Message } from '../types';
import { useForwardMessage } from '../hooks/useForwardMessage';

const { Text } = Typography;

interface MessageItemProps {
  message: Message;
  chatId: string;
  isOwn: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
                                                          message,
                                                          chatId,
                                                          isOwn,
                                                        }) => {
  const { openForwardModal } = useForwardMessage();

  const menuItems: MenuProps['items'] = [
    {
      key: 'forward',
      label: 'Переслать',
      icon: <ForwardOutlined />,
      onClick: () => openForwardModal(message.id, chatId),
    },
    {
      key: 'copy',
      label: 'Копировать',
      icon: <CopyOutlined />,
      onClick: () => navigator.clipboard.writeText(message.text),
    },
    {
      key: 'delete',
      label: 'Удалить',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
      }}
    >
      <Space align="start" direction={isOwn ? 'horizontal-reverse' : 'horizontal'}>
        {!isOwn && <Avatar style={{ backgroundColor: '#0052cc' }}>K</Avatar>}

        <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
          <Card
            size="small"
            style={{
              maxWidth: '70%',
              background: isOwn ? '#0052cc' : '#fff',
              color: isOwn ? '#fff' : '#333',
              border: '1px solid #f0f0f0',
            }}
          >
            {message.forwardedFrom && (
              <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>
                ↪ Переслано от {message.forwardedFrom.originalSender}
              </div>
            )}
            <div style={{ marginBottom: '4px' }}>{message.text}</div>
            <div
              style={{
                fontSize: '11px',
                opacity: 0.7,
                textAlign: 'right',
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </Card>
        </Dropdown>
      </Space>
    </div>
  );
};