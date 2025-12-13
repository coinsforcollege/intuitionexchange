import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Space, Drawer, Menu, Switch, Divider, theme } from "antd";
import {
  MenuOutlined,
  SwapOutlined,
  WalletOutlined,
  LineChartOutlined,
  UserOutlined,
  LoginOutlined,
  SunOutlined,
  MoonOutlined,
  TeamOutlined,
  DollarOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { fontWeights } from "@/theme/themeConfig";
import { useThemeMode } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const { useToken } = theme;

// Layout constants (not design tokens)
const HEADER_HEIGHT = 72;
const MAX_CONTENT_WIDTH = 1200;
const MOBILE_BREAKPOINT = 768;

const navItems = [
  { key: "buy-sell", label: "Buy & Sell", icon: <DollarOutlined />, href: "/buy-sell" },
  { key: "trade", label: "Trade", icon: <SwapOutlined />, href: "/trade" },
  { key: "p2p", label: "P2P", icon: <TeamOutlined />, href: "/p2p" },
  { key: "markets", label: "Markets", icon: <LineChartOutlined />, href: "/markets" },
  { key: "wallet", label: "Wallet", icon: <WalletOutlined />, href: "/wallet" },
];

export default function Header() {
  const { token } = useToken();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, toggleMode } = useThemeMode();
  const { user, isLoading } = useAuth();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const isLoggedIn = !isLoading && !!user;

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: token.zIndexPopupBase,
    height: HEADER_HEIGHT,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `0 ${token.paddingLG}px`,
    backgroundColor: mode === "dark" 
      ? `rgba(0, 0, 0, 0.8)` 
      : `rgba(255, 255, 255, 0.8)`,
    backdropFilter: "blur(12px)",
    borderBottom: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
  };

  const logoContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: token.marginSM,
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading4,
    fontWeight: fontWeights.bold,
    color: token.colorText,
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: token.marginXS,
    padding: `${token.paddingXS}px`,
    borderRadius: token.borderRadiusLG,
    backgroundColor: token.colorPrimaryBg,
  };

  const getNavLinkStyle = (key: string): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: token.marginXS,
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderRadius: token.borderRadius,
    color: hoveredNav === key ? token.colorPrimary : token.colorTextSecondary,
    backgroundColor: hoveredNav === key ? token.colorPrimaryBg : "transparent",
    fontSize: token.fontSize,
    fontWeight: fontWeights.medium,
    textDecoration: "none",
    transition: "all 0.2s ease",
  });

  const rightSectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: token.marginSM,
  };

  const themeSwitchContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: token.controlHeight,
    height: token.controlHeight,
    borderRadius: token.borderRadius,
    backgroundColor: mode === "dark" ? token.colorBgLayout : token.colorPrimaryBg,
    cursor: "pointer",
  };

  const mobileMenuButtonStyle: React.CSSProperties = {
    display: "none",
    fontSize: token.fontSizeHeading4,
    color: token.colorText,
  };

  return (
    <>
      <header style={headerStyle}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={logoContainerStyle}>
            <Image
              src="/images/intuition-logo-no-text.svg"
              alt="InTuition Exchange"
              width={token.controlHeightLG}
              height={token.controlHeightLG}
            />
            <span style={logoTextStyle}>InTuition</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={navStyle} className="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              style={getNavLinkStyle(item.key)}
              onMouseEnter={() => setHoveredNav(item.key)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div style={rightSectionStyle} className="desktop-nav">
          <div
            style={themeSwitchContainerStyle}
            onClick={toggleMode}
          >
            {mode === "dark" ? (
              <MoonOutlined style={{ color: token.colorPrimary }} />
            ) : (
              <SunOutlined style={{ color: token.colorPrimary }} />
            )}
          </div>
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button
                type="primary"
                icon={<DashboardOutlined />}
                style={{
                  fontWeight: fontWeights.semibold,
                  paddingInline: token.paddingMD,
                }}
              >
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  type="text"
                  style={{ 
                    color: token.colorText,
                    fontWeight: fontWeights.medium,
                  }}
                >
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  type="primary"
                  style={{
                    fontWeight: fontWeights.semibold,
                    paddingInline: token.paddingMD,
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuOpen(true)}
          style={mobileMenuButtonStyle}
          className="mobile-menu-btn"
        />
      </header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: token.marginSM }}>
            <Image
              src="/images/intuition-logo-no-text.svg"
              alt="InTuition"
              width={32}
              height={32}
            />
            <span style={{ fontWeight: fontWeights.bold }}>InTuition</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        styles={{
          body: { padding: 0 },
        }}
      >
        <Menu
          mode="vertical"
          style={{ border: "none" }}
          items={[
            ...navItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: <Link href={item.href}>{item.label}</Link>,
            })),
            { type: "divider" as const },
            ...(isLoggedIn 
              ? [
                  {
                    key: "dashboard",
                    icon: <DashboardOutlined />,
                    label: <Link href="/dashboard">Dashboard</Link>,
                  },
                ]
              : [
                  {
                    key: "login",
                    icon: <LoginOutlined />,
                    label: <Link href="/login">Log In</Link>,
                  },
                  {
                    key: "signup",
                    icon: <UserOutlined />,
                    label: <Link href="/register">Sign Up</Link>,
                  },
                ]
            ),
          ]}
        />
        <div style={{ padding: token.paddingMD }}>
          <Divider style={{ margin: `${token.marginSM}px 0` }} />
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            padding: `${token.paddingSM}px 0`,
          }}>
            <span style={{ color: token.colorTextSecondary }}>Theme</span>
            <Switch
              checked={mode === "dark"}
              onChange={toggleMode}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
          </div>
        </div>
      </Drawer>

      <style jsx global>{`
        @media (max-width: ${MOBILE_BREAKPOINT}px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

export { HEADER_HEIGHT, MAX_CONTENT_WIDTH };
