// src/pages/Faq.tsx
import { useState, useMemo } from 'react';
import { Collapse, Input, Tag, Empty, Typography, Space, Card, Row, Col, Statistic } from 'antd';
import {
  SearchOutlined,
  BulbOutlined,
  MessageOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  WarningOutlined,
  RobotOutlined,
  StarOutlined, // ← Добавь это
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { AppButton, AppCard, PageHeader } from '@/components/UI';
import { AppLayout } from '@/components/Layout/AppLayout';

const { Text, Paragraph } = Typography;

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  popular?: boolean;
}

const faqData: FaqItem[] = [
  {
    id: '1',
    category: 'Общие',
    question: 'Как оформить заказ на печать?',
    answer: 'Заказы принимаются через чат, email или личный кабинет. Укажите тираж, формат, материал, цветность и сроки. После расчёта менеджер выставляет счёт. Работа начинается после поступления предоплаты.',
    tags: ['оформление', 'заказ', 'процесс'],
    popular: true,
  },
  {
    id: '2',
    category: 'Тех. требования',
    question: 'В каком формате принимаются макеты?',
    answer: 'Принимаем PDF, AI, CDR, TIFF, PSD (слои сведены). Цветовая модель строго CMYK. Вылеты под обрез: 2-3 мм с каждой стороны. Разрешение растровых изображений: не менее 300 dpi.',
    tags: ['макет', 'CMYK', 'вылеты', 'dpi', 'форматы'],
    popular: true,
  },
  {
    id: '3',
    category: 'Материалы',
    question: 'Чем отличается мелованная бумага от офсетной?',
    answer: 'Мелованная бумага имеет гладкое покрытие, лучше передаёт детализацию и яркие цвета (идеальна для каталогов, буклетов). Офсетная более пористая, подходит для текстовой продукции, писем, бланков. Выбор зависит от задачи.',
    tags: ['бумага', 'мелованная', 'офсетная', 'выбор'],
  },
  {
    id: '4',
    category: 'Сроки',
    question: 'Сколько времени занимает срочная печать?',
    answer: 'Стандартный срок: 3-5 рабочих дней. Срочный заказ (до 24 часов) возможен при наличии материалов и свободных мощностей. Накрутка за срочность: +30-50%. Точные сроки подтверждает менеджер после оценки макета.',
    tags: ['срочно', 'дедлайн', 'наценка'],
  },
  {
    id: '5',
    category: 'Оплата',
    question: 'Какие условия оплаты для юрлиц?',
    answer: 'Работаем по договору. Предоплата 50-100% в зависимости от тиража и типа продукции. Для постоянных клиентов доступна постоплата с отсрочкой 14-30 дней. Все счета с НДС. Оплата по реквизитам на р/с.',
    tags: ['счёт', 'НДС', 'предоплата', 'отсрочка'],
  },
  {
    id: '6',
    category: 'Тех. требования',
    question: 'Что такое "вылеты под обрез" и зачем они нужны?',
    answer: 'Вылеты (bleed) — это запас фона или изображения за пределами реза на 2-3 мм. Нужны, чтобы при резке тиража не оставалось белых полос по краям. Без вылетов печать возможна, но риск брака возрастает.',
    tags: ['вылеты', 'резка', 'обрез', 'макет'],
    popular: true,
  },
  {
    id: '7',
    category: 'Брак / Рекламации',
    question: 'Что делать, если в тираже есть брак?',
    answer: 'При обнаружении брака свяжитесь с менеджером в течение 3 рабочих дней после получения. Приложите фото/видео дефекта. Мы проведём экспертизу и предложим замену, скидку или переделку за счёт производства.',
    tags: ['брак', 'рекламация', 'возврат', 'экспертиза'],
  },
  {
    id: '8',
    category: 'Доставка',
    question: 'Как организована доставка тиража?',
    answer: 'Самовывоз со склада бесплатно. Доставка по городу: от 300 ₽ (зависит от габаритов и веса). По области/РФ: через ТК (СДЭК, Деловые Линии). Упаковка в плёнку и картон включена. Страховка груза по запросу.',
    tags: ['доставка', 'ТК', 'самовывоз', 'упаковка'],
  },
  {
    id: '9',
    category: 'Материалы',
    question: 'Какая плотность бумаги оптимальна для визиток?',
    answer: 'Стандарт: 300-350 г/м² (мелованная или дизайнерская). Премиум: 400-450 г/м² с ламинацией. Менее 250 г/м² не рекомендуем — визитки будут мяться и терять вид.',
    tags: ['визитки', 'плотность', 'ламинация', 'г/м²'],
  },
  {
    id: '10',
    category: 'Общие',
    question: 'Можно ли заказать печать без готового макета?',
    answer: 'Да. У нас есть отдел дизайна. Стоимость разработки макета зависит от сложности: визитка/бланк — от 1500 ₽, каталог/буклет — от 5000 ₽. Срок разработки: 1-3 рабочих дня.',
    tags: ['дизайн', 'макет', 'разработка', 'стоимость'],
  },
];

