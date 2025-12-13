/**
 * Loading Button Component
 * Button with beautiful loading animation
 */

import React, { ReactNode } from 'react';
import { Button, theme } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fontWeights } from '@/theme/themeConfig';

const { useToken } = theme;

interface LoadingButtonProps {
  children: ReactNode;
  loading?: boolean;
  onClick?: () => void;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  htmlType?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  block?: boolean;
  icon?: ReactNode;
  size?: 'large' | 'middle' | 'small';
  style?: React.CSSProperties;
}

export default function LoadingButton({
  children,
  loading = false,
  onClick,
  type = 'primary',
  htmlType = 'button',
  disabled = false,
  block = true,
  icon,
  size = 'large',
  style,
}: LoadingButtonProps) {
  const { token } = useToken();

  const buttonStyle: React.CSSProperties = {
    height: token.controlHeightLG + token.marginXS,
    fontSize: token.fontSizeLG,
    fontWeight: fontWeights.semibold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: token.marginSM,
    ...style,
  };

  const spinnerStyle: React.CSSProperties = {
    animation: 'spin 1s linear infinite',
  };

  return (
    <>
      <Button
        type={type}
        htmlType={htmlType}
        onClick={onClick}
        disabled={disabled || loading}
        block={block}
        size={size}
        style={buttonStyle}
        icon={loading ? <LoadingOutlined style={spinnerStyle} /> : icon}
      >
        {loading ? 'Please wait...' : children}
      </Button>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

