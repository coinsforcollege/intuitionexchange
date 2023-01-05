import {
  BankOutlined,
  CreditCardOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import Link from "next/link";
import React, { ReactElement } from "react";

export function Page() {
  return (
    <>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Card
          title={
            <Space>
              <Link href="/fiat">
                <Button type="text">
                  <LeftOutlined />
                </Button>
              </Link>
              <Typography>Deposit</Typography>
            </Space>
          }
        >
          <Row style={{ textAlign: "center" }}>
            <Col xs={24} sm={12}>
              <Link href="/fiat/deposit/wire">
                <Space direction="vertical">
                  <BankOutlined style={{ fontSize: "3rem" }} />
                  <Typography>Wire</Typography>
                </Space>
              </Link>
            </Col>
            <Col xs={24} sm={12}>
              <Link href="/fiat/deposit/credit-card">
                <Space direction="vertical">
                  <CreditCardOutlined style={{ fontSize: "3rem" }} />
                  <Typography>Credit Card</Typography>
                </Space>
              </Link>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Deposit fiat | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header />
        <div className="container">{page}</div>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
