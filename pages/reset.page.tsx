import { Button, Card, Form, Input, Space } from "antd";
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
import { axiosInstance } from "util/axios";

function Page() {
  const [form] = Form.useForm();
  const router = useRouter();
  const userStore = useUserStore();
  const [otpSent, setOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const { loading: isLoading, user } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace("/");
    } else {
      userStore.setUser(null);
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
      }>(otpSent ? "/api/account/reset/verify" : "/api/account/reset", values)
      .then((res) => {
        notification.success({ content: res.data.message });
        if (!otpSent) {
          setOtpSent(true);
        } else {
          router.replace("/login");
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
        type: "RESET",
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
          <Card title="Forget your account password">
            <Form
              form={form}
              layout="vertical"
              disabled={loading}
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <div style={{ display: otpSent ? "none" : "block" }}>
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

                <Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit">
                    Continue
                  </Button>
                </Form.Item>

                <Form.Item>
                  {"Remember password? "}
                  <Link href="/login">Login now!</Link>
                </Form.Item>
              </div>

              {otpSent && (
                <div>
                  <Form.Item
                    label="New Password"
                    required
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password!",
                      },
                    ]}
                  >
                    <Input
                      type="password"
                      placeholder="Please enter your new password"
                    />
                  </Form.Item>

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
                    <Input placeholder="Enter the verification code you received via email" />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button onClick={() => setOtpSent(false)}>Back</Button>
                      <Button
                        loading={loading}
                        type="primary"
                        htmlType="submit"
                      >
                        Verify
                      </Button>
                    </Space>
                  </Form.Item>

                  <Form.Item>
                    {"Remember password? "}
                    <Link href="/login">Login now!</Link>
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
        <title>Forget your account password | Intuition Exchange</title>
      </Head>
      <Header />
      <>{page}</>
      <Footer />
    </>
  );
};

export default Page;
