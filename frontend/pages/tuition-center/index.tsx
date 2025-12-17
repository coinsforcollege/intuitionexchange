import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { theme, Grid, Progress } from 'antd';
import { motion } from 'motion/react';
import {
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  PieChartOutlined,
  BankOutlined,
  LockOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  emoji: string;
  progress: number;
  lessons: number;
  duration: string;
  difficulty: 'Beginner' | 'Easy' | 'Intermediate';
  comingSoon?: boolean;
}

const learningModules: LearningModule[] = [
  {
    id: 'kyc-101',
    title: 'KYC 101',
    description: 'Learn why we verify your identity and how it keeps your money safe!',
    icon: <SafetyCertificateOutlined />,
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #6EE7B7 100%)',
    emoji: '🛡️',
    progress: 0,
    lessons: 4,
    duration: '10 min',
    difficulty: 'Beginner',
  },
  {
    id: 'customer-support',
    title: 'Getting Help',
    description: 'Discover how to contact our friendly support team when you need assistance.',
    icon: <CustomerServiceOutlined />,
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%)',
    emoji: '💬',
    progress: 0,
    lessons: 3,
    duration: '8 min',
    difficulty: 'Beginner',
  },
  {
    id: 'portfolio-basics',
    title: 'Your Portfolio',
    description: 'Understand what your portfolio shows and how to read your investments.',
    icon: <PieChartOutlined />,
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FCD34D 100%)',
    emoji: '📊',
    progress: 0,
    lessons: 5,
    duration: '15 min',
    difficulty: 'Easy',
  },
  {
    id: 'savings-101',
    title: 'Savings 101',
    description: 'Learn the magic of saving money and watch it grow over time!',
    icon: <BankOutlined />,
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 50%, #F9A8D4 100%)',
    emoji: '🐷',
    progress: 0,
    lessons: 6,
    duration: '12 min',
    difficulty: 'Beginner',
  },
  {
    id: 'security-tips',
    title: 'Stay Safe Online',
    description: 'Important tips to protect your account and keep hackers away!',
    icon: <LockOutlined />,
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 50%, #FCA5A5 100%)',
    emoji: '🔐',
    progress: 0,
    lessons: 4,
    duration: '10 min',
    difficulty: 'Easy',
  },
  {
    id: 'crypto-adventure',
    title: 'Crypto Adventure',
    description: 'Explore the exciting world of digital currencies in a fun way!',
    icon: <RocketOutlined />,
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 50%, #67E8F9 100%)',
    emoji: '🚀',
    progress: 0,
    lessons: 8,
    duration: '20 min',
    difficulty: 'Intermediate',
    comingSoon: true,
  },
];

