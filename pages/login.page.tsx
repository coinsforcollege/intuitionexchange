import { Button, Card, Checkbox, Form, Input } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { NotificationContext } from "context/notification";
import { AuthContext } from "context/protect-route";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { ApiUserInfo } from "types";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";

function Page() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const {
    loading: isLoading,
    user,
    SetToken,
    RemoveToken,
  } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace(router.query.redirect?.toString() ?? "/exchange");
    } else {
      RemoveToken();
    }
  }, [isLoading]);

  const onFinish = async (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    setLoading(true);

    await axiosInstance.default
      .post<{
        message: string;
        otp: string;
        token: string;
        user: ApiUserInfo;
      }>("/api/account/login", values)
      .then(async (res) => {
        notification.success({
          message: res.data.message,
          placement: "bottomLeft",
        });
        SetToken(res.data.token);
      })
      .catch(HandleError(notification));

    setLoading(false);
  };

  return (
    <>
      <div className="container">
        <div
          style={{
            margin: "auto",
            maxWidth: "600px",
            paddingTop: "2vw",
            paddingBottom: "12vw",
          }}
        >
          <Card title={"Sign in to your account"}>
            <Form
              form={form}
              layout="vertical"
              disabled={loading}
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <div>
                <Form.Item
                  label="Email"
                  required
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email address!",
                    },
                  ]}
                >
                  <Input
                    type="email"
                    placeholder="Please enter your email address"
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  required
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password!" },
                  ]}
                >
                  <Input
                    type="password"
                    placeholder="Please enter your password"
                  />
                </Form.Item>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Form.Item>
                    <Link href="/reset">Forget password</Link>
                  </Form.Item>
                </div>

                <Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit">
                    Log in
                  </Button>
                </Form.Item>

                <Form.Item>
                  {"Don't have an account? "}
                  <Link href="/register">Register now!</Link>
                </Form.Item>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Sign in to your account | Intuition Exchange</title>
      </Head>
      <Header />
      <>{page}</>
      <Footer />
    </>
  );
};

export default Page;
