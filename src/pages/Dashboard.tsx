// src/pages/Dashboard.tsx
import { Row, Col, Statistic, Card, List, Tag, Progress, Space, Typography, Avatar, Badge } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  CalendarOutlined,
  MailOutlined,
  SolutionOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { AppCard, PageHeader } from '@/components/UI';
import { useManagerStore } from '@/store/useManagerStore';

const { Text, Title } = Typography;

// 🔹 Моковые данные задач для презентации (будут заменены на ИИ)
const mockTasks = [
  {
    id: '1',
    title: 'Позвонить клиенту ООО "Вектор Принт"',
    description: 'Уточнить детали по тиражу визиток (5000 шт., формат 90x50мм)',
    priority: 'high' as const,
    status: 'pending' as const,
    dueTime: '10:00',
    category: 'call' as const,
    clientId: 'c1',
    clientName: 'ООО "Вектор Принт"',
  },
  {
    id: '2',
    title: 'Отправить коммерческое предложение',
    description: 'Отправить КП по печати буклетов для ИП Смирнов А.В.',
    priority: 'medium' as const,
    status: 'in-progress' as const,
    dueTime: '12:30',
    category: 'email' as const,
    clientId: 'c2',
    clientName: 'ИП Смирнов А.В.',
  },
  {
    id: '3',
    title: 'Подготовить макет этикеток',
    description: 'Согласовать дизайн этикеток для бутылок воды (100 шт.)',
    priority: 'high' as const,
    status: 'pending' as const,
    dueTime: '14:00',
    category: 'document' as const,
    clientId: 'c3',
    clientName: 'ООО "Чистая Вода"',
  },
  {
    id: '4',
    title: 'Встреча с новым клиентом',
    description: 'Презентация услуг полиграфии для типографии "ПринтМастер"',
    priority: 'high' as const,
    status: 'completed' as const,
    dueTime: '15:30',
    category: 'meeting' as const,
  },
  {
    id: '5',
    title: 'Проверить статус заказа №1234',
    description: 'Уточнить у производства готовность тиража листовок',
    priority: 'low' as const,
    status: 'pending' as const,
    dueTime: '16:00',
    category: 'other' as const,
  },
];

const priorityConfig = {
  high: { color: 'red', icon: <StarOutlined />, label: 'Высокий' },
  medium: { color: 'orange', icon: <ClockCircleOutlined />, label: 'Средний' },
  low: { color: 'blue', icon: <ClockCircleOutlined />, label: 'Низкий' },
};

const statusConfig = {
  pending: { color: 'default', icon: <ClockCircleOutlined />, label: 'Ожидает' },
  'in-progress': { color: 'processing', icon: <ClockCircleOutlined spin />, label: 'В работе' },
  completed: { color: 'success', icon: <CheckCircleOutlined />, label: 'Выполнено' },
  overdue: { color: 'error', icon: <ClockCircleOutlined />, label: 'Просрочено' },
};

const categoryIcons = {
  call: <PhoneOutlined />,
  email: <MailOutlined />,
  document: <FileTextOutlined />,
  meeting: <SolutionOutlined />,
  other: <RocketOutlined />,
};

function Dashboard() {
  const { stats } = useManagerStore();
  const completedTasks = mockTasks.filter((t) => t.status === 'completed').length;
  const totalTasks = mockTasks.length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const today = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader title="📊 Дашборд" />

      {/* 🔹 Статистика */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <AppCard>
            <Statistic
              title="Активные чаты"
              value={12}
              prefix={<TeamOutlined style={{ color: '#0052cc' }} />}
              valueStyle={{ color: '#0052cc' }}
            />
          </AppCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AppCard>
            <Statistic
              title="Новые клиенты"
              value={5}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </AppCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AppCard>
            <Statistic
              title="Заказов сегодня"
              value={8}
              prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </AppCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AppCard>
            <Statistic
              title="Выполнено задач"
              value={15}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </AppCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 🔹 Персональные задачи */}
        <Col xs={24} lg={12}>
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
              <Badge count={mockTasks.filter((t) => t.status !== 'completed').length} offset={[-5, 5]}
                     offset={[10, -2]}  // ← Добавь этот offset
                     style={{ marginRight: '12px' }}  // ← И этот отступ
              >
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
                          <Text
                            strong
                            style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}
                          >
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
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                background: '#fafafa',
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
              }}
            >
              <Text type="secondary" style={{ fontSize: '11px' }}>
                💡 Задачи генерируются ИИ на основе активности в CRM и приоритетов
              </Text>
            </div>
          </Card>
        </Col>

        {/* 🔹 Другие виджеты (можно добавить позже) */}
        <Col xs={24} lg={12}>
          <Card title="📈 Активность за неделю">
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <Title level={4} style={{ marginBottom: '8px' }}>
                Скоро здесь будет статистика
              </Title>
              <Text type="secondary">Графики и аналитика будут добавлены позже</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;