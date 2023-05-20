import { ReloadOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Card, Form, Input, Space, Tooltip } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { NotificationContext } from "context/notification";
import { AuthContext } from "context/protect-route";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import OtpInput from "react-otp-input";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";

function Page() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [otpSent, setOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const {
    loading: isLoading,
    user,
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
      }>(otpSent ? "/api/account/reset/verify" : "/api/account/reset", values)
      .then((res) => {
        notification.success({
          message: res.data.message,
          placement: "bottomLeft",
        });
        if (!otpSent) {
          setOtpSent(true);
        } else {
          router.replace("/login");
        }
      })
      .catch(HandleError(notification));

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
        notification.success({
          message: res.data.message,
          placement: "bottomLeft",
        });
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
          <Card title="Forget password">
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
                      autoFocus
                      type="password"
                      placeholder="Please enter your new password"
                    />
                  </Form.Item>

                  <Form.Item
                    extra={
                      <div style={{ padding: "4px 0" }}>
                        Sent to {form.getFieldValue("email")}
                      </div>
                    }
                    label="Email verification code"
                    required
                  >
                    <div
                      className={css({
                        display: "flex",
                        alignItems: "center",
                      })}
                    >
                      <Form.Item
                        noStyle
                        name="otp"
                        rules={[
                          {
                            required: true,
                            message: "Please enter verification code!",
                          },
                        ]}
                      >
                        <OtpInput
                          containerStyle={{
                            padding: "8px 0",
                          }}
                          inputStyle="inputStyle"
                          inputType="number"
                          numInputs={6}
                          onChange={(otp) =>
                            form.setFieldValue("otpEmail", otp)
                          }
                          renderSeparator={<span>-</span>}
                          renderInput={(props) => <input {...props} />}
                        />
                      </Form.Item>
                      <Tooltip title="Resend verification code">
                        <Button
                          shape="circle"
                          type="link"
                          icon={<ReloadOutlined />}
                          onClick={resendEmailOTP}
                        />
                      </Tooltip>
                    </div>
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
        <title>Forget password | Intuition Exchange</title>
      </Head>
      <Header />
      <>{page}</>
      <Footer />
    </>
  );
};

export default Page;
