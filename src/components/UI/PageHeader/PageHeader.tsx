import { Typography, Space } from 'antd';
import { ReactNode } from 'react';

const { Title, Text } = Typography;

export interface PageHeaderProps {
  title: string;
  description?: string;
  extra?: ReactNode;
  icon?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
                                                        title,
                                                        description,
                                                        extra,
                                                        icon,
                                                      }) => {
  return (
    <div style={{
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon}
          {title}
        </Title>
        {description && (
          <Text type="secondary" style={{ fontSize: '16px', marginTop: '8px', display: 'block' }}>
            {description}
          </Text>
        )}
      </div>
      {extra && <div>{extra}</div>}
    </div>
  );
};