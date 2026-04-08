// src/pages/Login.tsx
import { useState } from 'react';
import { Form, Input, Button, Card, Checkbox, Typography, Alert, Divider, Space, Tooltip } from 'antd';
import { MailOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, QuestionCircleOutlined, WhatsAppOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppButton, AppInput } from '@/components/UI';

const { Title, Text, Link } = Typography;

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: any) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/');
    } catch (error) {
      setLoginError('Неверный email или пароль.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px' }}>
      <Card style={{ width: '100%', maxWidth: 480, borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#0052cc' }}>🚀 Flex-N-Roll PWA</Title>
          <Text type="secondary">Вход в систему для менеджеров</Text>
        </div>

        {loginError && <Alert message="Ошибка входа" description={loginError} type="error" showIcon style={{ marginBottom: '24px' }} closable onClose={() => setLoginError(null)} />}

        <Form form={form} layout="vertical" onFinish={handleLogin} autoComplete="off" initialValues={{ remember: true }}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}><AppInput prefix={<MailOutlined />} size="large" disabled={isLoading} /></Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }]}><Input.Password prefix={<LockOutlined />} size="large" visibilityRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />} disabled={isLoading} /></Form.Item>

          <Form.Item><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Form.Item name="remember" valuePropName="checked" noStyle><Checkbox disabled={isLoading}>Запомнить меня</Checkbox></Form.Item><Link onClick={() => alert('Функция восстановления в разработке')}>Забыли пароль?</Link></div></Form.Item>

          <Form.Item><AppButton htmlType="submit" size="large" block loading={isLoading} style={{ height: '48px', fontSize: '16px' }}>{isLoading ? 'Вход...' : 'Войти'}</AppButton></Form.Item>

          <Divider />
          <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
            <Text type="secondary">Нет аккаунта? <Link onClick={() => navigate('/register')}>Зарегистрироваться</Link></Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>Нужна помощь? <Tooltip title="Написать в поддержку"><Link><WhatsAppOutlined style={{ color: '#25D366', marginRight: 4 }} />WhatsApp</Link></Tooltip> или <Tooltip title="Позвонить"><Link><PhoneOutlined style={{ color: '#0052cc', marginRight: 4 }} />+7 (495) 000-00-00</Link></Tooltip></Text>
          </Space>

          <Divider style={{ margin: '24px 0 16px' }} />
          <div style={{ textAlign: 'center' }}><Text type="secondary" style={{ fontSize: '11px' }}>Нажимая «Войти», вы соглашаетесь с условиями использования и политикой конфиденциальности<br />Обработка персональных данных осуществляется в соответствии с 152-ФЗ</Text></div>
        </Form>

        <Alert message="🧪 Демо-режим" description={<Space direction="vertical" size={0}><Text style={{ fontSize: '12px' }}><strong>Email:</strong> demo@polyrouter.ru</Text><Text style={{ fontSize: '12px' }}><strong>Пароль:</strong> Demo123!</Text></Space>} type="info" showIcon style={{ marginTop: '16px' }} icon={<QuestionCircleOutlined />} />
      </Card>
    </div>
  );
}

export default Login;