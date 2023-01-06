import { LeftOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Result, Space, Typography } from "antd";
import { AxiosError } from "axios";
import Footer from "components/footer";
import Header from "components/header";
import { NotificationContext } from "context/notification";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { assetsList } from "types";
import { axiosInstance } from "util/axios";

export function Page() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);

  const asset = assetsList.find(
    (item) => item.assetId === router.query.assetId
  );

  const onFinish = (data: { walletId: string }) => {
    setLoading(true);

    axiosInstance.user
      .post<{
        message: string;
      }>("/api/assets/withdraw/addresses", {
        assetId: router.query.assetId,
        walletId: data.walletId,
      })
      .then((res) => {
        notification.success({ content: res.data.message });
        setLoading(false);
        setStep(1);
      })
      .catch((err: AxiosError<{ errors?: string[] }>) => {
        if (err.response?.data.errors?.length) {
          err.response.data.errors.forEach((err) => notification.error(err));
        } else {
          notification.error({
            content: err.message ?? "Unknown error, please try again",
          });
        }
        setLoading(false);
      });
  };

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Card
          title={
            <Space>
              <Link href={`/assets/withdraw?assetId=${router.query.assetId}`}>
                <Button type="text">
                  <LeftOutlined />
                </Button>
              </Link>
              <Typography>Add wallet to withdraw {asset?.name}</Typography>
            </Space>
          }
        >
          {step === 1 && <Result status="success" title="Wallet added!" />}
          {step === 0 && (
            <Form disabled={loading} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Wallet address"
                required
                name="walletId"
                rules={[
                  {
                    required: true,
                    message: "Please enter wallet address!",
                  },
                ]}
              >
                <Input placeholder="Enter wallet address" />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ width: "100%" }}
                >
                  Add wallet
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Add wallet | Intuition Exchange</title>
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
