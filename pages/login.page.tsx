import { Button, Card, Checkbox, Form, Input } from "antd";
import { AxiosError } from "axios";
import Footer from "components/footer";
import Header from "components/header";
import { NotificationContext } from "context/notification";
import { AuthContext } from "context/protect-route";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { useUserStore } from "store/user-store";
import { ApiUserInfo } from "types";
import { axiosInstance } from "util/axios";

function Page() {
  const router = useRouter();
  const userStore = useUserStore();
  const [otpSent, setOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const { loading: isLoading, user } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace("/exchange");
    } else {
      userStore.setUser(null);
    }
  }, [isLoading]);

  const onFinish = (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    setLoading(true);

    axiosInstance.default
      .post<{
        message: string;
        otp: string;
        token: string;
        user: ApiUserInfo;
      }>("/api/account/login", values)
      .then((res) => {
        if (!otpSent) {
          setOtpSent(true);
        } else {
          notification.success({ content: res.data.message });
          userStore.setUser({ id: res.data.user.id, token: res.data.token });
        }
        setLoading(false);
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
      <div className="container">
        <div
          style={{
            margin: "auto",
            maxWidth: "600px",
            paddingTop: "2vw",
          }}
        >
          <Card
            title={otpSent ? "Verification code" : "Sign in to your account"}
          >
            <Form
              layout="vertical"
              disabled={loading}
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <div style={{ display: otpSent ? "none" : undefined }}>
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

              {otpSent && (
                <div>
                  <Form.Item
                    label="Verification code"
                    required
                    name="otp"
                    rules={[
                      {
                        required: true,
                        message: "Please enter verification code!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter the verification code sent to your email address" />
                  </Form.Item>

                  <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit">
                      Verify & sign in
                    </Button>
                  </Form.Item>
                </div>
              )}
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
