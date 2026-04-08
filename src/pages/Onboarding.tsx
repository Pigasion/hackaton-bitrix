// src/pages/Onboarding.tsx
import { useState } from 'react';
import { Steps, Button, Card, Row, Col, Progress, List, Badge, Tag, Alert, Space, Result, Typography, Divider } from 'antd';
import { CheckCircleOutlined, PhoneOutlined, MessageOutlined, TeamOutlined, FileTextOutlined, StarOutlined, RocketOutlined, BookOutlined } from '@ant-design/icons';
import { AppButton, AppCard, PageHeader } from '@/components/UI';

const { Title, Paragraph } = Typography;

const onboardingSteps = [
  { title: 'Знакомство с системой', description: 'Изучи интерфейс PolyRouter', icon: <BookOutlined />, content: { tasks: ['Изучи структуру меню', 'Пойми, где находятся уведомления', 'Разберись с цветовой индикацией'], tip: '💡 Совет: начни с Дашборда' } },
  { title: 'Работа с клиентами', description: 'Научись вести карточки клиентов', icon: <TeamOutlined />, content: { tasks: ['Создай тестовую карточку', 'Пометь клиента как VIP', 'Добавь контакты и заметки'], tip: '⚠️ Важно: VIP-клиенты помечаются красным' } },
  { title: 'Обработка звонков', description: 'Правила приёма входящих', icon: <PhoneOutlined />, content: { tasks: ['Прими тестовый звонок', 'Определи отдел', 'Запиши суть обращения'], tip: '📞 Стандарт: "Здравствуйте, компания PolyRouter..."' } },
  { title: 'Чаты и мессенджеры', description: 'Единое окно коммуникаций', icon: <MessageOutlined />, content: { tasks: ['Ответь на сообщение в WhatsApp', 'Обработай email-запрос', 'Используй быстрые шаблоны'], tip: '📨 Все сообщения в одном окне!' } },
  { title: 'Работа с заказами', description: 'Ведение сделок в CRM', icon: <FileTextOutlined />, content: { tasks: ['Создай новую сделку', 'Заполни ТЗ', 'Передай расчёт экономисту'], tip: '📋 Не забывай обновлять статус заказа!' } },
  { title: 'Завершение', description: 'Финальный тест', icon: <StarOutlined />, content: { tasks: ['Пройди тест из 10 вопросов', 'Получи сертификат', 'Начни работу с клиентами'], tip: '🎉 Поздравляем! Ты готов к работе!' } },
];

const completedTasks = [
  { id: 1, text: 'Просмотрел видео-инструкцию', done: true },
  { id: 2, text: 'Изучил структуру меню', done: true },
  { id: 3, text: 'Создал тестовую карточку', done: false },
  { id: 4, text: 'Принял тестовый звонок', done: false },
];

function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const next = () => {
    if (currentStep < onboardingSteps.length - 1) setCurrentStep(currentStep + 1);
    else setCompleted(true);
  };

  const prev = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const progressPercent = ((currentStep + 1) / onboardingSteps.length) * 100;
  const currentStepData = onboardingSteps[currentStep];

  if (completed) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '40px' }}>
        <Result status="success" title="Поздравляем! 🎉" subTitle="Вы успешно прошли онбординг"
                extra={[<AppButton key="dashboard" href="/">Перейти на Дашборд</AppButton>, <AppButton key="certificate" variant="default" icon={<StarOutlined />}>Получить сертификат</AppButton>]} />
        <AppCard title="📊 Ваш результат" style={{ marginTop: '32px', textAlign: 'left' }}>
          <Row gutter={[16, 16]}>
            <Col span={8}><Statistic title="Пройдено шагов" value={onboardingSteps.length} suffix={`/ ${onboardingSteps.length}`} /></Col>
            <Col span={8}><Statistic title="Выполнено задач" value={`${completedTasks.filter(t => t.done).length}/${completedTasks.length}`} /></Col>
            <Col span={8}><Statistic title="Время обучения" value="45" suffix="мин" /></Col>
          </Row>
        </AppCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={<><RocketOutlined style={{ marginRight: '12px', color: '#0052cc' }} />Онбординг нового менеджера</>} description="Пошаговое руководство для быстрого старта работы в PolyRouter" />

      <AppCard style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 500 }}>Прогресс обучения</span><span style={{ color: '#0052cc', fontWeight: 600 }}>{Math.round(progressPercent)}%</span></div>
        <Progress percent={progressPercent} strokeColor={{ '0%': '#0052cc', '100%': '#52c41a' }} showInfo={false} />
      </AppCard>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Steps direction="vertical" current={currentStep} items={onboardingSteps.map((step) => ({ title: step.title, description: step.description, icon: step.icon }))} />
        </Col>
        <Col xs={24} lg={16}>
          <AppCard title={<Space>{currentStepData.icon}<span>{currentStepData.title}</span></Space>} extra={<Tag color="blue">Шаг {currentStep + 1} из {onboardingSteps.length}</Tag>} style={{ minHeight: '400px' }}>
            <Alert message={currentStepData.content.tip} type="info" showIcon style={{ marginBottom: '24px' }} />
            <Title level={5}>Задачи для выполнения:</Title>
            <List dataSource={currentStepData.content.tasks} renderItem={(task, index) => (<List.Item><Space><Badge count={index + 1} style={{ backgroundColor: '#0052cc' }} /><span>{task}</span></Space></List.Item>)} />
            <Divider />
            <Title level={5}>Ваши достижения:</Title>
            <List dataSource={completedTasks} renderItem={(task) => (<List.Item><Space>{task.done ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }} /> : <div style={{ width: 18, height: 18, border: '2px solid #d9d9d9', borderRadius: '50%' }} />}<span style={{ textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#999' : 'inherit' }}>{task.text}</span></Space></List.Item>)} />
          </AppCard>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
            <AppButton variant="default" onClick={prev} disabled={currentStep === 0} size="large">Назад</AppButton>
            <AppButton onClick={next} size="large" icon={currentStep === onboardingSteps.length - 1 ? <StarOutlined /> : undefined}>{currentStep === onboardingSteps.length - 1 ? 'Завершить обучение' : 'Далее'}</AppButton>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Onboarding;