import { ReloadOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Space,
  Tooltip,
  Typography,
} from "antd";
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
  const [otpSent, setOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const { refresh: refreshUser } = React.useContext(UserAuthContext);

  const onFinish = async (values: { phone: string; phoneCountry: string }) => {
    setLoading(true);

    await axiosInstance.user
      .post<{
        message: string;
      }>("/api/account/update/phone", values)
      .then((res) => {
        notification.success({ content: res.data.message });
        if (!otpSent) {
          setOtpSent(true);
        } else {
          setOtpSent(false);
          form.resetFields();
          refreshUser();
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

  const resendPhoneOTP = async () => {
    setLoading(true);

    await axiosInstance.default
      .post<{
        message: string;
      }>("/otp/resend/phone", {
        phoneCountry: form.getFieldValue("phoneCountry"),
        phone: form.getFieldValue("phone"),
        type: "ACCOUNT_CHANGE_PHONE",
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
        Change phone number
      </Typography.Title>
      <Form
        form={form}
        layout="vertical"
        disabled={loading}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item required label="Phone">
          <Input.Group compact>
            <Form.Item
              name="phoneCountry"
              noStyle
              rules={[
                {
                  required: true,
                  message: "Phone country code is required",
                },
              ]}
              initialValue="1"
            >
              <Input
                prefix="+"
                style={{
                  width: "15%",
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              />
            </Form.Item>
            <Form.Item
              name="phone"
              noStyle
              rules={[
                {
                  required: true,
                  message: "Phone number is required",
                },
                {
                  len: 10,
                  transform: (value) => String(value),
                  message: "Phone number should have 10 digits!",
                },
              ]}
            >
              <InputNumber
                type="number"
                style={{ width: "85%" }}
                placeholder="Please enter a valid US mobile number"
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        {otpSent && (
          <Form.Item
            extra={
              <div style={{ padding: "4px 0" }}>
                Sent verification code on your new phone number
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
                  onClick={resendPhoneOTP}
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
        <title>Update Phone Number - Settings | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header />
        <SettingsLayout selected={SettingsSidebar.Profile}>
          {page}
        </SettingsLayout>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
