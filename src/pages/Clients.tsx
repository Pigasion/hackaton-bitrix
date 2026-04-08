// src/pages/Clients.tsx
import { useState } from 'react';
import {
  Table, Input, Button, Select, Tag, Avatar, Popconfirm, Modal, Form,
  DatePicker, Typography, Row, Col, Statistic, Tooltip, Dropdown, Space,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, FilterOutlined, ExportOutlined,
  PhoneOutlined, MessageOutlined, MailOutlined, MoreOutlined,
  UserOutlined, StarOutlined, DeleteOutlined, EditOutlined,
  EyeOutlined, TeamOutlined,
} from '@ant-design/icons';
import type { Client, ClientType, ClientStatus } from '@/types/client';
import { AppButton, AppInput, StatusBadge, AppCard, PageHeader, EmptyState } from '@/components/UI';

const { Text } = Typography;
const { RangePicker } = DatePicker;

// 🔹 Мок-данные (без изменений)
const mockClients: Client[] = [
  {
    id: '1', name: 'Иванов Иван Иванович', company: 'ООО "Вектор Принт"',
    email: 'ivanov@vectorprint.ru', phone: '+7 (999) 000-00-00',
    status: 'active', type: 'vip', managerId: 'm1', managerName: 'Иванов И.И.',
    createdAt: '2025-01-15', lastContact: '2026-04-08', totalOrders: 24, totalRevenue: 1250000,
    tags: ['Полиграфия', 'B2B', 'Постоянный'],
  },
  // ... остальные клиенты (сокращено для brevity)
];

const statusConfig: Record<ClientStatus, { color: string; text: string }> = {
  active: { color: 'green', text: 'Активен' },
  inactive: { color: 'orange', text: 'Не активен' },
  blocked: { color: 'red', text: 'Заблокирован' },
  prospect: { color: 'blue', text: 'Потенциальный' },
};

const typeConfig: Record<ClientType, { color: string; text: string; icon: React.ReactNode }> = {
  vip: { color: 'red', text: 'VIP', icon: <StarOutlined /> },
  regular: { color: 'default', text: 'Обычный', icon: <UserOutlined /> },
  partner: { color: 'purple', text: 'Партнёр', icon: <TeamOutlined /> },
};

