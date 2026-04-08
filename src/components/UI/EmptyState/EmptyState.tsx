// src/components/UI/EmptyState/EmptyState.tsx
import { Empty } from 'antd';
import { ReactNode } from 'react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  image?: 'simple' | 'default' | 'custom';
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
                                                        title = 'Ничего не найдено',
                                                        description = 'Попробуйте изменить параметры поиска или фильтрации',
                                                        action,
                                                        image = 'simple',
                                                        style,
                                                      }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        ...style,
      }}
    >
      <Empty
        image={image === 'simple' ? Empty.PRESENTED_IMAGE_SIMPLE : undefined}
      />
      {title && (
        <h3
          style={{
            margin: '16px 0 8px',
            fontSize: '16px',
            fontWeight: 500,
            color: '#333',
          }}
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          style={{
            margin: 0,
            color: '#999',
            fontSize: '14px',
            maxWidth: '400px',
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: '24px' }}>{action}</div>}
    </div>
  );
};