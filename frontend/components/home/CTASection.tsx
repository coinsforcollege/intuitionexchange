import { Button, Space, Typography, theme } from "antd";
import { RocketOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { MAX_CONTENT_WIDTH } from "../layout/Header";
import { fontWeights } from "@/theme/themeConfig";

const { Title, Text } = Typography;
const { useToken } = theme;

export default function CTASection() {
  const { token } = useToken();

  const sectionStyle: React.CSSProperties = {
    padding: `${token.paddingXL * 2}px ${token.paddingLG}px`,
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  };

  const gradientBgStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorSuccessBg} 50%, ${token.colorWarningBg} 100%)`,
    pointerEvents: "none",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: MAX_CONTENT_WIDTH,
    margin: "0 auto",
    position: "relative",
    zIndex: token.zIndexBase + 1,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading2,
    fontWeight: fontWeights.bold,
    marginBottom: token.marginMD,
    color: token.colorText,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: token.fontSizeLG,
    color: token.colorTextSecondary,
    marginBottom: token.marginXL,
    lineHeight: token.lineHeightLG,
    display: "block",
  };

  const highlightBoxStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: token.marginSM,
    padding: `${token.paddingSM}px ${token.paddingMD}px`,
    borderRadius: token.borderRadiusLG,
    backgroundColor: token.colorBgContainer,
    border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
    marginBottom: token.marginXL,
  };

  const buttonStyle: React.CSSProperties = {
    height: token.controlHeightLG + token.marginXS,
    paddingInline: token.paddingLG,
    fontSize: token.fontSizeLG,
    fontWeight: fontWeights.semibold,
  };

  return (
    <section style={sectionStyle}>
      <div style={gradientBgStyle} />
      <div style={containerStyle}>
        {/* Highlight */}
        <div style={highlightBoxStyle}>
          <Text style={{ color: token.colorText, fontWeight: fontWeights.medium }}>
            Join 100,000+ students & parents already using InTuition
          </Text>
        </div>

        {/* Title */}
        <Title level={2} style={titleStyle}>
          Ready to Start Your College Coin Journey?
        </Title>

        {/* Subtitle */}
        <Text style={subtitleStyle}>
          Create your free account today and start trading College Coins with
          the most trusted exchange platform for higher education.
        </Text>

        {/* CTA Buttons */}
        <Space size="middle" wrap style={{ justifyContent: "center" }}>
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            style={buttonStyle}
          >
            Create Free Account
          </Button>
          <Button
            size="large"
            icon={<ArrowRightOutlined />}
            style={{
              ...buttonStyle,
              borderColor: token.colorBorder,
            }}
          >
            Contact Sales
          </Button>
        </Space>
      </div>
    </section>
  );
}
