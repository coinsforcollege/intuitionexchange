import {
  BankOutlined,
  CloseOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Card, Col, List, Row, Space, Typography } from "antd";
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
          title={<Typography>Deposit</Typography>}
          extra={
            <Link href="/wallet" style={{ color: "inherit" }}>
              <Button type="text">
                <CloseOutlined />
              </Button>
            </Link>
          }
        >
          <Row style={{ textAlign: "center" }}>
            <Col xs={24} sm={12} style={{ padding: "1rem" }}>
              <Link
                href="/fiat/deposit/wire"
                className={css({
                  color: "var(--color-text-l0)",
                  ":hover": {
                    color: "white",
                  },
                })}
              >
                <Space
                  direction="vertical"
                  className={css({
                    padding: "1rem",
                    border: "1px solid",
                    borderColor: "var(--color-divider)",
                    borderRadius: "1rem",
                    height: "100%",
                    ":hover": {
                      borderColor: "var(--color-primary)",
                      background: "var(--color-primary)",
                    },
                  })}
                >
                  <BankOutlined style={{ fontSize: "5rem" }} />
                  <Typography>
                    Complete a wire transfer to deposit funds into your
                    InTuition account. The wire details will be provided on the
                    subsequent screen.
                  </Typography>
                </Space>
              </Link>
            </Col>
            <Col xs={24} sm={12} style={{ padding: "1rem" }}>
              <Link
                href="/fiat/deposit/credit-card"
                className={css({
                  color: "var(--color-text-l0)",
                  ":hover": {
                    color: "white",
                  },
                })}
              >
                <Space
                  direction="vertical"
                  className={css({
                    padding: "1rem",
                    border: "1px solid",
                    borderColor: "var(--color-divider)",
                    borderRadius: "1rem",
                    height: "100%",
                    ":hover": {
                      borderColor: "var(--color-primary)",
                      background: "var(--color-primary)",
                    },
                  })}
                >
                  <CreditCardOutlined style={{ fontSize: "5rem" }} />
                  <Typography>
                    Utilize the credit/debit cards already linked to your
                    account or add a new card to deposit funds into your
                    IntTuition account.
                  </Typography>
                </Space>
              </Link>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: "1rem" }}>
          <List>
            <List.Item>
              Ensure that your bank or card provider permits the transfer of
              funds to a cryptocurrency exchange.
            </List.Item>
            <List.Item>
              Transfers can be declined by your bank in case they are not
              crypto-friendly.
            </List.Item>
            <List.Item>
              Deposits are usually processed within 1 business day but could
              take longer in some cases.
            </List.Item>
            <List.Item>
              Visit{" "}
              <Link href="/wallet/transfers">
                <b>Transfer History</b>
              </Link>{" "}
              page to check status of your past deposits and withdrawals.
            </List.Item>
          </List>
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
