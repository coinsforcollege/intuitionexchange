import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Result, Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { NotificationContext } from "context/notification";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import Link from "next/link";
import React, { ReactElement } from "react";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";

export function Page() {
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);

  const onFinish = (data: {
    bankAccountName: string;
    bankAccountNumber: string;
    routingNumber: string;
    routingType: string;
  }) => {
    setLoading(true);

    axiosInstance.user
      .post<{
        message: string;
      }>("/api/fiat/bank-accounts", data)
      .then((res) => {
        notification.success({
          message: res.data.message,
          placement: "bottomLeft",
        });
        setLoading(false);
        setStep(1);
      })
      .catch(HandleError(notification));

    setLoading(false);
  };

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Card
          title={<Typography>Add Bank Account</Typography>}
          extra={
            <Link href="/fiat/withdraw">
              <Button type="link">
                <CloseOutlined />
              </Button>
            </Link>
          }
        >
          {step === 1 && (
            <Result status="success" title="Bank account added!" />
          )}
          {step === 0 && (
            <Form disabled={loading} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Bank Account Name"
                required
                name="bankAccountName"
                rules={[
                  {
                    required: true,
                    message: "Please enter bank account name!",
                  },
                ]}
              >
                <Input placeholder="Enter bank account name" />
              </Form.Item>
              <Form.Item
                label="Bank Account Number"
                required
                name="bankAccountNumber"
                rules={[
                  {
                    required: true,
                    message: "Please enter bank account number!",
                  },
                  {
                    pattern: /^\d+$/,
                    message: "Routing number should have digits only!",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Enter bank account number"
                />
              </Form.Item>
              <Form.Item
                label="Routing Number"
                required
                name="routingNumber"
                rules={[
                  {
                    required: true,
                    message: "Please enter routing number!",
                  },
                  {
                    pattern: /^\d{9}$/,
                    message: "Routing number should have 9 digits!",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Enter routing number"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ width: "100%" }}
                >
                  Add bank
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
        <title>Add bank | Intuition Exchange</title>
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
