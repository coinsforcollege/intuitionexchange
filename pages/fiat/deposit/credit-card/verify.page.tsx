import { LeftOutlined } from "@ant-design/icons";
import { Button, Card, Result, Space, theme, Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import React, { ReactElement } from "react";

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

  const launch = (hash: string) => {
    window.pt.launchCreditCard({
      target: document.getElementById("verification"),
      resourceTokenHash: hash,
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
  };

  React.useEffect(() => {
    if (window.pt && typeof token === "string") {
      launch(token);
    }
  }, []);

  if (typeof token !== "string") {
    return (
      <div style={{ textAlign: "center" }}>
        <Result
          status="error"
          title="Something went wrong!"
          extra={
            <Link href="/fiat/deposit/credit-card">
              <Button>Go back</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center" }}>
        <Result
          status="success"
          title={error.name}
          subTitle={error.message}
          extra={
            <Link href="/fiat/deposit/credit-card">
              <Button>Make Deposit</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (completed) {
    return (
      <div style={{ textAlign: "center" }}>
        <Result status="success" title="Transaction Verified!" />
      </div>
    );
  }

  return (
    <>
      <Script
        onLoad={() => launch(token)}
        id="primetrust"
        async={true}
        type="text/javascript"
        src="https://sandbox.bootstrapper.primetrust-cdn.com/bootstrap.js"
        defer
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
          <div id="verification" />
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
      <Header />
      <div className="container">{page}</div>
      <Footer />
    </>
  );
};

export default Page;
