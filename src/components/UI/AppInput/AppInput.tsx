import {Input, InputProps} from 'antd';
import {useState} from 'react';

export interface AppInputProps extends InputProps {
  label?: string;
  error?: string;
  hint?: string;
  mask?: 'phone' | 'email' | 'default';
  fullWidth?: boolean;
}

export const AppInput: React.FC<AppInputProps> = ({
                                                    label,
                                                    error,
                                                    hint,
                                                    mask = 'default',
                                                    fullWidth = true,
                                                    ...props
                                                  }) => {
  const [focused, setFocused] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mask !== 'phone') {
      props.onChange?.(e);
      return;
    }
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    if (value.length > 0) {
      value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
    }
    e.target.value = value;
    props.onChange?.(e);
  };

  return (
    <div style={{marginBottom: '16px', width: fullWidth ? '100%' : 'auto'}}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            color: focused ? '#0052cc' : '#333',
            fontSize: '14px',
          }}
        >
          {label}
        </label>
      )}
      <Input
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        onChange={mask === 'phone' ? handlePhoneChange : props.onChange}
        status={error ? 'error' : undefined}
        size="large"
      />
      {error && (
        <div
          style={{
            color: '#ff4d4f',
            fontSize: '12px',
            marginTop: '4px'
          }}
        >{error}</div>
      )}
      {hint && !error && (
        <div
          style={{
            color: '#999',
            fontSize: '12px',
            marginTop: '4px'
          }}
        >{hint}</div>
      )}
    </div>
  );
};