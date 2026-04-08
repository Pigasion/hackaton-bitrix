// src/pages/Settings.tsx
import { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, Switch, Select, Avatar, Upload, Divider, Alert, Tabs, Tag, Space, Typography, List, Modal } from 'antd';
import { UserOutlined, BellOutlined, LinkOutlined, SafetyOutlined, UploadOutlined, WhatsAppOutlined, MailOutlined, PhoneOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { AppButton, AppInput, AppCard, PageHeader, StatusBadge } from '@/components/UI';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const profileData = { name: 'Иванов Иван Иванович', email: 'ivanov@polyrouter.ru', phone: '+7 (999) 000-00-00', position: 'Менеджер по продажам', department: 'Отдел B2B' };

const integrationsData = [
  { id: '1', name: 'Битрикс24', icon: <LinkOutlined />, connected: true, description: 'CRM-система', lastSync: '5 минут назад' },
  { id: '2', name: 'WhatsApp Business', icon: <WhatsAppOutlined />, connected: true, description: 'Приём сообщений', lastSync: '1 минуту назад' },
  { id: '3', name: 'Telegram', icon: <LinkOutlined />, connected: false, description: 'Приём сообщений', lastSync: 'Не подключено' },
  { id: '4', name: 'Телефония (SIP)', icon: <PhoneOutlined />, connected: true, description: 'Входящие звонки', lastSync: 'Активно' },
];

function Settings() {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { key: 'profile', label: <Space><UserOutlined />Профиль</Space> },
    { key: 'notifications', label: <Space><BellOutlined />Уведомления</Space> },
    { key: 'integrations', label: <Space><LinkOutlined />Интеграции</Space> },
    { key: 'security', label: <Space><SafetyOutlined />Безопасность</Space> },
  ];

  return (
    <div>
      <PageHeader title="⚙️ Настройки" description="Управление профилем, уведомлениями и интеграциями" />

      <AppCard>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs} type="card" />
        <Divider style={{ margin: '0 0 24px 0' }} />

        {activeTab === 'profile' && (
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={8}>
              <AppCard title="Фото профиля" style={{ textAlign: 'center' }}>
                <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: '#0052cc', marginBottom: '16px' }} />
                <Upload showUploadList={false}><AppButton variant="default" icon={<UploadOutlined />}>Загрузить фото</AppButton></Upload>
              </AppCard>
              <AppCard title="Информация" style={{ marginTop: '16px' }}>
                <List dataSource={[{ label: 'Должность', value: profileData.position }, { label: 'Отдел', value: profileData.department }, { label: 'Статус', value: <StatusBadge status="active" showIcon={false} /> }]} renderItem={(item) => (<List.Item><List.Item.Meta title={<Text type="secondary">{item.label}</Text>} description={item.value} /></List.Item>)} />
              </AppCard>
            </Col>
            <Col xs={24} lg={16}>
              <AppCard title="Личные данные">
                <Form form={form} layout="vertical" initialValues={profileData}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}><Form.Item label="ФИО" name="name" rules={[{ required: true, message: 'Введите ФИО' }]}><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Должность" name="position"><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Некорректный email' }]}><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Телефон" name="phone"><Input /></Form.Item></Col>
                  </Row>
                  <Form.Item><AppButton htmlType="submit">Сохранить изменения</AppButton></Form.Item>
                </Form>
              </AppCard>
            </Col>
          </Row>
        )}

        {activeTab === 'notifications' && (
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <AppCard title="📬 Каналы уведомлений">
                <Form.Item label="Email-уведомления"><Switch defaultChecked /></Form.Item>
                <Divider /><Form.Item label="Push-уведомления"><Switch defaultChecked /></Form.Item>
                <Divider /><Form.Item label="Звуковые уведомления"><Switch defaultChecked /></Form.Item>
                <Form.Item style={{ marginTop: '24px' }}><AppButton htmlType="submit">Сохранить</AppButton></Form.Item>
              </AppCard>
            </Col>
            <Col xs={24} lg={12}>
              <AppCard title="🔔 Типы событий">
                <List dataSource={[{ event: 'Входящий звонок', enabled: true }, { event: 'Новое сообщение', enabled: true }, { event: 'VIP-клиент пишет', enabled: true }]} renderItem={(item) => (<List.Item actions={[<Switch defaultChecked={item.enabled} size="small" />]}><List.Item.Meta title={item.event} description={item.enabled ? <Text type="success"><CheckCircleOutlined /> Включено</Text> : <Text type="secondary"><ExclamationCircleOutlined /> Отключено</Text>} /></List.Item>)} />
              </AppCard>
            </Col>
          </Row>
        )}

        {activeTab === 'integrations' && (
          <div>
            <Alert message="Интеграции с внешними сервисами" description="Подключите необходимые сервисы" type="info" showIcon style={{ marginBottom: '24px' }} />
            <Row gutter={[16, 16]}>
              {integrationsData.map((integration) => (
                <Col xs={24} sm={12} lg={6} key={integration.id}>
                  <Card hoverable style={{ borderColor: integration.connected ? '#52c41a' : '#d9d9d9' }}>
                    <Space style={{ marginBottom: '12px' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{integration.icon}</div>
                      <div><Title level={5} style={{ margin: 0 }}>{integration.name}</Title><Tag color={integration.connected ? 'green' : 'default'}>{integration.connected ? 'Подключено' : 'Не подключено'}</Tag></div>
                    </Space>
                    <Paragraph type="secondary" style={{ fontSize: '13px' }}>{integration.description}</Paragraph>
                    <Divider style={{ margin: '12px 0' }} />
                    <AppButton variant={integration.connected ? 'default' : 'primary'} block icon={<LinkOutlined />}>{integration.connected ? 'Настроить' : 'Подключить'}</AppButton>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </AppCard>
    </div>
  );
}

export default Settings;