import { LeftOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Result,
  Space,
  Spin,
  theme,
  Typography,
} from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import React, { ReactElement } from "react";
import { useEffectOnce } from "util/effect-once";

declare global {
  interface Window {
    pt: any;
  }
}

function Page() {
  const { token: ThemeToken } = theme.useToken();
  const router = useRouter();
  const { token } = router.query;
  const [completed, setCompleted] = React.useState(false);
  const [error, setError] = React.useState<{
    message: string;
    name: string;
  }>();

  useEffectOnce(() => {
    init();
  });

  const init = () => {
    if (typeof window.pt !== "undefined") {
      window.pt.launchCreditCard({
        hideAmount: false,
        target: document.getElementById("verification-widget"),
        resourceTokenHash: token,
        theme: {
          //theme attributes
          background: "inherit",
          foreground: ThemeToken.colorTextBase.replaceAll(
            /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])(.+)?/g,
            "#$1$1$2$2$3$3"
          ),
        },
        events: {
          onContribution: function (
            contributionId: string,
            fundsTransferMethodId: string
          ) {
            //contribution was successful
            console.log(
              "[primetrust] Contribution created with ID:",
              contributionId
            );
            console.log(
              "[primetrust] Contribution using FTM ID:",
              fundsTransferMethodId
            );
            setCompleted(true);
          },
          onContributionError: function (error: Error) {
            //contribution failed
            console.log("[primetrust] Error:", error.name);
            console.log("[primetrust] Error:", error.message);
            setError({
              name: error.name,
              message: error.message,
            });
          },
        },
      });
    }
  };

  if (typeof token !== "string") {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <Alert
          showIcon
          message="Verification Failed"
          description={
            <Space direction="vertical">
              <Typography>{error.message}</Typography>
              <Link href="/fiat/deposit/credit-card">
                <Button type="primary">Retry</Button>
              </Link>
            </Space>
          }
          type="error"
        />
      </div>
    );
  }

  if (completed) {
    return (
      <div style={{ textAlign: "center" }}>
        <Result
          status="success"
          title="Transaction Verified!"
          extra={
            <Link href="/funds">
              <Button>View Balance</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <>
      <Script
        onLoad={() => {
          init();
        }}
        id="primetrust"
        async={true}
        type="text/javascript"
        src="https://sandbox.bootstrapper.primetrust-cdn.com/bootstrap.js"
      />
      <div className="container">
        <Space style={{ paddingBottom: "20px" }}>
          <Link href="/fiat/deposit/credit-card">
            <Button type="text">
              <LeftOutlined />
            </Button>
          </Link>
          <Typography>Add Credit Card</Typography>
        </Space>
        <Card>
          <div id="verification-widget" />
        </Card>
      </div>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Add credit card | Intuition Exchange</title>
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
