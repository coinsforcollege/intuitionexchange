import { css } from "@emotion/css";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import Footer from "components/footer";
import MarketQuote from "components/graphs/MarketQuote";
import Header from "components/header";
import { TuitCoinCounter } from "components/tuit-coin-counter";
import { ResponsiveContext } from "context/responsive";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { ReactElement } from "react";
import mq from "util/breakpoints";

import AccessImage from "../public/Access.png";
import LockImage from "../public/Lock.png";
import mainImageY from "../public/main-y.webp";
import ProtectImage from "../public/Protect.png";
import RocketImage from "../public/Rocket.png";
import tuitLogo from "../public/tuit-white.svg";

export function Page() {
  const { isDarkMode } = React.useContext(ResponsiveContext);

  return (
    <>
      <div className="container">
        <Row
          gutter={[16, 16]}
          className={css({
            alignItems: "center",
            padding: "4rem 0",
          })}
        >
          <Col
            xs={{ span: 24, order: 2 }}
            md={{ span: 14, order: 1 }}
            className={css({
              paddingTop: "4rem !important",
              textAlign: "center",
              [mq.md]: {
                textAlign: "start",
              },
            })}
          >
            <Typography.Title
              level={1}
              className={css({
                fontSize: "2rem !important",
                [mq.md]: {
                  fontSize: "4rem !important",
                },
              })}
            >
              Investing in the Future
            </Typography.Title>
            <Typography.Title
              level={3}
              className={css({
                fontSize: "1.25rem !important",
                [mq.md]: {
                  fontSize: "1.5rem !important",
                },
              })}
            >
              InTuition Exchange Gives 10% of Its Net Revenue to Support College
              Education for Students through Tuition Coins ($TUIT)
            </Typography.Title>
            <Link href="/p2p/TUIT-USD">
              <Button type="primary" size="large">
                Buy TUIT
              </Button>
            </Link>
          </Col>
          <Col xs={{ span: 24, order: 1 }} md={{ span: 10, order: 1 }}>
            <div className={css({ position: "relative", height: "6rem" })}>
              <div
                className={css({
                  margin: "auto",
                  position: "absolute",
                  left: 0,
                  right: 0,
                })}
              >
                <div
                  className={css({
                    display: "flex",
                    borderRadius: "8px",
                    alignItems: "center",
                    background: "rgba(22, 104, 220, 0.5)",
                    justifyContent: "center",
                    width: "fit-content",
                    margin: "auto",
                  })}
                >
                  <div
                    className={css({
                      background: "#1668DC",
                      borderRadius: "8px 0 0 8px",
                      padding: "1rem",
                      display: "flex",
                      alignContent: "center",
                    })}
                  >
                    <Image
                      alt="logo"
                      src={tuitLogo}
                      className={css({
                        width: "3rem",
                        height: "auto",
                      })}
                    />
                  </div>
                  <div>
                    <TuitCoinCounter />
                  </div>
                </div>
              </div>
            </div>
            <Typography style={{ textAlign: "center" }}>
              Tuition Coins pledged to parents
            </Typography>
          </Col>
        </Row>
        <Row
          className={css({
            paddingTop: "4rem",
            textAlign: "center",
            margin: "auto",
            [mq.md]: {
              paddingTop: "10rem",
            },
          })}
          gutter={[16, 16]}
        >
          <Card
            className={css({
              [mq.md]: {
                padding: "2rem !important",
              },
            })}
          >
            <Typography.Title
              level={3}
              className={css({
                fontSize: "1.5rem !important",
                textAlign: "start",
                [mq.md]: {
                  textAlign: "center",
                  fontSize: "1.75rem !important",
                },
              })}
            >
              Intuition Exchange, in partnership with Coins For College, is a
              social impact platform connecting the community to tackle high
              tuition costs and increase access to quality education.
            </Typography.Title>
          </Card>
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
            <MarketQuote
              widgetProps={{
                width: "100%",
                colorTheme: isDarkMode ? "dark" : "light",
                symbolsGroups: [
                  {
                    name: "USD",
                    originalName: "Indices",
                    symbols: [
                      {
                        name: "BITSTAMP:BTCUSD",
                      },
                      {
                        name: "BITSTAMP:ETHUSD",
                      },
                      {
                        name: "BITSTAMP:ADAUSD",
                      },
                      {
                        name: "BITSTAMP:LTCUSD",
                      },
                      {
                        name: "BITSTAMP:USDCUSD",
                      },
                      {
                        name: "BITSTAMP:USDTUSD",
                      },
                    ],
                  },
                ],
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
            <Link href="/exchange/BTC-USD">
              <Button type="primary" size="large">
                Start Trading
              </Button>
            </Link>
          </Col>
          <Col xs={24} md={12}>
            <div
              className={css({
                textAlign: "center",
                padding: "4rem",
                maxWidth: "600px",
              })}
            >
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
