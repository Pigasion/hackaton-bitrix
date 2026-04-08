// src/pages/Registration.tsx
import { useState } from 'react';
import { Form, Input, Button, Card, Checkbox, Typography, Space, Row, Col, Progress, Alert, Divider, Select } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, TeamOutlined, CheckCircleOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppButton, AppInput } from '@/components/UI';

const { Title, Text, Link } = Typography;

function Registration() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 25) return '#ff4d4f';
    if (strength <= 50) return '#ff9c6e';
    if (strength <= 75) return '#faad14';
    return '#52c41a';
  };

  const handleRegister = (values: any) => {
    console.log('Регистрация:', values);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px' }}>
      <Card style={{ width: '100%', maxWidth: 600, borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ margin: 0, color: '#0052cc' }}>🚀 Flex-N-Roll PWA</Title>
          <Text type="secondary">Регистрация нового аккаунта менеджера</Text>
        </div>

        <Alert message="Доступ только для сотрудников" description="Регистрация доступна только для сотрудников компании PolyRouter" type="info" showIcon style={{ marginBottom: '24px' }} icon={<CheckCircleOutlined />} />

        <Form form={form} layout="vertical" onFinish={handleRegister} autoComplete="off">
          <Row gutter={[16, 16]}>
            <Col span={24}><Form.Item label="ФИО полностью" name="fullName" rules={[{ required: true, message: 'Введите ФИО' }]}><Input prefix={<UserOutlined />} size="large" /></Form.Item></Col>
            <Col span={12}><Form.Item label="Корпоративный Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}><Input prefix={<MailOutlined />} size="large" /></Form.Item></Col>
            <Col span={12}><Form.Item label="Телефон" name="phone" rules={[{ required: true, message: 'Введите телефон' }]}><Input prefix={<PhoneOutlined />} size="large" /></Form.Item></Col>
            <Col span={12}><Form.Item label="Отдел" name="department" rules={[{ required: true, message: 'Выберите отдел' }]}><Select size="large" options={[{ value: 'sales', label: 'Отдел продаж' }, { value: 'production', label: 'Производство' }, { value: 'logistics', label: 'Логистика' }]} /></Form.Item></Col>
            <Col span={12}><Form.Item label="Должность" name="position" rules={[{ required: true, message: 'Введите должность' }]}><Input prefix={<UserOutlined />} size="large" /></Form.Item></Col>
            <Col span={12}><Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }, { min: 8, message: 'Минимум 8 символов' }]}><Input.Password prefix={<LockOutlined />} size="large" onChange={(e) => checkPasswordStrength(e.target.value)} /></Form.Item></Col>
            <Col span={12}><Form.Item label="Подтвердите пароль" name="confirmPassword" rules={[{ required: true, message: 'Подтвердите пароль' }]}><Input.Password prefix={<LockOutlined />} size="large" /></Form.Item></Col>
          </Row>

          <Form.Item name="terms" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Необходимо согласие')) }]}><Checkbox><Text style={{ fontSize: '13px' }}>Я согласен с условиями использования и политикой конфиденциальности</Text></Checkbox></Form.Item>
          <Form.Item name="personalData" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Необходимо согласие')) }]}><Checkbox><Text style={{ fontSize: '13px' }}>Я даю согласие на обработку персональных данных (152-ФЗ)</Text></Checkbox></Form.Item>

          <Form.Item><AppButton htmlType="submit" size="large" block style={{ height: '48px', fontSize: '16px' }}>Зарегистрироваться</AppButton></Form.Item>

          <Divider />
          <div style={{ textAlign: 'center' }}><Text type="secondary">Уже есть аккаунт?</Text><br /><Link onClick={() => navigate('/login')} style={{ fontSize: '14px' }}>Войти в систему</Link></div>
        </Form>
      </Card>
    </div>
  );
}

export default Registration;