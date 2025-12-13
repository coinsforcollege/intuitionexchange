'use client';

import React from 'react';
import { theme } from 'antd';
import { fontWeights } from '@/theme/themeConfig';

const { useToken } = theme;

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
}) => {
  const { token } = useToken();
  const accentColor = color || token.colorPrimary;

  const cardStyle: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    padding: token.paddingLG,
    display: 'flex',
    alignItems: 'center',
    gap: token.marginLG,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: token.controlHeightLG * 1.2,
    height: token.controlHeightLG * 1.2,
    borderRadius: token.borderRadius,
    backgroundColor: `${accentColor}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: accentColor,
    fontSize: token.fontSizeXL,
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'hidden',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: token.fontSizeLG,
    fontWeight: fontWeights.semibold,
    color: token.colorText,
    marginBottom: token.marginXS / 2,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    color: token.colorTextSecondary,
  };

  const arrowStyle: React.CSSProperties = {
    fontSize: token.fontSizeLG,
    color: token.colorTextSecondary,
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = token.colorBgTextHover;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = token.colorBgContainer;
      }}
    >
      <div style={iconContainerStyle}>{icon}</div>
      <div style={contentStyle}>
        <div style={titleStyle}>{title}</div>
        <div style={descriptionStyle}>{description}</div>
      </div>
      {onClick && <span style={arrowStyle}>→</span>}
    </div>
  );
};

export default ActionCard;