function Clients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ClientType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || client.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalClients = mockClients.length;
  const vipClients = mockClients.filter((c) => c.type === 'vip').length;
  const activeClients = mockClients.filter((c) => c.status === 'active').length;
  const totalRevenue = mockClients.reduce((sum, c) => sum + c.totalRevenue, 0);

  const columns = [
    {
      title: 'Клиент', dataIndex: 'name', key: 'name', width: 250,
      render: (_: string, record: Client) => (
        <Space>
          <Avatar style={{ backgroundColor: record.type === 'vip' ? '#ff4d4f' : '#0052cc' }}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.company}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Контакты', key: 'contacts', width: 200,
      render: (_: unknown, record: Client) => (
        <Space direction="vertical" size={0}>
          <Text>{record.phone}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
        </Space>
      ),
    },
    {
      title: 'Тип', dataIndex: 'type', key: 'type', width: 100,
      render: (type: ClientType) => {
        const config = typeConfig[type];
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
      },
    },
    {
      title: 'Статус', dataIndex: 'status', key: 'status', width: 100,
      render: (status: ClientStatus) => <StatusBadge status={status} showIcon={false} />,
    },
    { title: 'Менеджер', dataIndex: 'managerName', key: 'managerName', width: 150 },
    {
      title: 'Заказы', dataIndex: 'totalOrders', key: 'totalOrders', width: 80,
      sorter: (a: Client, b: Client) => a.totalOrders - b.totalOrders,
    },
    {
      title: 'Выручка', dataIndex: 'totalRevenue', key: 'totalRevenue', width: 120,
      render: (revenue: number) => <Text strong>{revenue.toLocaleString('ru-RU')} ₽</Text>,
      sorter: (a: Client, b: Client) => a.totalRevenue - b.totalRevenue,
    },
    { title: 'Последний контакт', dataIndex: 'lastContact', key: 'lastContact', width: 120 },
    {
      title: 'Действия', key: 'actions', width: 120,
      render: (_: unknown, record: Client) => (
        <Space size="small">
          <Tooltip title="Позвонить"><Button type="text" icon={<PhoneOutlined />} size="small" /></Tooltip>
          <Tooltip title="Написать"><Button type="text" icon={<MessageOutlined />} size="small" /></Tooltip>
          <Dropdown menu={{ items: [
              { key: 'view', label: 'Просмотр', icon: <EyeOutlined /> },
              { key: 'edit', label: 'Редактировать', icon: <EditOutlined /> },
              { key: 'delete', label: 'Удалить', icon: <DeleteOutlined />, danger: true },
            ]}} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="👥 Клиенты"
        description="Управление базой клиентов и контрагентов"
      />

      {/* Метрики */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <AppCard variant="metric">
            <Statistic title="Всего клиентов" value={totalClients} prefix={<UserOutlined />} valueStyle={{ color: '#0052cc' }} />
          </AppCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AppCard variant="metric">
            <Statistic title="VIP клиенты" value={vipClients} prefix={<StarOutlined />} valueStyle={{ color: '#ff4d4f' }} />
          </AppCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AppCard variant="metric">
            <Statistic title="Активные" value={activeClients} prefix={<TeamOutlined />} valueStyle={{ color: '#52c41a' }} />
          </AppCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AppCard variant="metric">
            <Statistic title="Общая выручка" value={totalRevenue} prefix="₽" precision={0} valueStyle={{ color: '#722ed1' }} />
          </AppCard>
        </Col>
      </Row>

      {/* Фильтры */}
      <AppCard style={{ marginBottom: '16px' }}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <AppInput
              placeholder="Поиск по имени, компании..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              fullWidth={false}
            />
            <Select placeholder="Тип клиента" style={{ width: 150 }} value={typeFilter} onChange={setTypeFilter} allowClear
                    options={[{ value: 'vip', label: 'VIP' }, { value: 'regular', label: 'Обычный' }, { value: 'partner', label: 'Партнёр' }]} />
            <Select placeholder="Статус" style={{ width: 150 }} value={statusFilter} onChange={setStatusFilter} allowClear
                    options={[{ value: 'active', label: 'Активен' }, { value: 'inactive', label: 'Не активен' }, { value: 'blocked', label: 'Заблокирован' }]} />
          </Space>
          <Space>
            <AppButton variant="default" icon={<FilterOutlined />}>Фильтры</AppButton>
            <AppButton variant="default" icon={<ExportOutlined />}>Экспорт</AppButton>
            <AppButton icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Добавить клиента</AppButton>
          </Space>
        </Space>
      </AppCard>

      {/* Таблица */}
      <AppCard>
        {filteredClients.length > 0 ? (
          <Table columns={columns} dataSource={filteredClients} rowKey="id" pagination={{ pageSize: 10, showTotal: (total) => `Всего ${total} клиентов` }} rowSelection={{ type: 'checkbox' }} scroll={{ x: 1200 }} />
        ) : (
          <EmptyState title="Клиенты не найдены" description="Измените параметры поиска или добавьте нового клиента"
                      action={<AppButton icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Добавить клиента</AppButton>} />
        )}
      </AppCard>

      {/* Модалка */}
      <Modal title="Добавление нового клиента" open={isModalVisible} onCancel={() => setIsModalVisible(false)}
             footer={[<Button key="cancel" onClick={() => setIsModalVisible(false)}>Отмена</Button>, <Button key="submit" type="primary">Сохранить</Button>]} width={700}>
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}><Form.Item label="ФИО" name="name" rules={[{ required: true, message: 'Введите ФИО' }]}><Input placeholder="Иванов Иван Иванович" /></Form.Item></Col>
            <Col span={12}><Form.Item label="Компания" name="company" rules={[{ required: true, message: 'Введите компанию' }]}><Input placeholder='ООО "Пример"' /></Form.Item></Col>
            <Col span={12}><Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}><Input placeholder="email@example.ru" /></Form.Item></Col>
            <Col span={12}><Form.Item label="Телефон" name="phone" rules={[{ required: true, message: 'Введите телефон' }]}><Input placeholder="+7 (999) 000-00-00" /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default Clients;