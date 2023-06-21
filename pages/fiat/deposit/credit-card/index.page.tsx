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
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import useSWR from "swr";
import { ApiFiatCreditCard } from "types";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";

export function Page() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const { data, error, isLoading, mutate } = useSWR(
    "/api/fiat/credit-cards",
    (url) =>
      axiosInstance.user.get<ApiFiatCreditCard[]>(url).then((res) => res.data)
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

  const onFinish = async (data: { amount: number; card: string }) => {
    setLoading(true);

    await axiosInstance.user
      .post<{
        token: string;
      }>("/api/fiat/credit-cards/deposit", data)
      .then((res) => {
        router.push({
          pathname: "/fiat/deposit/credit-card/verify",
          query: { token: res.data.token },
        });
        setLoading(false);
      })
      .catch(HandleError(notification));

    setLoading(false);
  };

  const remove = async (id: string) => {
    setLoading(true);

    await axiosInstance.user
      .delete<{
        message: string;
      }>(`/api/fiat/credit-cards/${id}`)
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
          title={<Typography>Deposit - Credit/Debit Card</Typography>}
          extra={
            <Link href="/fiat/deposit" style={{ color: "inherit" }}>
              <Button type="text">
                <CloseOutlined />
              </Button>
            </Link>
          }
        >
          {data.length === 0 && (
            <div>
              <Space direction="vertical" size={16}>
                <Alert
                  message="In order for you to withdraw assets from your account, you will need to register your external wallet details with us."
                  type="info"
                />
                <Link href="/fiat/deposit/credit-card/add">
                  <Button htmlType="submit" style={{ width: "100%" }}>
                    Add Wallet
                  </Button>
                </Link>
              </Space>
            </div>
          )}
          {data.length > 0 && (
            <Form disabled={loading} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Select card"
                name="card"
                required
                rules={[
                  {
                    required: true,
                    message: "Please select your credit card!",
                  },
                ]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    {data.map((card, index) => (
                      <div key={`bank-${index}`}>
                        <Radio value={card.id}>
                          XXXX-XXXX-XXXX-{card.last_digits}
                        </Radio>
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          type="link"
                          onClick={() => remove(card.id)}
                        />
                      </div>
                    ))}
                    <div>
                      <Link href="/fiat/deposit/credit-card/add">
                        <Button
                          size="small"
                          style={{ color: "var(--color-primary)" }}
                          type="link"
                          icon={<PlusOutlined />}
                        >
                          Add new card
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
                    min: 0.01,
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
                  precision={2}
                  step={0.1}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ width: "100%" }}
                >
                  Deposit
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
