import { LeftOutlined } from "@ant-design/icons";
import { Button, Card, Result, Space, Spin, Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { NotificationContext } from "context/notification";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import React, { ReactElement } from "react";
import { useEffectOnce } from "usehooks-ts";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";

declare global {
  interface Window {
    pt: any;
  }
}

function Page() {
  const [completed, setCompleted] = React.useState(false);
  const [hash, setHash] = React.useState<string>();
  const { api: notification } = React.useContext(NotificationContext);

  useEffectOnce(() => {
    axiosInstance.user
      .post<{ token: string }>("/api/fiat/credit-cards")
      .then((res) => {
        setHash(res.data.token);
      })
      .catch(HandleError(notification));
  });

  React.useEffect(() => {
    if (hash) launch(hash);
  }, [hash]);

  const launch = (token: string) => {
    if (!window.pt) return;

    window.pt.launchCreditCard({
      target: document.getElementById("verification"),
      resourceTokenHash: token,
      theme: {
        //theme attributes
        background: "#ffffff",
        foreground: "#000000",
      },
      events: {
        cardVerified: function (
          contactId: string,
          fundsTransferMethodId: string
        ) {
          console.log(
            "[primetrust] Funds transfer method created with ID:",
            fundsTransferMethodId
          );
          console.log("[primetrust] Created for Contact: :", contactId);
          setCompleted(true);
        },
      },
    });
  };

  if (!hash) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  if (completed) {
    return (
      <div style={{ textAlign: "center" }}>
        <Result
          status="success"
          title="Credit card added!"
          extra={
            <Link href="/fiat/deposit/credit-card">
              <Button>Make Deposit</Button>
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
          if (hash) launch(hash);
        }}
        id="primetrust"
        async={true}
        type="text/javascript"
        src={
          process.env.NODE_ENV === "development"
            ? "https://sandbox.bootstrapper.primetrust-cdn.com/bootstrap.js"
            : "https://bootstrapper.primetrust-cdn.com/bootstrap.js"
        }
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
      <UserAuthContextProvider>
        <Header />
        <div className="container" style={{ maxWidth: "800px" }}>
          {page}
        </div>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
