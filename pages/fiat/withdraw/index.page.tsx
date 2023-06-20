import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Alert,
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
import { HandleError } from "util/axios/error-handler";

export function Page() {
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const { data, error, isLoading, mutate } = useSWR(
    "/api/fiat/bank-accounts",
    (url) => axiosInstance.user.get<ApiFiatBank[]>(url).then((res) => res.data)
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

  const onFinish = async (data: { amount: number; bank: string }) => {
    setLoading(true);

    await axiosInstance.user
      .post<{
        message: string;
      }>("/api/fiat/withdraw", data)
      .then((res) => {
        notification.success({
          message: res.data.message,
          placement: "bottomLeft",
        });
        setStep(1);
      })
      .catch(HandleError(notification));

    setLoading(false);
  };

  const remove = async (id: string) => {
    setLoading(true);

    await axiosInstance.user
      .delete<{
        message: string;
      }>(`/api/fiat/bank-accounts/${id}`)
      .then((res) => {
        mutate();
        notification.success({ message: res.data.message });
      })
      .catch(HandleError(notification));

    setLoading(false);
  };

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Card
          title={<Typography>Withdraw</Typography>}
          extra={
            <Link href="/wallet" style={{ color: "inherit" }}>
              <Button type="text">
                <CloseOutlined />
              </Button>
            </Link>
          }
        >
          {step === 1 && (
            <Result
              status="success"
              title="Disbursement authorization email has been sent to your registered email address"
              extra={
                <Link href="/wallet/transfers">
                  <Button type="primary">Check Transfer Status</Button>
                </Link>
              }
            />
          )}
          {step === 0 && data.length === 0 && (
            <div>
              <Space direction="vertical" size={16}>
                <Alert
                  message="In order for you to withdraw funds from your account to your
                  bank account, you will need to register your bank details with
                  us."
                  type="info"
                />
                <Link href="/fiat/withdraw/add-bank">
                  <Button htmlType="submit" style={{ width: "100%" }}>
                    Add Bank
                  </Button>
                </Link>
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
                      <div key={`bank-${index}`}>
                        <Radio value={bank.id}>
                          {bank.bankAccountName} (XXX-XXX-{bank.last4})
                        </Radio>
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          type="link"
                          onClick={() => remove(bank.id)}
                        />
                      </div>
                    ))}
                    <div>
                      <Link href="/fiat/withdraw/add-bank">
                        <Button
                          size="small"
                          style={{ color: "var(--color-primary)" }}
                          type="link"
                          icon={<PlusOutlined />}
                        >
                          Add bank
                        </Button>
                      </Link>
                    </div>
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
