import { Button, Card, Checkbox, Form, Input, Space } from "antd";
import { AxiosError } from "axios";
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

function Page() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [otpSent, setOtpSent] = React.useState(false);
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
      router.replace("/");
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
      .then((res) => {
        if (!otpSent) {
          setOtpSent(true);
        } else {
          notification.success({ content: res.data.message });
          SetToken(res.data.token);
        }
      })
      .catch((err: AxiosError<{ errors?: string[] }>) => {
        if (err.response?.data.errors?.length) {
          err.response.data.errors.forEach((err) => notification.error(err));
        } else {
          notification.error({
            content: err.message ?? "An error occurred, please try again later",
          });
        }
      });

    setLoading(false);
  };

  const resendEmailOTP = async () => {
    setLoading(true);

    await axiosInstance.default
      .post<{
        message: string;
      }>("/otp/resend/email", {
        email: form.getFieldValue("email"),
        type: "LOGIN",
      })
      .then((res) => {
        notification.success({ content: res.data.message });
      })
      .catch((err: AxiosError<{ errors?: string[] }>) => {
        if (err.response?.data.errors?.length) {
          err.response.data.errors.forEach((err) => notification.error(err));
        } else {
          notification.error({
            content: err.message ?? "An error occurred, please try again later",
          });
        }
      });

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
          <Card
            title={otpSent ? "Verification code" : "Sign in to your account"}
          >
            <Form
              form={form}
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
                    extra={
                      <div
                        style={{ padding: "4px 0", cursor: "pointer" }}
                        onClick={() => resendEmailOTP()}
                      >
                        Click here to resend verification code
                      </div>
                    }
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
                    <Space>
                      <Button onClick={() => setOtpSent(false)}>Back</Button>
                      <Button
                        loading={loading}
                        type="primary"
                        htmlType="submit"
                      >
                        Verify & sign in
                      </Button>
                    </Space>
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
