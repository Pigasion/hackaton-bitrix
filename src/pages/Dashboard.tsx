// src/pages/Dashboard.tsx
import { Row, Col, Statistic, Table, List, Badge, Tag, Progress, Space, Typography } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { AppCard, PageHeader, StatusBadge } from '@/components/UI';

const { Text } = Typography;

// 🔹 Мок-данные
const metricsData = [
  { title: 'Активные клиенты', value: 124, icon: <TeamOutlined />, trend: '+12%', positive: true },
  { title: 'Заказы в работе', value: 37, icon: <FileTextOutlined />, trend: '+5%', positive: true },
  { title: 'Звонки сегодня', value: 89, icon: <PhoneOutlined />, trend: '-3%', positive: false },
  { title: 'Выполнено за неделю', value: 156, icon: <CheckCircleOutlined />, trend: '+18%', positive: true },
];

const recentOrders = [
  { key: '1', client: 'ООО "Вектор Принт"', order: 'Визитки 5000 шт.', status: 'in_progress', amount: '45 000 ₽', date: '2026-04-08' },
  { key: '2', client: 'ИП Смирнов А.В.', order: 'Буклеты А4 1000 шт.', status: 'pending', amount: '28 500 ₽', date: '2026-04-08' },
  { key: '3', client: 'АО "МегаСтрой"', order: 'Каталоги 5000 шт.', status: 'completed', amount: '125 000 ₽', date: '2026-04-07' },
  { key: '4', client: 'ООО "ПринтСервис"', order: 'Плакат А1 200 шт.', status: 'in_progress', amount: '18 000 ₽', date: '2026-04-07' },
];

const recentActivities = [
  { id: 1, type: 'call', text: 'Входящий звонок от ООО "Вектор Принт"', time: '10:45', vip: true },
  { id: 2, type: 'email', text: 'Новое ТЗ на почту от ИП Смирнов', time: '10:30', vip: false },
  { id: 3, type: 'chat', text: 'Сообщение в WhatsApp от АО "МегаСтрой"', time: '09:15', vip: true },
  { id: 4, type: 'task', text: 'Задача от экономиста: расчёт тиража', time: '09:00', vip: false },
];

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'orange', text: 'Ожидает' },
  in_progress: { color: 'blue', text: 'В работе' },
  completed: { color: 'green', text: 'Готов' },
};

const activityIcons: Record<string, React.ReactNode> = {
  call: <PhoneOutlined />,
  email: <FileTextOutlined />,
  chat: <TeamOutlined />,
  task: <ClockCircleOutlined />,
};

function Dashboard() {
  const orderColumns = [
    {
      title: 'Клиент',
      dataIndex: 'client',
      key: 'client',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    { title: 'Заказ', dataIndex: 'order', key: 'order' },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return <Badge color={color} text={text} />;
      },
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    { title: 'Дата', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div>
      <PageHeader
        title="📊 Дашборд"
        description="Обзор ключевых показателей и активности"
      />

      {/* Метрики */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {metricsData.map((metric, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <AppCard variant="metric">
              <Statistic
                title={metric.title}
                value={metric.value}
                prefix={metric.icon}
                valueStyle={{ color: '#0052cc' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: metric.positive ? '#52c41a' : '#ff4d4f' }}>
                {metric.positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                <span style={{ marginLeft: '4px' }}>{metric.trend} к прошлой неделе</span>
              </div>
            </AppCard>
          </Col>
        ))}
      </Row>

      {/* Основной контент */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <AppCard
            title="📦 Последние заказы"
            extra={<a href="/clients">Все заказы →</a>}
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
            />
          </AppCard>
        </Col>

        <Col xs={24} lg={8}>
          <AppCard title="🔔 Активности">
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge
                        count={item.vip ? 'VIP' : null}
                        size="small"
                        style={{ backgroundColor: '#ff4d4f' }}
                      >
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: '#f0f2f5',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '18px', color: '#0052cc'
                        }}>
                          {activityIcons[item.type]}
                        </div>
                      </Badge>
                    }
                    title={
                      <span>
                        {item.text}
                        {item.vip && <Tag color="red" style={{ marginLeft: '8px' }}>VIP</Tag>}
                      </span>
                    }
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </AppCard>

          <AppCard title="📈 План на месяц" style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Выполнено</span>
                <Text strong>78%</Text>
              </div>
              <Progress percent={78} strokeColor={{ '0%': '#0052cc', '100%': '#52c41a' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Осталось</span>
                <Text strong>420 000 ₽</Text>
              </div>
              <Progress percent={22} strokeColor="#ff9c6e" />
            </div>
          </AppCard>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;