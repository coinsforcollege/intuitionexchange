import { LeftOutlined } from "@ant-design/icons";
import { Button, Card, Result, Space, Spin, theme, Typography } from "antd";
import { AxiosError } from "axios";
import Footer from "components/footer";
import Header from "components/header";
import { NotificationContext } from "context/notification";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import React, { ReactElement } from "react";
import { axiosInstance } from "util/axios";
import { useEffectOnce } from "util/effect-once";

declare global {
  interface Window {
    pt: any;
  }
}

function Page() {
  const { token: ThemeToken } = theme.useToken();
  const [completed, setCompleted] = React.useState(false);
  const [hash, setHash] = React.useState<string>();
  const { api: notification } = React.useContext(NotificationContext);

  useEffectOnce(() => {
    axiosInstance.user
      .post<{ token: string }>("/api/fiat/credit-cards")
      .then((res) => {
        setHash(res.data.token);
      })
      .catch((err: AxiosError<{ errors?: string[]; message?: string }>) => {
        if (err.response?.data.errors) {
          err.response.data.errors.forEach((err) => notification.error(err));
        }
        notification.error({
          content:
            err.response?.data?.message ??
            err.message ??
            "Unknown error, please try again",
        });
      });
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
        background: "inherit",
        foreground: ThemeToken.colorTextBase.replaceAll(
          /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])(.+)?/g,
          "#$1$1$2$2$3$3"
        ),
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
        <div className="container">{page}</div>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
