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
  verifyCurrentEmail = "VERIFY_CURRENT_EMAIL",
  verifyNewEmail = "VERIFY_NEW_EMAIL",
}

function Page() {
  const tokenRef = React.useRef("");
  const emailRef = React.useRef("");
  const [form] = Form.useForm();
  const [step, setStep] = React.useState(Step.start);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const { refresh: refreshUser } = React.useContext(UserAuthContext);

  const onFinish = async ({ email, otp }: { email: string; otp: string }) => {
    setLoading(true);

    try {
      if (step === Step.start) {
        const { data } = await axiosInstance.user.post<{
          email: string;
          message: string;
          token: string;
        }>("/api/account/update/email", { email });

        tokenRef.current = data.token;
        emailRef.current = data.email;
        setStep(Step.verifyNewEmail);

        notification.success({
          message: data.message,
          placement: "bottomLeft",
        });
      } else if (step === Step.verifyNewEmail) {
        const { data } = await axiosInstance.user.post<{
          email: string;
          message: string;
        }>("/api/account/update/email/verify-new-email", {
          otp,
          token: tokenRef.current,
        });

        emailRef.current = data.email;
        setStep(Step.verifyCurrentEmail);
        form.resetFields(["otp"]);

        notification.success({
          message: data.message,
          placement: "bottomLeft",
        });
      } else if (step === Step.verifyCurrentEmail) {
        const { data } = await axiosInstance.user.post<{ message: string }>(
          "/api/account/update/email/verify-current-email",
          {
            otp,
            token: tokenRef.current,
          }
        );

        setStep(Step.finish);
        form.resetFields();
        refreshUser();

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
        email: emailRef.current,
        type: tokenRef.current,
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
        Change Email Address
      </Typography.Title>
      {step === Step.finish && (
        <Typography>✅ Email address changed successfully</Typography>
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
            <Form.Item
              label="New email address"
              required
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your new email address!",
                },
              ]}
            >
              <Input
                autoFocus
                type="email"
                placeholder="Please enter your new email"
              />
            </Form.Item>
          )}

          {(step === Step.verifyNewEmail ||
            step === Step.verifyCurrentEmail) && (
            <Form.Item
              label={`Enter verification code sent on your ${emailRef.current} email`}
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
                {step === Step.verifyCurrentEmail ? "Finish" : "Next"}
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
        <title>Change email address | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header />
        <SettingsLayout
          backUrl="/settings/profile"
          selected={SettingsSidebar.Profile}
        >
          {page}
        </SettingsLayout>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
