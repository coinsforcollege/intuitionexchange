'use client';

import React from 'react';
import { theme } from 'antd';

const { useToken } = theme;

interface SuccessAnimationProps {
  size?: number;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ size = 120 }) => {
  const { token } = useToken();

  return (
    <div
      style={{
        width: size,
        height: size,
        margin: '0 auto',
      }}
    >
      <svg
        viewBox="0 0 52 52"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {/* Circle */}
        <circle
          cx="26"
          cy="26"
          r="25"
          fill="none"
          stroke={token.colorSuccess}
          strokeWidth="2"
          style={{
            strokeDasharray: '166',
            strokeDashoffset: '166',
            animation: 'success-circle 0.6s ease-in-out forwards',
          }}
        />
        {/* Checkmark */}
        <path
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
          fill="none"
          stroke={token.colorSuccess}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: '48',
            strokeDashoffset: '48',
            animation: 'success-check 0.3s ease-in-out 0.4s forwards',
          }}
        />
        <style jsx>{`
          @keyframes success-circle {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes success-check {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
      </svg>
    </div>
  );
};

export default SuccessAnimation;