export default function TuitionCenterPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user, isLoading } = useAuth();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);

  const isDark = mode === 'dark';
  const isMobile = mounted ? !screens.md : false;
  const isTablet = mounted ? screens.md && !screens.lg : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/tuition-center');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10B981';
      case 'Easy':
        return '#F59E0B';
      case 'Intermediate':
        return '#8B5CF6';
      default:
        return token.colorTextSecondary;
    }
  };

  return (
    <>
      <Head>
        <title>Tuition Center - InTuition Exchange</title>
        <meta name="description" content="Learn about investing and finance in a fun way!" />
      </Head>

      <DashboardLayout activeKey="tuition-center">
        {/* Page Header with Progress Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: token.marginLG,
            flexWrap: 'wrap',
            gap: token.marginSM,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
            <span style={{ fontSize: 28 }}>🎒</span>
            <h1
              style={{
                fontSize: isMobile ? token.fontSizeLG : token.fontSizeHeading4,
                fontWeight: fontWeights.bold,
                color: token.colorText,
                margin: 0,
              }}
            >
              Tuition Center
            </h1>
          </div>
          
          {/* Progress Stats */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: token.marginSM,
            }}
          >
            {[
              { value: '0', label: 'done', emoji: '✅' },
              { value: '0m', label: 'spent', emoji: '⏱️' },
              { value: '0', label: 'streak', emoji: '🔥' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: `${token.paddingXXS}px ${token.paddingSM}px`,
                  background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  borderRadius: token.borderRadiusSM,
                  fontSize: token.fontSizeSM,
                }}
              >
                <span>{stat.emoji}</span>
                <span style={{ color: token.colorText, fontWeight: fontWeights.medium }}>
                  {stat.value}
                </span>
                {!isMobile && (
                  <span style={{ color: token.colorTextSecondary }}>{stat.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Learning Modules List - Colorful Glass Cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: token.marginSM,
          }}
        >
          {learningModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={module.comingSoon ? {} : { scale: 1.01, x: 4 }}
              whileTap={module.comingSoon ? {} : { scale: 0.99 }}
              onClick={() => {
                if (!module.comingSoon) {
                  console.log('Opening module:', module.id);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: token.marginMD,
                padding: isMobile ? token.paddingSM : token.paddingMD,
                background: isDark 
                  ? `linear-gradient(135deg, ${module.color}15 0%, rgba(255, 255, 255, 0.03) 100%)`
                  : `linear-gradient(135deg, ${module.color}12 0%, rgba(255, 255, 255, 0.9) 100%)`,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: token.borderRadius,
                border: `1px solid ${isDark ? `${module.color}30` : `${module.color}25`}`,
                borderLeft: `4px solid ${module.color}`,
                cursor: module.comingSoon ? 'default' : 'pointer',
                opacity: module.comingSoon ? 0.5 : 1,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Icon with vibrant color accent */}
              <div
                style={{
                  width: isMobile ? 44 : 52,
                  height: isMobile ? 44 : 52,
                  borderRadius: token.borderRadius,
                  background: isDark 
                    ? `linear-gradient(135deg, ${module.color}40 0%, ${module.color}25 100%)`
                    : `linear-gradient(135deg, ${module.color}30 0%, ${module.color}15 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? 22 : 26,
                  flexShrink: 0,
                  boxShadow: isDark 
                    ? `0 4px 12px ${module.color}20`
                    : `0 4px 12px ${module.color}25`,
                }}
              >
                {module.emoji}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: token.marginXS, marginBottom: 2 }}>
                  <h3
                    style={{
                      fontSize: isMobile ? token.fontSize : token.fontSizeLG,
                      fontWeight: fontWeights.bold,
                      color: isDark ? token.colorText : module.color,
                      margin: 0,
                    }}
                  >
                    {module.title}
                  </h3>
                  {module.comingSoon && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: fontWeights.bold,
                        color: '#ffffff',
                        background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                        padding: '2px 8px',
                        borderRadius: 10,
                      }}
                    >
                      SOON
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: token.fontSizeSM,
                    color: token.colorTextSecondary,
                    margin: 0,
                    whiteSpace: isMobile ? 'normal' : 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {module.description}
                </p>
              </div>

              {/* Meta info */}
              <div
                style={{
                  display: isMobile ? 'none' : 'flex',
                  alignItems: 'center',
                  gap: token.marginLG,
                  flexShrink: 0,
                }}
              >
                {/* Difficulty */}
                <span
                  style={{
                    fontSize: token.fontSizeSM,
                    color: isDark ? `${getDifficultyColor(module.difficulty)}CC` : getDifficultyColor(module.difficulty),
                    fontWeight: fontWeights.medium,
                  }}
                >
                  {module.difficulty}
                </span>

                {/* Duration */}
                <span
                  style={{
                    fontSize: token.fontSizeSM,
                    color: token.colorTextSecondary,
                    minWidth: 50,
                  }}
                >
                  {module.duration}
                </span>

                {/* Progress or Start */}
                <div style={{ width: 100 }}>
                  {module.progress > 0 ? (
                    <Progress
                      percent={module.progress}
                      size="small"
                      strokeColor={isDark ? `${module.color}AA` : module.color}
                      trailColor={isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'}
                      style={{ marginBottom: 0 }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: token.fontSizeSM,
                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : token.colorTextSecondary,
                      }}
                    >
                      Not started
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              {!module.comingSoon && (
                <div
                  style={{
                    fontSize: token.fontSize,
                    color: token.colorTextSecondary,
                    flexShrink: 0,
                  }}
                >
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mr. Purple Mascot - Fixed bottom right (transparent WebM) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            position: 'fixed',
            bottom: isMobile ? 100 : 24, // Above mobile nav bar
            right: isMobile ? 8 : 24,
            zIndex: 100,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              height: 150,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          >
            {/* WebM with alpha channel for true transparency */}
            <source src="/images/mr-purple-main.webm" type="video/webm" />
            {/* MP4 fallback for browsers that don't support WebM */}
            <source src="/images/mr-purple-main.mp4" type="video/mp4" />
          </video>
          {/* Shadow for the character to stand on */}
          <div
            style={{
              width: 120,
              height: 20,
              marginTop: -13,
              background: isDark 
                ? 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)'
                : 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0) 70%)',
              borderRadius: '50%',
            }}
          />
        </motion.div>
      </DashboardLayout>
    </>
  );
}

