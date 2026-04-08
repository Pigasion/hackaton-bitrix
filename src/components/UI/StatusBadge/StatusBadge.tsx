import { Tag, TagProps } from 'antd';

export type StatusType =
  | 'vip' | 'regular' | 'partner'
  | 'active' | 'inactive' | 'blocked' | 'prospect'
  | 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  size?: 'default' | 'small';
  showIcon?: boolean;
}

const statusConfig: Record<StatusType, { color: string; text: string; icon?: string }> = {
  // Типы клиентов
  vip: { color: 'red', text: 'VIP', icon: '⭐' },
  regular: { color: 'blue', text: 'Обычный' },
  partner: { color: 'purple', text: 'Партнёр' },
  // Статусы клиентов
  active: { color: 'green', text: 'Активен' },
  inactive: { color: 'orange', text: 'Не активен' },
  blocked: { color: 'red', text: 'Заблокирован' },
  prospect: { color: 'cyan', text: 'Потенциальный' },
  // Статусы заказов
  pending: { color: 'orange', text: 'Ожидает' },
  in_progress: { color: 'processing', text: 'В работе' },
  completed: { color: 'success', text: 'Готов' },
  cancelled: { color: 'default', text: 'Отменён' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
                                                          status,
                                                          text,
                                                          size = 'default',
                                                          showIcon = true
                                                        }) => {
  const config = statusConfig[status];

  return (
    <Tag color={config.color} size={size}>
      {showIcon && config.icon && <span style={{ marginRight: '4px' }}>{config.icon}</span>}
      {text || config.text}
    </Tag>
  );
};