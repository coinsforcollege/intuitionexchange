import { Button, Space, Typography, theme } from "antd";
import {
  RocketOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { MAX_CONTENT_WIDTH } from "../layout/Header";
import { fontWeights } from "@/theme/themeConfig";

const { Title, Text } = Typography;
const { useToken } = theme;

const stats = [
  { value: "$2B+", label: "Trading Volume" },
  { value: "50+", label: "College Coins" },
  { value: "100K+", label: "Users" },
  { value: "0.1%", label: "Trading Fee" },
];

export default function HeroSection() {
  const { token } = useToken();

  const sectionStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: `${token.paddingXL * 2}px ${token.paddingLG}px`,
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: MAX_CONTENT_WIDTH,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: token.zIndexBase + 1,
  };

  const gradientOverlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(ellipse at 50% 0%, ${token.colorPrimaryBg} 0%, transparent 60%)`,
    pointerEvents: "none",
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: token.marginXS,
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderRadius: token.borderRadiusLG,
    backgroundColor: token.colorSuccessBg,
    color: token.colorSuccess,
    fontSize: token.fontSize,
    fontWeight: fontWeights.normal,
    marginBottom: token.marginLG,
  };

  const headingStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading1,
    fontWeight: fontWeights.bold,
    lineHeight: token.lineHeightHeading1,
    marginBottom: token.marginMD,
    color: token.colorText,
  };

  const highlightStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading4,
    color: token.colorTextSecondary,
    marginBottom: token.marginXL,
    lineHeight: token.lineHeightLG,
  };

  const statsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: token.marginXL,
    marginTop: token.marginXL,
    padding: token.paddingLG,
    borderRadius: token.borderRadiusLG,
    backgroundColor: token.colorBgContainer,
    border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
  };

  const statItemStyle: React.CSSProperties = {
    textAlign: "center",
    minWidth: token.controlHeightLG * 3,
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading2,
    fontWeight: fontWeights.bold,
    color: token.colorPrimary,
    display: "block",
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: token.fontSizeLG,
    color: token.colorTextSecondary,
  };

  const featurePillsStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: token.marginSM,
    marginTop: token.marginXL,
  };

  const featurePillStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: token.marginXS,
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderRadius: token.borderRadiusLG,
    backgroundColor: token.colorBgContainer,
    border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
    color: token.colorTextSecondary,
    fontSize: token.fontSize,
  };

  const buttonStyle: React.CSSProperties = {
    height: token.controlHeightLG + token.marginXS,
    paddingInline: token.paddingLG,
    fontSize: token.fontSizeLG,
    fontWeight: fontWeights.semibold,
  };

  return (
    <section style={sectionStyle}>
      <div style={gradientOverlayStyle} />
      <div style={containerStyle}>
        {/* Badge */}
        <div style={badgeStyle}>
          <ThunderboltOutlined />
          Now Live: TUIT Token Trading
        </div>

        {/* Heading */}
        <Title level={1} style={headingStyle}>
          The Campus For{" "}
          <span style={highlightStyle}>College Coins</span>
        </Title>

        {/* Subtitle */}
        <Text style={subtitleStyle}>
          Trade university-issued College Coins for tuition, living expenses, or liquidity.
          Swap between TUIT and major cryptocurrencies like BTC, ETH, and USDT with instant
          settlement and transparent pricing.
        </Text>

        {/* CTA Buttons */}
        <Space size="middle" wrap>
          <Link href="/register">
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              style={buttonStyle}
            >
              Start Trading
            </Button>
          </Link>
          <Button
            size="large"
            icon={<ArrowRightOutlined />}
            style={{
              ...buttonStyle,
              borderColor: token.colorBorder,
            }}
          >
            Learn More
          </Button>
        </Space>

        {/* Feature Pills */}
        <div style={featurePillsStyle}>
          <div style={featurePillStyle}>
            <SafetyCertificateOutlined style={{ color: token.colorSuccess }} />
            Bank-Grade Security
          </div>
          <div style={featurePillStyle}>
            <ThunderboltOutlined style={{ color: token.colorWarning }} />
            Instant Settlement
          </div>
          <div style={featurePillStyle}>
            <GlobalOutlined style={{ color: token.colorPrimary }} />
            50+ College Coins
          </div>
        </div>

        {/* Stats */}
        <div style={statsContainerStyle}>
          {stats.map((stat) => (
            <div key={stat.label} style={statItemStyle}>
              <span style={statValueStyle}>{stat.value}</span>
              <Text style={statLabelStyle}>{stat.label}</Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
