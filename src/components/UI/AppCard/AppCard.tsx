import { Card, CardProps } from 'antd';

export interface AppCardProps extends CardProps {
  variant?: 'default' | 'hoverable' | 'bordered' | 'metric';
  padding?: 'default' | 'small' | 'large' | 'none';
}

export const AppCard: React.FC<AppCardProps> = ({
                                                  variant = 'default',
                                                  padding = 'default',
                                                  children,
                                                  ...props
                                                }) => {
  const paddingMap = {
    default: '24px',
    small: '16px',
    large: '32px',
    none: '0',
  };

  return (
    <Card
      {...props}
      hoverable={variant === 'hoverable'}
      bordered={variant === 'bordered'}
      styles={{
        body: { padding: padding === 'none' ? 0 : paddingMap[padding], ...props.styles?.body },
      }}
      style={{
        borderRadius: '8px',
        boxShadow: variant === 'default' || variant === 'metric'
          ? '0 2px 8px rgba(0, 0, 0, 0.08)'
          : undefined,
        ...props.style,
      }}
    >
      {children}
    </Card>
  );
};