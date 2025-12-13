'use client';

import React from 'react';
import { theme } from 'antd';

const { useToken } = theme;

interface LoadingAnimationProps {
  size?: number;
  text?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  size = 80,
  text = 'Verifying...'
}) => {
  const { token } = useToken();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: token.marginLG,
      }}
    >
      {/* Animated circles */}
      <div
        style={{
          width: size,
          height: size,
          position: 'relative',
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: `3px solid ${token.colorPrimaryBg}`,
            borderTopColor: token.colorPrimary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        {/* Middle ring */}
        <div
          style={{
            position: 'absolute',
            inset: size * 0.15,
            border: `3px solid ${token.colorPrimaryBg}`,
            borderTopColor: token.colorPrimary,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite reverse',
          }}
        />
        {/* Inner ring */}
        <div
          style={{
            position: 'absolute',
            inset: size * 0.3,
            border: `3px solid ${token.colorPrimaryBg}`,
            borderTopColor: token.colorPrimary,
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            inset: size * 0.42,
            backgroundColor: token.colorPrimary,
            borderRadius: '50%',
            animation: 'pulse 1s ease-in-out infinite',
          }}
        />
      </div>

      {/* Text */}
      {text && (
        <span
          style={{
            fontSize: token.fontSizeLG,
            color: token.colorTextSecondary,
            animation: 'fade 1.5s ease-in-out infinite',
          }}
        >
          {text}
        </span>
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.8);
            opacity: 0.7;
          }
        }
        @keyframes fade {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;

