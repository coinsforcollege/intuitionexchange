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
  colorLight: string;
  colorDark: string;
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
    colorLight: '#6EE7B7',
    colorDark: '#047857',
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
    colorLight: '#C4B5FD',
    colorDark: '#5B21B6',
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
    colorLight: '#FCD34D',
    colorDark: '#B45309',
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
    colorLight: '#F9A8D4',
    colorDark: '#9D174D',
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
    colorLight: '#FCA5A5',
    colorDark: '#991B1B',
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
    colorLight: '#67E8F9',
    colorDark: '#0E7490',
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
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const isDark = mode === 'dark';
  const isMobile = mounted ? !screens.md : false;
  const isTablet = mounted ? screens.md && !screens.lg : false;

  useEffect(() => {
    setMounted(true);
    // Load completed modules from localStorage
    const completed = JSON.parse(localStorage.getItem('completedModules') || '[]');
    setCompletedModules(completed);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/tuition-center');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Tuition Center - InTuition Exchange</title>
        <meta name="description" content="Learn about investing and finance in a fun way!" />
      </Head>

      <DashboardLayout activeKey="tuition-center">
        {/* Page Header */}
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
            <span style={{ fontSize: isMobile ? 32 : 40 }}>🎓</span>
            <h1
              style={{
                fontSize: isMobile ? token.fontSizeHeading4 : token.fontSizeHeading3,
                fontWeight: fontWeights.bold,
                color: token.colorText,
                margin: 0,
              }}
            >
              Tuition Center
            </h1>
          </div>
          
          {/* Progress - simple text */}
          <span style={{
            fontSize: token.fontSize,
            color: token.colorTextSecondary,
          }}>
            {completedModules.length}/{learningModules.length} completed
          </span>
        </div>

        {/* Learning Modules - Claymorphic Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
            gap: isMobile ? token.marginMD : token.marginLG,
          }}
        >
          {learningModules.map((module, index) => {
            // Only KYC-101 is active for now
            const isActive = module.id === 'kyc-101';
            const isDisabled = module.comingSoon || !isActive;
            
            return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={isDisabled ? {} : { y: -4 }}
              whileTap={isDisabled ? {} : { scale: 0.98 }}
              onClick={() => {
                if (isActive) {
                  router.push('/tuition-center/kyc-101');
                }
              }}
              style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.45 : 1,
                filter: isDisabled ? 'grayscale(90%) brightness(0.85)' : 'none',
                position: 'relative',
              }}
            >
              {/* Claymorphic Card */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: 24,
                  padding: isMobile ? token.paddingMD : token.paddingLG,
                  // Base color gradient - adjusted for dark/light mode
                  background: isDark
                    ? `linear-gradient(145deg, ${module.color}90 0%, ${module.colorDark} 50%, ${module.colorDark}dd 100%)`
                    : `linear-gradient(135deg, ${module.colorLight}ee 0%, ${module.color} 35%, ${module.colorDark} 100%)`,
                  // Outer shadow - adjusted for dark mode
                  boxShadow: isDark
                    ? `
                      6px 6px 16px rgba(0,0,0,0.5),
                      -3px -3px 10px ${module.color}25,
                      inset 2px 2px 6px ${module.color}40,
                      inset -2px -2px 6px rgba(0,0,0,0.3)
                    `
                    : `
                      10px 10px 30px ${module.colorDark}90,
                      -6px -6px 20px rgba(255,255,255,0.7),
                      inset 4px 4px 12px rgba(255,255,255,0.35),
                      inset -4px -4px 12px ${module.colorDark}60
                    `,
                  // Beveled edge
                  border: isDark 
                    ? `1px solid ${module.color}50`
                    : `1px solid rgba(255,255,255,0.5)`,
                  overflow: 'hidden',
                }}
              >
                {/* Coming Soon Overlay for disabled modules */}
                {isDisabled && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: token.fontSizeSM,
                      fontWeight: fontWeights.bold,
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      zIndex: 10,
                    }}
                  >
                    🔒 Soon
                  </div>
                )}
                {/* Content */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: token.marginMD,
                    marginBottom: token.marginMD,
                  }}
                >
                  {/* Emoji - raised clay button */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      // Raised button gradient - darker in dark mode
                      background: isDark
                        ? `linear-gradient(145deg, #3a3a45 0%, #2a2a35 50%, #1f1f28 100%)`
                        : `linear-gradient(135deg, #ffffff 0%, #f8f8f8 30%, #e8e8e8 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 32,
                      flexShrink: 0,
                      // Inner highlight, outer shadow for puffy look
                      boxShadow: isDark
                        ? `
                          4px 4px 10px rgba(0,0,0,0.4),
                          -2px -2px 6px ${module.color}20,
                          inset 2px 2px 4px rgba(255,255,255,0.08),
                          inset -2px -2px 4px rgba(0,0,0,0.3)
                        `
                        : `
                          6px 6px 14px ${module.colorDark}70,
                          -3px -3px 10px rgba(255,255,255,0.8),
                          inset 3px 3px 6px rgba(255,255,255,0.95),
                          inset -3px -3px 6px rgba(0,0,0,0.12)
                        `,
                      border: isDark 
                        ? `1px solid rgba(255,255,255,0.1)`
                        : `1px solid rgba(255,255,255,0.9)`,
                    }}
                  >
                    {module.emoji}
                  </div>
                  
                  {/* Text - light color for contrast on colored bg */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: token.marginXS, marginBottom: 4 }}>
                      <h3
                        style={{
                          fontSize: token.fontSizeHeading5,
                          fontWeight: fontWeights.bold,
                          color: '#ffffff',
                          margin: 0,
                          textShadow: isDark 
                            ? `1px 1px 2px ${module.colorDark}`
                            : `0 1px 3px rgba(0,0,0,0.4), 0 2px 6px ${module.colorDark}80`,
                        }}
                      >
                        {module.title}
                      </h3>
                      {module.comingSoon && (
                        <span
                          style={{
                            fontSize: token.fontSizeSM,
                            fontWeight: fontWeights.bold,
                            color: isDark ? '#ffffff' : module.colorDark,
                            background: isDark
                              ? `linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))`
                              : `linear-gradient(145deg, #ffffff, #f0f0f0)`,
                            padding: '3px 10px',
                            borderRadius: 12,
                            boxShadow: isDark
                              ? `
                                2px 2px 4px rgba(0,0,0,0.3),
                                inset 1px 1px 2px rgba(255,255,255,0.1)
                              `
                              : `
                                2px 2px 4px ${module.colorDark}40,
                                inset 1px 1px 2px rgba(255,255,255,0.8)
                              `,
                          }}
                        >
                          Soon
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: token.fontSize,
                        color: '#ffffff',
                        margin: 0,
                        lineHeight: 1.5,
                        textShadow: isDark
                          ? `0 1px 2px ${module.colorDark}40`
                          : `0 1px 2px rgba(0,0,0,0.3), 0 2px 4px ${module.colorDark}60`,
                      }}
                    >
                      {module.description}
                    </p>
                  </div>
                </div>

                {/* Footer - recessed panel */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: `${token.paddingSM}px ${token.paddingMD}px`,
                    borderRadius: 12,
                    // Recessed look - adjusted for dark mode
                    background: isDark
                      ? `linear-gradient(145deg, rgba(0,0,0,0.3), rgba(0,0,0,0.4))`
                      : `linear-gradient(145deg, ${module.colorDark}70, ${module.colorDark}90)`,
                    boxShadow: isDark
                      ? `
                        inset 2px 2px 6px rgba(0,0,0,0.4),
                        inset -1px -1px 3px ${module.color}15
                      `
                      : `
                        inset 3px 3px 10px ${module.colorDark}80,
                        inset -2px -2px 6px ${module.colorLight}20
                      `,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: token.marginMD }}>
                    {/* Difficulty pill - raised */}
                    <span
                      style={{
                        fontSize: token.fontSize,
                        fontWeight: fontWeights.bold,
                        color: isDark ? '#ffffff' : module.colorDark,
                        padding: '4px 12px',
                        background: isDark
                          ? `linear-gradient(145deg, ${module.color}80, ${module.color}60)`
                          : `linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)`,
                        borderRadius: 20,
                        boxShadow: isDark
                          ? `
                            2px 2px 4px rgba(0,0,0,0.3),
                            inset 1px 1px 2px ${module.colorLight}20
                          `
                          : `
                            3px 3px 8px ${module.colorDark}60,
                            -2px -2px 6px rgba(255,255,255,0.6),
                            inset 2px 2px 4px rgba(255,255,255,0.9),
                            inset -1px -1px 3px rgba(0,0,0,0.08)
                          `,
                        border: isDark ? 'none' : '1px solid rgba(255,255,255,0.8)',
                      }}
                    >
                      {module.difficulty}
                    </span>
                    <span style={{ 
                      fontSize: token.fontSize, 
                      color: '#ffffff',
                      textShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                    }}>
                      ⏱️ {module.duration}
                    </span>
                    <span style={{ 
                      fontSize: token.fontSize, 
                      color: '#ffffff',
                      textShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                    }}>
                      📚 {module.lessons}
                    </span>
                  </div>

                  {module.progress > 0 ? (
                    <div style={{ width: 80 }}>
                      <Progress
                        percent={module.progress}
                        size="small"
                        strokeColor="#ffffff"
                        trailColor="rgba(255,255,255,0.2)"
                        style={{ marginBottom: 0 }}
                      />
                    </div>
                  ) : !module.comingSoon ? (
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        // Raised button - adjusted for dark mode
                        background: isDark
                          ? `linear-gradient(145deg, ${module.color}90 0%, ${module.colorDark} 100%)`
                          : `linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDark ? '#ffffff' : module.colorDark,
                        fontSize: token.fontSizeLG,
                        fontWeight: fontWeights.bold,
                        boxShadow: isDark
                          ? `
                            3px 3px 8px rgba(0,0,0,0.4),
                            -1px -1px 4px ${module.color}30,
                            inset 1px 1px 3px ${module.colorLight}20,
                            inset -1px -1px 2px rgba(0,0,0,0.2)
                          `
                          : `
                            4px 4px 12px ${module.colorDark}70,
                            -2px -2px 8px rgba(255,255,255,0.7),
                            inset 2px 2px 5px rgba(255,255,255,0.95),
                            inset -2px -2px 4px rgba(0,0,0,0.1)
                          `,
                        border: isDark ? 'none' : '1px solid rgba(255,255,255,0.8)',
                      }}
                    >
                      →
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
          })}
        </div>

        {/* Mr. Purple Mascot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            position: 'fixed',
            bottom: isMobile ? 110 : 32,
            right: isMobile ? 12 : 32,
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
              height: isMobile ? 100 : 140,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          >
            <source src="/images/mr-purple-explaining.webm" type="video/webm" />
            <source src="/images/mr-purple-explaining.mp4" type="video/mp4" />
          </video>
          <div
            style={{
              width: isMobile ? 80 : 100,
              height: 16,
              marginTop: -10,
              background: isDark 
                ? 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.12) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
        </motion.div>
      </DashboardLayout>
    </>
  );
}
