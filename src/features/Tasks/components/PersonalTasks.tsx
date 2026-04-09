// src/features/Tasks/components/PersonalTasks.tsx
import { Card, List, Tag, Space, Typography, Progress, Badge } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  StarOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined,
  SolutionOutlined,
  RocketOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueTime: string;
  category: 'call' | 'email' | 'document' | 'meeting' | 'other';
  clientId?: string;
  clientName?: string;
}

// 🔹 Моковые данные для презентации (будут заменены на ИИ)
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Позвонить клиенту ООО "Вектор Принт"',
    description: 'Уточнить детали по тиражу визиток (5000 шт., формат 90x50мм)',
    priority: 'high',
    status: 'pending',
    dueTime: '10:00',
    category: 'call',
    clientId: 'c1',
    clientName: 'ООО "Вектор Принт"',
  },
  {
    id: '2',
    title: 'Отправить коммерческое предложение',
    description: 'Отправить КП по печати буклетов для ИП Смирнов А.В.',
    priority: 'medium',
    status: 'in-progress',
    dueTime: '12:30',
    category: 'email',
    clientId: 'c2',
    clientName: 'ИП Смирнов А.В.',
  },
  {
    id: '3',
    title: 'Подготовить макет этикеток',
    description: 'Согласовать дизайн этикеток для бутылок воды (100 шт.)',
    priority: 'high',
    status: 'pending',
    dueTime: '14:00',
    category: 'document',
    clientId: 'c3',
    clientName: 'ООО "Чистая Вода"',
  },
  {
    id: '4',
    title: 'Встреча с новым клиентом',
    description: 'Презентация услуг полиграфии для типографии "ПринтМастер"',
    priority: 'high',
    status: 'completed',
    dueTime: '15:30',
    category: 'meeting',
  },
  {
    id: '5',
    title: 'Проверить статус заказа №1234',
    description: 'Уточнить у производства готовность тиража листовок',
    priority: 'low',
    status: 'pending',
    dueTime: '16:00',
    category: 'other',
  },
];

const priorityConfig = {
  high: { color: 'red', icon: <StarOutlined />, label: 'Высокий' },
  medium: { color: 'orange', icon: <ClockCircleOutlined />, label: 'Средний' },
  low: { color: 'blue', icon: <ClockCircleOutlined />, label: 'Низкий' },
};

const statusConfig = {
  pending: { color: 'default', icon: <ClockCircleOutlined />, label: 'Ожидает' },
  'in-progress': { color: 'processing', icon: <SyncOutlined spin />, label: 'В работе' },
  completed: { color: 'success', icon: <CheckCircleOutlined />, label: 'Выполнено' },
  overdue: { color: 'error', icon: <CloseCircleOutlined />, label: 'Просрочено' },
};

const categoryIcons = {
  call: <PhoneOutlined />,
  email: <MailOutlined />,
  document: <FileTextOutlined />,
  meeting: <SolutionOutlined />,
  other: <RocketOutlined />,
};

export const PersonalTasks: React.FC = () => {
  const completedTasks = mockTasks.filter((t) => t.status === 'completed').length;
  const totalTasks = mockTasks.length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const today = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card
      title={
        <Space>
          <CalendarOutlined style={{ color: '#0052cc' }} />
          <div>
            <div>Персональные задачи</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {today}
            </Text>
          </div>
        </Space>
      }
      extra={
        <Badge count={mockTasks.filter((t) => t.status !== 'completed').length} offset={[-5, 5]}>
          <Text type="secondary">Активных</Text>
        </Badge>
      }
    >
      {/* Прогресс выполнения */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Выполнено: {completedTasks}/{totalTasks}
          </Text>
          <Text strong style={{ fontSize: '12px' }}>
            {progressPercent}%
          </Text>
        </div>
        <Progress
          percent={progressPercent}
          size="small"
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          showInfo={false}
        />
      </div>

      {/* Список задач */}
      <List
        dataSource={mockTasks}
        size="small"
        renderItem={(task) => (
          <List.Item
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #f0f0f0',
              opacity: task.status === 'completed' ? 0.6 : 1,
            }}
          >
            <List.Item.Meta
              avatar={
                <Badge status={task.status === 'completed' ? 'success' : 'processing'}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      background: task.status === 'completed' ? '#f6ffed' : '#e6f4ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      color: task.status === 'completed' ? '#52c41a' : '#0052cc',
                    }}
                  >
                    {categoryIcons[task.category]}
                  </div>
                </Badge>
              }
              title={
                <Space direction="vertical" size={0}>
                  <Space>
                    <Text strong style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                      {task.title}
                    </Text>
                    <Tag color={priorityConfig[task.priority].color} style={{ fontSize: '10px' }}>
                      {priorityConfig[task.priority].label}
                    </Tag>
                    <Tag
                      icon={statusConfig[task.status].icon}
                      color={statusConfig[task.status].color}
                      style={{ fontSize: '10px' }}
                    >
                      {statusConfig[task.status].label}
                    </Tag>
                  </Space>
                </Space>
              }
              description={
                <div>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                    {task.description}
                  </Text>
                  <Space size="large" style={{ marginTop: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      <ClockCircleOutlined style={{ marginRight: '4px' }} />
                      {task.dueTime}
                    </Text>
                    {task.clientName && (
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        <SolutionOutlined style={{ marginRight: '4px' }} />
                        {task.clientName}
                      </Text>
                    )}
                  </Space>
                </div>
              }
            />
          </List.Item>
        )}
      />

      {/* Футер с подсказкой */}
      <div style={{ marginTop: '16px', padding: '12px', background: '#fafafa', borderRadius: '8px' }}>
        <Text type="secondary" style={{ fontSize: '11px' }}>
          💡 Задачи генерируются ИИ на основе активности в CRM и приоритетов
        </Text>
      </div>
    </Card>
  );
};