import { Grid, theme } from "antd";
import {
  BulbOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  BookOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { motion } from "motion/react";
import { MAX_CONTENT_WIDTH } from "../layout/Header";
import { fontWeights } from "@/theme/themeConfig";
import { useThemeMode } from "@/context/ThemeContext";

const { useToken } = theme;
const { useBreakpoint } = Grid;

const bulletPoints = [
  {
    icon: <BulbOutlined />,
    title: "Interactive Learning Mode",
    description: "Practice trading with zero risk using simulated trades.",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Safe Space to Learn",
    description: "Make mistakes without consequences. Build confidence first.",
  },
  {
    icon: <BookOutlined />,
    title: "Crypto 101 Built-In",
    description: "Guided tutorials explain features as you use them.",
  },
  {
    icon: <RocketOutlined />,
    title: "Graduate to Real Trading",
    description: "Seamlessly switch to live trading when you're ready.",
  },
];

export default function LearningSection() {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const isDark = mode === "dark";
  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  return (
    <section
      style={{
        padding: `${token.paddingXL * 3}px ${token.paddingLG}px`,
        position: "relative",
        overflow: "hidden",
        background: isDark
          ? `linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)`
          : `linear-gradient(180deg, #f1f5f9 0%, #e0e7ff 50%, #f1f5f9 100%)`,
      }}
    >
      <div
        style={{
          maxWidth: MAX_CONTENT_WIDTH,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Layout: Content left, Images right on desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1.1fr 0.9fr",
            gap: isMobile ? token.marginXL * 2 : token.marginXL * 3,
            alignItems: "center",
          }}
        >
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 50,
                marginBottom: token.marginLG,
                background: isDark
                  ? "rgba(139, 92, 246, 0.15)"
                  : "rgba(139, 92, 246, 0.1)",
                border: isDark
                  ? "1px solid rgba(139, 92, 246, 0.3)"
                  : "1px solid rgba(139, 92, 246, 0.2)",
              }}
            >
              <BulbOutlined style={{ color: "#8b5cf6", fontSize: 16 }} />
              <span
                style={{
                  color: "#8b5cf6",
                  fontWeight: fontWeights.semibold,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Financial Literacy
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontSize: isMobile ? 32 : isTablet ? 36 : 44,
                fontWeight: 800,
                marginBottom: token.marginMD,
                color: isDark ? "#ffffff" : "#0f172a",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Learn Before You
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Leap Into Crypto
              </span>
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontSize: isMobile ? 15 : 17,
                color: isDark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.7)",
                lineHeight: 1.7,
                marginBottom: token.marginXL,
                maxWidth: 480,
              }}
            >
              We believe everyone deserves to understand their money. Whether
              you're a student taking your first financial steps or an adult
              exploring crypto for the first time, our Learning Mode makes
              finance accessible.
            </motion.p>

            {/* Bullet Points - No Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: token.marginLG }}>
              {bulletPoints.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: token.marginMD,
                  }}
                >
                  {/* 3D Icon */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      color: "#ffffff",
                      position: "relative",
                      background: `linear-gradient(145deg, #8b5cf6 0%, #6d28d9 50%, #5b21b6 100%)`,
                      boxShadow: `
                        4px 4px 12px ${isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.15)"},
                        -2px -2px 8px ${isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.15)"},
                        inset 2px 2px 4px rgba(255,255,255,0.2),
                        inset -2px -2px 4px rgba(0,0,0,0.2)
                      `,
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                    }}
                  >
                    {item.icon}
                    {/* Shine */}
                    <div
                      style={{
                        position: "absolute",
                        top: 6,
                        left: 8,
                        width: 12,
                        height: 8,
                        borderRadius: "50%",
                        background:
                          "radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 70%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <h4
                      style={{
                        fontSize: isMobile ? 16 : 17,
                        fontWeight: fontWeights.bold,
                        color: isDark ? "#ffffff" : "#0f172a",
                        marginBottom: 4,
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: isMobile ? 14 : 15,
                        color: isDark ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Finance Learning Abacus Image */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
              }}
            >
              <Image
                src="/images/finance-learning-3d-no-bg.png"
                alt="Financial Learning"
                width={isMobile ? 280 : isTablet ? 400 : 600}
                height={isMobile ? 280 : isTablet ? 400 : 600}
                style={{
                  objectFit: "contain",
                  filter: isDark
                    ? "drop-shadow(0 20px 40px rgba(139, 92, 246, 0.2))"
                    : "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                }}
              />
            </div>

            {/* Mr Purple Mascot */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                position: "absolute",
                bottom: isMobile ? -20 : -10,
                right: isMobile ? -10 : isTablet ? 0 : 20,
                zIndex: 3,
              }}
            >
              <Image
                src="/images/mr-purple.png"
                alt="Mr Purple - Your Learning Guide"
                width={isMobile ? 140 : isTablet ? 160 : 200}
                height={isMobile ? 175 : isTablet ? 200 : 250}
                style={{
                  objectFit: "contain",
                  filter: isDark
                    ? "drop-shadow(0 16px 32px rgba(139, 92, 246, 0.3))"
                    : "drop-shadow(0 16px 32px rgba(0,0,0,0.2))",
                }}
              />
              {/* Speech Bubble with Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.8,
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
                style={{
                  position: "absolute",
                  top: isMobile ? -10 : -20,
                  left: isMobile ? -50 : -80,
                  transformOrigin: "bottom right",
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 16,
                    borderBottomRightRadius: 4,
                    background: isDark
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.98)",
                    boxShadow: `
                      4px 4px 16px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.12)"},
                      inset 1px 1px 4px rgba(255,255,255,0.5)
                    `,
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: isMobile ? 11 : 13,
                      fontWeight: fontWeights.semibold,
                      color: "#5b21b6",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Let's learn together! 📚
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Decorative glow behind images */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: isMobile ? 200 : 300,
                height: isMobile ? 200 : 300,
                borderRadius: "50%",
                background: isDark
                  ? "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

