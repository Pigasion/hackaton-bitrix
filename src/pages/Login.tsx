// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, Alert, message } from 'antd';
import { KeyOutlined, LoginOutlined, RobotOutlined } from '@ant-design/icons';
import { AppButton } from '@/components/UI';

const { Title, Text } = Typography;

interface LoginFormValues {
  token: string;
}

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [api, contextHolder] = message.useMessage();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setError('');

    try {
      // 🔹 Здесь будет проверка токена в Битриксе
      // Для демо принимаем любой токен длиной >= 10 символов
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (values.token.length < 10) {
        throw new Error('Неверный токен. Минимальная длина: 10 символов');
      }

      // ✅ Успешная авторизация
      localStorage.setItem('authToken', values.token);
      localStorage.setItem('isAuthenticated', 'true');

      api.success({
        content: '✅ Авторизация успешна!',
        duration: 2,
      });

      // Перенаправление на главную
      setTimeout(() => {
        navigate('/');
      }, 500);

    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
      api.error({
        content: '❌ ' + (err.message || 'Ошибка авторизации'),
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      {contextHolder}

      <Card
        style={{
          width: '100%',
          maxWidth: 450,
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
          }}>
            <RobotOutlined style={{ color: '#fff' }} />
          </div>
          <Title level={3} style={{ marginBottom: 8 }}>
            PolyRouter
          </Title>
          <Text type="secondary">
            Единая система коммуникаций
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
            closable
            onClose={() => setError('')}
          />
        )}

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="token"
            label={<Text strong>Токен доступа</Text>}
            rules={[
              { required: true, message: 'Введите токен' },
              { min: 10, message: 'Минимальная длина токена: 10 символов' },
            ]}
          >
            <Input.Password
              prefix={<KeyOutlined style={{ color: '#999' }} />}
              placeholder="Введите ваш токен"
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <AppButton
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<LoginOutlined />}
              block
              style={{ borderRadius: '8px' }}
            >
              Войти в систему
            </AppButton>
          </Form.Item>
        </Form>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#f6ffed',
          borderRadius: '8px',
          border: '1px solid #b7eb8f',
        }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 <strong>Для демо:</strong> введите любой токен длиной от 10 символов.<br />
            В продакшене токен будет проверяться через API Битрикс24.
          </Text>
        </div>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          padding: '16px',
          borderTop: '1px solid #f0f0f0',
        }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            © 2026 PolyRouter. Все права защищены.
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default Login;