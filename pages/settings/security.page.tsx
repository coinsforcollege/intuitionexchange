import { ReloadOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Form, Input, Space, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
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

function Page() {
  const [form] = Form.useForm();
  const { user } = React.useContext(UserAuthContext);
  const [otpSent, setOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);

  const onFinish = async (values: { password: string }) => {
    setLoading(true);

    await axiosInstance.user
      .post<{
        message: string;
      }>("/api/account/update/password", values)
      .then((res) => {
        notification.success({ content: res.data.message });
        if (!otpSent) {
          setOtpSent(true);
        } else {
          setOtpSent(false);
          form.resetFields();
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
        email: user.email,
        type: "ACCOUNT_CHANGE_PASSWORD",
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
    <div>
      <Typography.Title level={4} style={{ paddingBottom: "1rem" }}>
        Change account password
      </Typography.Title>
      <Form
        form={form}
        layout="vertical"
        disabled={loading}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
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

        {otpSent && (
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
                  type="link"
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
              {otpSent ? "Submit" : "Verify"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
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
        <SettingsLayout selected={SettingsSidebar.Security}>
          {page}
        </SettingsLayout>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
