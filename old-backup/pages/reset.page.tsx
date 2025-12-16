import { ReloadOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Card, Form, Input, Tooltip, Typography } from "antd";
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

enum Step {
  finish = "FINISH",
  newPassword = "NEW_PASSWORD",
  start = "START",
  verify = "VERIFY",
}

function Page() {
  const tokenRef = React.useRef("");
  const [form] = Form.useForm();
  const router = useRouter();
  const [step, setStep] = React.useState(Step.start);
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

  const onFinish = async ({
    email,
    otp,
    password,
  }: {
    email: string;
    otp: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      if (step === Step.start) {
        const { data } = await axiosInstance.user.post<{
          message: string;
          nextStep: Step;
          token: string;
        }>("/api/account/reset", {
          email,
        });

        tokenRef.current = data.token;
        setStep(Step.verify);

        notification.success({
          message: data.message,
          placement: "bottomLeft",
        });
      } else if (step === Step.verify) {
        const { data } = await axiosInstance.user.post<{
          message: string;
          nextStep: Step;
        }>("/api/account/reset/verify", {
          otp,
          token: tokenRef.current,
        });

        setStep(Step.newPassword);

        notification.success({
          message: data.message,
          placement: "bottomLeft",
        });
      } else if (step === Step.newPassword) {
        const { data } = await axiosInstance.user.post<{
          message: string;
          nextStep: Step;
        }>("/api/account/reset/new-password", {
          password,
          token: tokenRef.current,
        });

        setStep(Step.finish);
        form.resetFields();

        notification.success({
          message: data.message,
          placement: "bottomLeft",
        });
      }
    } catch (error: any) {
      HandleError(notification)(error);
    }

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
          <Card title="Forgot password">
            <Form
              form={form}
              layout="vertical"
              disabled={loading}
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              {step === Step.start && (
                <>
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
                      Next
                    </Button>
                  </Form.Item>

                  <Form.Item>
                    {"Remember password? "}
                    <Link href="/login">Login now!</Link>
                  </Form.Item>
                </>
              )}

              {step === Step.verify && (
                <div>
                  <Form.Item
                    extra={
                      <div style={{ padding: "4px 0" }}>
                        Sent verification code on your email
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
                    <Button loading={loading} type="primary" htmlType="submit">
                      Next
                    </Button>
                  </Form.Item>
                </div>
              )}

              {step === Step.newPassword && (
                <>
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
                    <Input.Password
                      type="password"
                      placeholder="Please enter your new password"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Confirm New Password"
                    required
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            new Error(
                              "The new password that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      type="password"
                      placeholder="Please confirm your new password"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit">
                      Finish
                    </Button>
                  </Form.Item>
                </>
              )}

              {step === Step.finish && (
                <>
                  <Form.Item>
                    <Typography>✅ Password changed successfully</Typography>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      loading={loading}
                      type="primary"
                      htmlType="button"
                      onClick={() => router.push("/login")}
                    >
                      Login now!
                    </Button>
                  </Form.Item>
                </>
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
        <title>Forgot password | Intuition Exchange</title>
      </Head>
      <Header />
      <>{page}</>
      <Footer />
    </>
  );
};

export default Page;