const categories = [
  { key: 'all', label: 'Все вопросы', icon: <BulbOutlined />, color: 'blue' },
  { key: 'Общие', label: 'Общие', icon: <MessageOutlined />, color: 'default' },
  { key: 'Тех. требования', label: 'Тех. требования', icon: <ToolOutlined />, color: 'purple' },
  { key: 'Материалы', label: 'Материалы', icon: <ToolOutlined />, color: 'green' },
  { key: 'Сроки', label: 'Сроки', icon: <ClockCircleOutlined />, color: 'orange' },
  { key: 'Оплата', label: 'Оплата', icon: <CreditCardOutlined />, color: 'cyan' },
  { key: 'Брак / Рекламации', label: 'Брак', icon: <WarningOutlined />, color: 'red' },
];

function FaqContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return faqData.filter((item) => {
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const popularTags = [...new Set(faqData.filter((f) => f.popular).flatMap((f) => f.tags))].slice(0, 8);

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader
        title={<><RobotOutlined style={{ color: '#0052cc', marginRight: 8 }} />Умный FAQ</>}
        description="База знаний по полиграфии: от макетов до сроков. Ответы на частые вопросы за секунду"
      />

      {/* Статистика */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <AppCard variant="metric">
            <Statistic title="Всего вопросов" value={faqData.length} prefix={<BulbOutlined />} valueStyle={{ color: '#0052cc' }} />
          </AppCard>
        </Col>
        <Col xs={12} sm={6}>
          <AppCard variant="metric">
            <Statistic title="Категорий" value={categories.length - 1} prefix={<ToolOutlined />} valueStyle={{ color: '#722ed1' }} />
          </AppCard>
        </Col>
        <Col xs={12} sm={6}>
          <AppCard variant="metric">
            <Statistic title="Тех. требований" value={faqData.filter((f) => f.category === 'Тех. требования').length} prefix={<ToolOutlined />} valueStyle={{ color: '#1890ff' }} />
          </AppCard>
        </Col>
        <Col xs={12} sm={6}>
          <AppCard variant="metric">
            <Statistic title="Популярных тем" value={popularTags.length} prefix={<StarOutlined />} valueStyle={{ color: '#faad14' }} />
          </AppCard>
        </Col>
      </Row>

      <AppCard style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* Поиск */}
          <Input.Search
            placeholder="Поиск по вопросам, ответам или тегам..."
            prefix={<SearchOutlined />}
            allowClear
            size="large"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />

          {/* Фильтры категорий */}
          <Space wrap>
            {categories.map((cat) => (
              <Tag
                key={cat.key}
                color={selectedCategory === cat.key ? cat.color : 'default'}
                icon={cat.icon}
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  cursor: 'pointer',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: selectedCategory === cat.key ? 600 : 400,
                  background: selectedCategory === cat.key ? cat.color : undefined,
                  color: selectedCategory === cat.key ? '#fff' : undefined,
                  transition: 'all 0.2s',
                }}
              >
                {cat.label}
              </Tag>
            ))}
          </Space>

          {/* Популярные теги */}
          {selectedCategory === 'all' && !searchQuery && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 6 }}>
                🔥 Часто ищут:
              </Text>
              <Space wrap>
                {popularTags.map((tag) => (
                  <Tag key={tag} color="default" onClick={() => setSearchQuery(tag)} style={{ cursor: 'pointer' }}>
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </Space>
      </AppCard>

      {/* Список FAQ */}
      <AppCard>
        {filteredFaqs.length > 0 ? (
          <Collapse
            accordion
            defaultActiveKey={[filteredFaqs[0]?.id]}
            items={filteredFaqs.map((faq) => ({
              key: faq.id,
              label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Text strong style={{ fontSize: '15px' }}>{faq.question}</Text>
                  <Tag color={categories.find((c) => c.key === faq.category)?.color || 'default'} style={{ marginLeft: 12 }}>
                    {faq.category}
                  </Tag>
                </div>
              ),
              children: (
                <div>
                  <Paragraph style={{ marginBottom: 12, lineHeight: '1.7' }}>{faq.answer}</Paragraph>
                  <Space wrap>
                    {faq.tags.map((tag) => (
                      <Tag key={tag} color="default" onClick={() => setSearchQuery(tag)} style={{ cursor: 'pointer' }}>
                        #{tag}
                      </Tag>
                    ))}
                  </Space>
                </div>
              ),
            }))}
            expandIconPosition="end"
            style={{ background: 'transparent' }}
          />
        ) : (
          <Empty
            description="Вопросы не найдены"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Text type="secondary" style={{ fontSize: '13px' }}>
              Попробуйте изменить запрос или выберите другую категорию
            </Text>
          </Empty>
        )}
      </AppCard>

      {/* Подвал с подсказкой */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f', maxWidth: 600, margin: '0 auto' }}>
          <Space direction="vertical" align="center">
            <Text strong style={{ color: '#389e0d' }}>Не нашли ответ?</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Задайте вопрос в чате с поддержкой или спросите у AI-помощника в открытом диалоге
            </Text>
            <Space>
              <AppButton size="small" variant="default" onClick={() => (window.location.href = '/chats')}>
                <MessageOutlined /> Написать в поддержку
              </AppButton>
              <AppButton size="small" variant="default" onClick={() => (window.location.href = '/chats')}>
                <RobotOutlined /> Спросить AI
              </AppButton>
            </Space>
          </Space>
        </Card>
      </div>
    </div>
  );
}

const Faq = () => {
  return (
    <AppLayout>
      <FaqContent />
    </AppLayout>
  );
};

export default Faq;