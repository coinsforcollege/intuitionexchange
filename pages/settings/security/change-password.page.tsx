import { ReloadOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Form, Input, Space, Tooltip, Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { SettingsLayout, SettingsSidebar } from "components/settings-layout";
import { NotificationContext } from "context/notification";
import {
  UserAuthContext,
  UserAuthContextProvider,
} from "context/protect-route-user";
import Head from "next/head";
import React from "react";
import OtpInput from "react-otp-input";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";

enum Step {
  finish = "FINISH",
  start = "START",
  verify = "VERIFY",
}

function Page() {
  const tokenRef = React.useRef("");
  const [form] = Form.useForm();
  const { user } = React.useContext(UserAuthContext);
  const [step, setStep] = React.useState(Step.start);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);

  const onFinish = async ({
    otp,
    password,
  }: {
    otp: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      if (step === Step.start) {
        const { data } = await axiosInstance.user.post(
          "/api/account/update/password",
          { password }
        );

        tokenRef.current = data.token;
        setStep(Step.verify);

        notification.success({
          message: data.message,
          placement: "bottomLeft",
        });
      } else if (step === Step.verify) {
        await axiosInstance.user.post("/api/account/update/password/verify", {
          otp,
          token: tokenRef.current,
        });

        setStep(Step.finish);
        form.resetFields();

        notification.success({
          message: "Password changed successfully",
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
        email: user.email,
        type: "ACCOUNT_CHANGE_PASSWORD",
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
    <div>
      <Typography.Title level={4} style={{ paddingBottom: "1rem" }}>
        Change Account Password
      </Typography.Title>
      {step === Step.finish && (
        <Typography>✅ Password changed successfully</Typography>
      )}
      {step !== Step.finish && (
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
            </>
          )}

          {step === Step.verify && (
            <Form.Item
              extra={
                <div style={{ padding: "4px 0" }}>
                  Sent verification code on your email
                </div>
              }
              label="Enter verification code"
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
                    onChange={(otp) => form.setFieldValue("otp", otp)}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                  />
                </Form.Item>
                <Tooltip title="Resend verification code">
                  <Button
                    shape="circle"
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={resendEmailOTP}
                  />
                </Tooltip>
              </div>
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button loading={loading} type="primary" htmlType="submit">
                {step === Step.verify ? "Finish" : "Next"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

Page.GetLayout = function GetLayout(page: React.ReactElement) {
  return (
    <>
      <Head>
        <title>Security Settings | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header />
        <SettingsLayout
          backUrl="/settings/security"
          selected={SettingsSidebar.Security}
        >
          {page}
        </SettingsLayout>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
