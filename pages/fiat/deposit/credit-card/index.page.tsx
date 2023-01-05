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
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import useSWR from "swr";
import { ApiFiatCreditCard } from "types";
import { axiosInstance } from "util/axios";

export function Page() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const { data, error, isLoading } = useSWR("/api/fiat/credit-cards", (url) =>
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

  const onFinish = (data: { amount: number; bank: string }) => {
    setLoading(true);

    axiosInstance.user
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
        setLoading(false);
      });
  };

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Card
          title={
            <Space>
              <Link href="/fiat">
                <Button type="text">
                  <LeftOutlined />
                </Button>
              </Link>
              <Typography>Credit Card</Typography>
            </Space>
          }
          extra={
            <Link href="/fiat/deposit/credit-card/add">
              <Button>Add Credit Card</Button>
            </Link>
          }
        >
          {data.length === 0 && (
            <div>
              <Space direction="vertical">
                <Typography>
                  In order for you to deposit funds to your account, you will
                  need to register your credit card details with us.
                </Typography>
                <Link href="/fiat/deposit/credit-card/add">
                  Add Credit Card
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
                      <Radio key={`bank-${index}`} value={card.id}>
                        {card.creditCardBin} - {card.creditCardType} -{" "}
                        {card.creditCardName}
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
