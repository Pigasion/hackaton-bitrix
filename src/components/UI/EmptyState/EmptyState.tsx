import { Empty, EmptyProps } from 'antd';

export interface EmptyStateProps extends EmptyProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
                                                        title = 'Ничего не найдено',
                                                        description = 'Попробуйте изменить параметры поиска или фильтрации',
                                                        action,
                                                        ...props
                                                      }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center'
    }}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} {...props} />
      {title && <h3 style={{ margin: '16px 0 8px', fontSize: '16px', fontWeight: 500 }}>{title}</h3>}
      {description && <p style={{ margin: 0, color: '#999', fontSize: '14px', maxWidth: '400px' }}>{description}</p>}
      {action && <div style={{ marginTop: '24px' }}>{action}</div>}
    </div>
  );
};