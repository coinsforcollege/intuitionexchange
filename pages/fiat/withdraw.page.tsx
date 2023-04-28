import { LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  InputNumber,
  Radio,
  Result,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import Footer from "components/footer";
import Header from "components/header";
import { NotificationContext } from "context/notification";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import Link from "next/link";
import React, { ReactElement } from "react";
import useSWR from "swr";
import { ApiFiatBank } from "types";
import { axiosInstance } from "util/axios";

export function Page() {
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const { data, error, isLoading } = useSWR("/api/fiat/bank-accounts", (url) =>
    axiosInstance.user.get<ApiFiatBank[]>(url).then((res) => res.data)
  );

  if (error) {
    return (
      <Result
        style={{ width: "100%" }}
        status="error"
        title="An unexpected error has occurred, please reload the page"
      />
    );
  }

  if (isLoading || !data) {
    return (
      <Card style={{ width: "100%" }}>
        <Skeleton active />
      </Card>
    );
  }

  const onFinish = (data: { amount: number; bank: string }) => {
    setLoading(true);

    axiosInstance.user
      .post<{
        message: string;
      }>("/api/fiat/withdraw", data)
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
            content: err.message ?? "An error occurred, please try again later",
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
              <Link href="/wallet">
                <Button type="text">
                  <LeftOutlined />
                </Button>
              </Link>
              <Typography>Withdraw</Typography>
            </Space>
          }
          extra={
            <Link href="/fiat/add-bank">
              <Button>Add Bank</Button>
            </Link>
          }
        >
          {step === 1 && <Result status="success" title="Request submitted!" />}
          {step === 0 && data.length === 0 && (
            <div>
              <Space direction="vertical">
                <Typography>
                  In order for you to withdraw funds from your account to your
                  bank account, you will need to register your bank details with
                  us.
                </Typography>
                <Link href="/fiat/add-bank">Add Bank</Link>
              </Space>
            </div>
          )}
          {step === 0 && data.length > 0 && (
            <Form disabled={loading} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Select bank"
                name="bank"
                required
                rules={[
                  {
                    required: true,
                    message: "Please select your bank account!",
                  },
                ]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    {data.map((bank, index) => (
                      <Radio key={`bank-${index}`} value={bank.id}>
                        {bank.routingNumber} - {bank.bankAccountName}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="Amount"
                required
                name="amount"
                rules={[
                  { required: true, message: "Please enter amount!" },
                  {
                    min: 1,
                    type: "number",
                    message: "Minimum amount should be greater then zero!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  prefix="$"
                  title="Amount"
                  placeholder="Enter amount"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ width: "100%" }}
                >
                  Withdraw
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
        <title>Withdraw fiat | Intuition Exchange</title>
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
