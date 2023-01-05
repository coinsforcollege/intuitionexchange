import { Button, Col, Row, Space, Typography } from "antd";
import Footer from "components/footer";
import CryptocurrencyMarket from "components/graphs/CryptocurrencyMarket";
import Header from "components/header";
import useMediaQuery from "components/useMediaQuery";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { ReactElement } from "react";

import AccessImage from "../public/Access.png";
import LockImage from "../public/Lock.png";
import mainImageX from "../public/main-x.webp";
import mainImageY from "../public/main-y.webp";
import ProtectImage from "../public/Protect.png";
import RocketImage from "../public/Rocket.png";

export function Page() {
  const [isPhone, setIsPhone] = React.useState(false);
  const [isDarkOS, setIsDarkOS] = React.useState(false);

  const isDarkOSCheck = useMediaQuery("(prefers-color-scheme: dark)");
  const isPhoneCheck = useMediaQuery("(max-width: 768px)");

  React.useEffect(() => {
    setIsPhone(isPhoneCheck);
    setIsDarkOS(isDarkOSCheck);
  }, [isDarkOSCheck, isPhoneCheck]);

  return (
    <>
      <div className="container">
        <Row gutter={[16, 16]} style={{ alignItems: "center" }}>
          <Col xs={24} md={10}>
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <Image
                alt="Intuition Exchange"
                src={mainImageX}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </Col>
          <Col xs={24} md={14}>
            <Typography.Title
              level={1}
              style={{ fontSize: isPhone ? undefined : "6rem" }}
            >
              Most intuitive way to invest in crypto
            </Typography.Title>
            <Typography.Title
              level={3}
              style={{ fontSize: isPhone ? undefined : "2rem" }}
            >
              Buy and sell crypto assets with the easiest and most secure
              onboarding
            </Typography.Title>
            <Link href="/">
              <Button type="primary" size="large">
                Start Trading
              </Button>
            </Link>
          </Col>
        </Row>
        <Row
          style={{
            paddingTop: "10rem",
            textAlign: "center",
            maxWidth: "800px",
            margin: "auto",
          }}
          gutter={[16, 16]}
        >
          <Typography.Title level={3}>
            Our exchange is designed to bring together all those who are
            passionate about cryptocurrency and want to be a part of the digital
            revolution that is taking place at an accelerated rate.
          </Typography.Title>
        </Row>
        <Row gutter={[16, 16]} style={{ paddingTop: "10rem" }}>
          <Col xs={24} md={6}>
            <Space direction="vertical">
              <Image
                alt="Best in class security"
                src={LockImage}
                style={{ width: "48px", height: "auto" }}
              />
              <Typography.Title level={3}>
                Best in class security
              </Typography.Title>
            </Space>
            <Typography.Paragraph>
              Threat susceptibility examination and virtual monitoring of
              accounts and assets for any unusual activity.
            </Typography.Paragraph>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical">
              <Image
                alt="Socure KYC"
                src={AccessImage}
                style={{ width: "48px", height: "auto" }}
              />
              <Typography.Title level={3}>Socure KYC</Typography.Title>
            </Space>
            <Typography.Paragraph>
              Socure is the only graph-defined identity verification platform
              that utilizes every element of identity— delivering the most
              accurate identity verification in real time.
            </Typography.Paragraph>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical">
              <Image
                alt="High Liquidity"
                src={RocketImage}
                style={{ width: "48px", height: "auto" }}
              />
              <Typography.Title level={3}>High Liquidity</Typography.Title>
            </Space>
            <Typography.Paragraph>
              Most reliable liquidity providers for our major assets to
              facilitate instant trading experience to our users.
            </Typography.Paragraph>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical">
              <Image
                alt="Powered by Fireblocks"
                src={ProtectImage}
                style={{ width: "48px", height: "auto" }}
              />
              <Typography.Title level={3}>
                Powered by Fireblocks
              </Typography.Title>
            </Space>
            <Typography.Paragraph>
              Customer funds are secured from cyber attacks, internal collusion
              and human error using MPC cryptography and hardware isolation.
            </Typography.Paragraph>
          </Col>
        </Row>
        <Row style={{ paddingTop: "10rem" }}>
          <Col xs={24}>
            <Typography.Title level={3}>Market Overview</Typography.Title>
            <CryptocurrencyMarket
              widgetProps={{
                width: "100%",
                colorTheme: isDarkOS ? "dark" : "light",
              }}
            />
          </Col>
        </Row>
        <Row
          gutter={[16, 16]}
          style={{ alignItems: "center", paddingTop: "10rem" }}
        >
          <Col xs={24} md={12}>
            <Typography.Title level={3}>
              Easiest onboarding for new investors
            </Typography.Title>
            <Typography.Paragraph>
              Buy crypto, easily manage your wallet, and maintain your portfolio
            </Typography.Paragraph>
            <Typography.Title level={3}>
              Multiple on-ramp methods
            </Typography.Title>
            <Typography.Paragraph>
              Easily diversify your portfolio using our multiple fiat deposit
              methods.
            </Typography.Paragraph>
            <Typography.Title level={3}>Lowest trading fees</Typography.Title>
            <Typography.Paragraph>
              Experience the lowest trading fees in the United States
            </Typography.Paragraph>
            <Link href="/exchange">
              <Button type="primary" size="large">
                Start Trading
              </Button>
            </Link>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <Image
                alt="Intuition Exchange"
                src={mainImageY}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Buy & Sell Digital Assets | Intuition Exchange</title>
      </Head>
      <Header />
      <>{page}</>
      <Footer />
    </>
  );
};

export default Page;
