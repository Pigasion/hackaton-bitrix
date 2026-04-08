import { Button, ButtonProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export interface AppButtonProps extends ButtonProps {
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  variant?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  size?: 'small' | 'middle' | 'large';
}

export const AppButton: React.FC<AppButtonProps> = ({
                                                      children,
                                                      isLoading = false,
                                                      iconLeft,
                                                      iconRight,
                                                      variant = 'primary',
                                                      size = 'middle',
                                                      ...props
                                                    }) => {
  return (
    <Button
      {...props}
      type={variant}
      size={size}
      loading={isLoading}
      icon={isLoading ? <LoadingOutlined /> : iconLeft}
    >
      {children}
      {iconRight && !isLoading && <span style={{ marginLeft: '8px' }}>{iconRight}</span>}
    </Button>
  );
};