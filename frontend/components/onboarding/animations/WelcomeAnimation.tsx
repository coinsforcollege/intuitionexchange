'use client';

import React, { useEffect, useState } from 'react';
import { theme } from 'antd';
import { SafetyCertificateOutlined, IdcardOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { useToken } = theme;

const WelcomeAnimation: React.FC = () => {
  const { token } = useToken();
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const iconSize = 48;
  const icons = [
    { Icon: IdcardOutlined, delay: 0, x: -60, y: -40 },
    { Icon: SafetyCertificateOutlined, delay: 0.1, x: 60, y: -40 },
    { Icon: UserOutlined, delay: 0.2, x: -60, y: 40 },
    { Icon: CheckCircleOutlined, delay: 0.3, x: 60, y: 40 },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: 200,
        height: 200,
        margin: '0 auto',
      }}
    >
      {/* Central shield */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${isAnimated ? 1 : 0})`,
          width: 80,
          height: 80,
          backgroundColor: token.colorPrimaryBg,
          borderRadius: token.borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <SafetyCertificateOutlined
          style={{
            fontSize: 40,
            color: token.colorPrimary,
          }}
        />
      </div>

      {/* Floating icons */}
      {icons.map(({ Icon, delay, x, y }, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${isAnimated ? x : 0}px), calc(-50% + ${isAnimated ? y : 0}px))`,
            opacity: isAnimated ? 1 : 0,
            transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
          }}
        >
          <div
            style={{
              width: iconSize,
              height: iconSize,
              backgroundColor: token.colorBgContainer,
              borderRadius: token.borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${token.colorBorderSecondary}`,
              animation: isAnimated ? `float ${2 + index * 0.2}s ease-in-out infinite ${delay}s` : 'none',
            }}
          >
            <Icon
              style={{
                fontSize: 24,
                color: token.colorPrimary,
              }}
            />
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeAnimation;

