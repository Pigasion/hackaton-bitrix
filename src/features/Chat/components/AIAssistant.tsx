// src/features/Chat/components/AIAssistant.tsx
import { useState } from 'react';
import { Drawer, Button, List, Card, Typography, Space, Tag, Input, message, Divider } from 'antd';
import {
  RobotOutlined,
  SendOutlined,
  BulbOutlined,
  MessageOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StarOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { AppButton } from '@/components/UI';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface AIHint {
  id: string;
  category: 'greeting' | 'communication' | 'sales' | 'closing' | 'vip';
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
}

const aiHints: AIHint[] = [
  {
    id: '1',
    category: 'greeting',
    title: 'Приветствие клиента',
    content: 'Начните с дружелюбного приветствия. Представьтесь и назовите компанию. Пример: "Здравствуйте! Меня зовут [Имя], компания PolyRouter. Чем могу помочь?"',
    icon: <MessageOutlined />,
    color: 'blue',
  },
  {
    id: '2',
    category: 'communication',
    title: 'Уточнение потребностей',
    content: 'Задавайте открытые вопросы: "Какой тираж вас интересует?", "Какие сроки нужны?", "Есть ли предпочтения по материалу?"',
    icon: <BulbOutlined />,
    color: 'green',
  },
  {
    id: '3',
    category: 'sales',
    title: 'Работа с возражениями',
    content: 'Если клиент говорит "дорого" — объясните ценность: качество, сроки, сервис. Предложите альтернативные варианты.',
    icon: <ThunderboltOutlined />,
    color: 'orange',
  },
  {
    id: '4',
    category: 'vip',
    title: 'VIP-клиенты',
    content: 'VIP-клиентам предлагайте персонального менеджера, приоритетное обслуживание и специальные условия. Отвечайте максимально быстро!',
    icon: <StarOutlined />,
    color: 'red',
  },
  {
    id: '5',
    category: 'closing',
    title: 'Закрытие сделки',
    content: 'После обсуждения деталей предложите следующий шаг: "Отлично! Давайте оформим заказ. Пришлите ТЗ на почту или прямо здесь."',
    icon: <CheckCircleOutlined />,
    color: 'purple',
  },
  {
    id: '6',
    category: 'communication',
    title: 'Завершение разговора',
    content: 'Всегда завершайте разговор вежливо: "Благодарю за обращение! Если будут вопросы — пишите. Хорошего дня!"',
    icon: <TeamOutlined />,
    color: 'cyan',
  },
];

interface AIAssistantProps {
  clientName?: string;
  isVip?: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ clientName, isVip }) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customQuestion, setCustomQuestion] = useState('');
  const [api, contextHolder] = message.useMessage();

  const categories = [
    { key: 'all', label: 'Все', color: 'default' },
    { key: 'greeting', label: 'Приветствие', color: 'blue' },
    { key: 'communication', label: 'Общение', color: 'green' },
    { key: 'sales', label: 'Продажи', color: 'orange' },
    { key: 'closing', label: 'Закрытие', color: 'purple' },
    { key: 'vip', label: 'VIP', color: 'red' },
  ];

  const filteredHints = selectedCategory === 'all'
    ? aiHints
    : aiHints.filter(hint => hint.category === selectedCategory);

  const handleAskAI = () => {
    if (!customQuestion.trim()) {
      api.warning('Введите вопрос');
      return;
    }

    // Имитация ответа ИИ (в будущем здесь будет реальный API)
    api.success({
      content: '💡 AI анализирует ваш вопрос... В реальной системе здесь будет интеграция с ChatGPT/Claude',
      duration: 3,
    });

    setCustomQuestion('');
  };

  const showDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <>
      {contextHolder}

      {/* Кнопка открытия AI-помощника */}
      <Button
        type="primary"
        icon={<RobotOutlined />}
        onClick={showDrawer}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
        }}
      >
        🤖 AI-помощник
      </Button>

      {/* Выдвижная панель с подсказками */}
      <Drawer
        title={
          <Space>
            <RobotOutlined style={{ color: '#667eea' }} />
            <div>
              <div style={{ fontWeight: 600 }}>AI-помощник менеджера</div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Подсказки для работы с клиентами
              </Text>
            </div>
          </Space>
        }
        placement="right"
        width={500}
        onClose={closeDrawer}
        open={open}
      >
        {/* Контекстная информация */}
        {clientName && (
          <Card
            size="small"
            style={{
              marginBottom: 20,
              background: isVip ? '#fff2f0' : '#e6f7ff',
              border: isVip ? '1px solid #ffccc7' : '1px solid #91d5ff',
            }}
          >
            <Space>
              <TeamOutlined style={{ color: isVip ? '#ff4d4f' : '#0052cc' }} />
              <div>
                <div style={{ fontWeight: 500 }}>{clientName}</div>
                {isVip && <Tag color="red">VIP клиент</Tag>}
              </div>
            </Space>
          </Card>
        )}

        {/* Фильтры по категориям */}
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Категории:</Text>
          <Space wrap>
            {categories.map(cat => (
              <Tag
                key={cat.key}
                color={cat.color}
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  cursor: 'pointer',
                  background: selectedCategory === cat.key ? cat.color : undefined,
                  color: selectedCategory === cat.key ? '#fff' : undefined,
                }}
              >
                {cat.label}
              </Tag>
            ))}
          </Space>
        </div>

        {/* Список подсказок */}
        <Title level={5} style={{ marginBottom: 12 }}>💡 Полезные советы:</Title>
        <List
          dataSource={filteredHints}
          style={{ marginBottom: 24 }}
          renderItem={(hint) => (
            <List.Item>
              <Card
                size="small"
                hoverable
                style={{
                  width: '100%',
                  borderLeft: `4px solid ${hint.color}`,
                }}
              >
                <Space align="start" style={{ width: '100%' }}>
                  <div style={{
                    fontSize: 24,
                    color: hint.color,
                    padding: '8px',
                    background: `${hint.color}15`,
                    borderRadius: '8px',
                  }}>
                    {hint.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Title level={5} style={{ marginBottom: 4 }}>{hint.title}</Title>
                    <Paragraph style={{ margin: 0, fontSize: 13 }}>
                      {hint.content}
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            </List.Item>
          )}
        />

        <Divider />

        {/* Форма для своего вопроса */}
        <Title level={5} style={{ marginBottom: 12 }}>❓ Задайте свой вопрос:</Title>
        <TextArea
          rows={3}
          placeholder="Например: Как ответить на возражение 'дорого'?"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <AppButton
          icon={<SendOutlined />}
          onClick={handleAskAI}
          block
        >
          Спросить AI
        </AppButton>

        <Divider />

        {/* Подсказка */}
        <div style={{
          padding: '12px',
          background: '#f6ffed',
          borderRadius: '8px',
          border: '1px solid #b7eb8f',
        }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 <strong>Совет:</strong> Используйте подсказки перед ответом клиенту, особенно если вы новичок или сложная ситуация.
          </Text>
        </div>
      </Drawer>
    </>
  );
};