// src/pages/NotFound.tsx
import { Button, Result, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons';
import { AppButton } from '@/components/UI';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '24px' }}>
      <Result status="404" title="404" subTitle="Упс! Страница, которую вы ищете, не найдена"
              style={{ background: '#fff', padding: '48px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
              extra={
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Space wrap>
                    <AppButton icon={<HomeOutlined />} size="large" onClick={() => navigate('/')}>На главную (Дашборд)</AppButton>
                    <AppButton variant="default" icon={<MessageOutlined />} size="large" onClick={() => navigate('/chats')}>Чаты</AppButton>
                    <AppButton variant="default" icon={<TeamOutlined />} size="large" onClick={() => navigate('/clients')}>Клиенты</AppButton>
                  </Space>
                </Space>
              }>
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '16px' }}>Возможные причины:</p>
          <ul style={{ listStyle: 'none', padding: 0, color: '#999', fontSize: '14px', lineHeight: '2' }}>
            <li>🔹 Страница была удалена или перемещена</li>
            <li>🔹 Неверно введён адрес в строке браузера</li>
            <li>🔹 У вас нет доступа к этой странице</li>
          </ul>
        </div>

        <div style={{ marginTop: '32px', padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'left' }}>
          <p style={{ fontWeight: 600, marginBottom: '12px', color: '#333' }}>💡 Нужна помощь?</p>
          <Space direction="vertical" size="small">
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>📧 Напишите в <strong>Тех. чат</strong> — команда поможет</p>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>📞 Или обратитесь к руководителю отдела</p>
          </Space>
        </div>
      </Result>
    </div>
  );
}

export default NotFound;