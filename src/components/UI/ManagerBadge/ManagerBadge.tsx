// src/components/UI/ManagerBadge/ManagerBadge.tsx
import { Badge, Tooltip, Progress, Tag } from 'antd';
import { StarFilled, TrophyOutlined, RiseOutlined } from '@ant-design/icons';
import { useManagerStore } from '@/store/useManagerStore.ts';

export const ManagerBadge: React.FC = () => {
  const { stats } = useManagerStore();

  const getLevelColor = (level: number) => {
    if (level >= 10) return '#f5222d'; // Красный (мастер)
    if (level >= 5) return '#faad14'; // Жёлтый (опытный)
    return '#1890ff'; // Синий (новичок)
  };

  const getLevelTitle = (level: number) => {
    if (level >= 10) return 'Мастер';
    if (level >= 5) return 'Опытный';
    if (level >= 3) return 'Специалист';
    return 'Новичок';
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  };

  return (
    <Tooltip
      title={
        <div style={{ padding: '8px' }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
              Уровень {stats.level} — {getLevelTitle(stats.level)}
            </div>
            <Progress
              percent={Math.round((stats.experience / stats.maxExperience) * 100)}
              size="small"
              strokeColor={getLevelColor(stats.level)}
              format={() => `${stats.experience}/${stats.maxExperience} XP`}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', marginBottom: '4px' }}>
              <StarFilled style={{ color: '#faad14', marginRight: '4px' }} />
              Рейтинг: {stats.rating.toFixed(1)} {getRatingStars(stats.rating)}
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', marginBottom: '4px' }}>
              <RiseOutlined style={{ marginRight: '4px' }} />
              Онбординг: {stats.onboardingProgress}%
            </div>
            <Progress
              percent={stats.onboardingProgress}
              size="small"
              strokeColor={stats.onboardingProgress === 100 ? '#52c41a' : '#1890ff'}
              showInfo={false}
            />
          </div>

          <div style={{ fontSize: '11px', color: '#999' }}>
            <div>📞 Звонков: {stats.totalCalls}</div>
            <div>💬 Чатов: {stats.totalChats}</div>
            <div>📦 Заказов: {stats.totalOrders}</div>
          </div>
        </div>
      }
      placement="bottomRight"
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '12px',
        background: `${getLevelColor(stats.level)}15`,
        border: `1px solid ${getLevelColor(stats.level)}30`,
      }}>
        <TrophyOutlined style={{ color: getLevelColor(stats.level), fontSize: '16px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Tag color={getLevelColor(stats.level)} style={{ margin: 0, fontSize: '11px', padding: '0 6px' }}>
            LVL {stats.level}
          </Tag>
          {stats.onboardingProgress < 100 && (
            <span style={{ fontSize: '9px', color: '#999' }}>
              {stats.onboardingProgress}% онбординг
            </span>
          )}
        </div>
      </div>
    </Tooltip>
  );
};