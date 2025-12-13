import { Row, Col, Typography, theme } from "antd";
import {
  SwapOutlined,
  WalletOutlined,
  SafetyCertificateOutlined,
  LineChartOutlined,
  GlobalOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { MAX_CONTENT_WIDTH } from "../layout/Header";
import { fontWeights } from "@/theme/themeConfig";

const { Title, Text } = Typography;
const { useToken } = theme;

const features = [
  {
    icon: <SwapOutlined />,
    title: "Instant Swaps",
    description: "Exchange College Coins for major cryptocurrencies in seconds with competitive rates and zero hidden fees.",
    colorType: "primary" as const,
  },
  {
    icon: <WalletOutlined />,
    title: "Secure Wallet",
    description: "Store your TUIT and other tokens safely with our multi-signature wallet infrastructure and cold storage.",
    colorType: "success" as const,
  },
  {
    icon: <LineChartOutlined />,
    title: "Real-Time Markets",
    description: "Track live prices, charts, and market data for all College Coins with professional trading tools.",
    colorType: "warning" as const,
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Bank-Grade Security",
    description: "Your assets are protected with industry-leading security measures, 2FA, and regular audits.",
    colorType: "error" as const,
  },
  {
    icon: <GlobalOutlined />,
    title: "50+ College Coins",
    description: "Access tokens from universities nationwide. Trade, hold, or redeem for tuition credits.",
    colorType: "primary" as const,
  },
  {
    icon: <CustomerServiceOutlined />,
    title: "24/7 Support",
    description: "Our dedicated support team is always ready to help you with any questions or issues.",
    colorType: "success" as const,
  },
];

export default function FeaturesSection() {
  const { token } = useToken();

  const getColors = (colorType: "primary" | "success" | "warning" | "error") => {
    const colorMap = {
      primary: { color: token.colorPrimary, bg: token.colorPrimaryBg },
      success: { color: token.colorSuccess, bg: token.colorSuccessBg },
      warning: { color: token.colorWarning, bg: token.colorWarningBg },
      error: { color: token.colorError, bg: token.colorErrorBg },
    };
    return colorMap[colorType];
  };

  const sectionStyle: React.CSSProperties = {
    padding: `${token.paddingXL * 2}px ${token.paddingLG}px`,
    backgroundColor: token.colorBgLayout,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: MAX_CONTENT_WIDTH,
    margin: "0 auto",
  };

  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: token.marginXL,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading2,
    fontWeight: fontWeights.bold,
    marginBottom: token.marginSM,
    color: token.colorText,
  };

  const sectionSubtitleStyle: React.CSSProperties = {
    fontSize: token.fontSizeLG,
    color: token.colorTextSecondary,
    display: "block",
  };

  const cardStyle: React.CSSProperties = {
    padding: token.paddingLG,
    borderRadius: token.borderRadiusLG,
    backgroundColor: token.colorBgContainer,
    border: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
    height: "100%",
  };

  const iconContainerStyle = (colorType: "primary" | "success" | "warning" | "error"): React.CSSProperties => {
    const colors = getColors(colorType);
    return {
      width: token.controlHeightLG + token.marginMD,
      height: token.controlHeightLG + token.marginMD,
      borderRadius: token.borderRadius,
      backgroundColor: colors.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: token.marginMD,
      fontSize: token.fontSizeHeading3,
      color: colors.color,
    };
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading5,
    fontWeight: fontWeights.semibold,
    marginBottom: token.marginSM,
    color: token.colorText,
  };

  const cardDescStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    color: token.colorTextSecondary,
    lineHeight: token.lineHeightLG,
    margin: 0,
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        {/* Section Header */}
        <div style={headerStyle}>
          <Title level={2} style={sectionTitleStyle}>
            Why Choose InTuition?
          </Title>
          <Text style={sectionSubtitleStyle}>
            The most trusted platform for trading College Coins with powerful features
            built for students, parents, and institutions.
          </Text>
        </div>

        {/* Features Grid */}
        <Row gutter={[token.marginLG, token.marginLG]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <div style={cardStyle}>
                <div style={iconContainerStyle(feature.colorType)}>
                  {feature.icon}
                </div>
                <Title level={5} style={cardTitleStyle}>
                  {feature.title}
                </Title>
                <Text style={cardDescStyle}>
                  {feature.description}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
