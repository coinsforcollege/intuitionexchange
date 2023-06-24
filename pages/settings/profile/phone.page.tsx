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

export enum Step {
  finish = "FINISH",
  start = "START",
  verifyCurrentPhone = "VERIFY_CURRENT_PHONE",
  verifyNewPhone = "VERIFY_NEW_PHONE",
}

function Page() {
  const tokenRef = React.useRef("");
  const phoneCountryRef = React.useRef("");
  const phoneRef = React.useRef("");
  const [form] = Form.useForm();
  const [step, setStep] = React.useState(Step.start);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const { refresh: refreshUser } = React.useContext(UserAuthContext);

  const onFinish = async ({
    otp,
    phone,
    phoneCountry,
  }: {
    otp: string;
    phone: string;
    phoneCountry: string;
  }) => {
    setLoading(true);

    try {
      if (step === Step.start) {
        const { data } = await axiosInstance.user.post<{
          message: string;
          phone: string;
          phoneCountry: string;
          token: string;
        }>("/api/account/update/phone", { phone, phoneCountry });

        tokenRef.current = data.token;
        phoneRef.current = data.phone;
        phoneCountryRef.current = data.phoneCountry;
        setStep(Step.verifyNewPhone);

        notification.success({
          message: data.message,
          placement: "bottomLeft",
        });
      } else if (step === Step.verifyNewPhone) {
        const { data } = await axiosInstance.user.post<{
          message: string;
          phone: string;
          phoneCountry: string;
        }>("/api/account/update/phone/verify-new-phone", {
          otp,
          token: tokenRef.current,
        });

        phoneRef.current = data.phone;
        phoneCountryRef.current = data.phoneCountry;
        setStep(Step.verifyCurrentPhone);
        form.resetFields(["otp"]);

        notification.success({
          message: data.message,
          placement: "bottomLeft",
        });
      } else if (step === Step.verifyCurrentPhone) {
        const { data } = await axiosInstance.user.post<{ message: string }>(
          "/api/account/update/phone/verify-current-phone",
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

  const resendPhoneOTP = async () => {
    setLoading(true);

    await axiosInstance.default
      .post<{
        message: string;
      }>("/otp/resend/phone", {
        phoneCountry: phoneCountryRef.current,
        phone: phoneRef.current,
        token: tokenRef.current,
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
        Change phone number
      </Typography.Title>
      {step === Step.finish && (
        <Typography>✅ Phone number changed successfully</Typography>
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
          )}

          {(step === Step.verifyCurrentPhone ||
            step === Step.verifyNewPhone) && (
            <Form.Item
              label={`Enter verification code sent on your +${phoneCountryRef.current}-${phoneRef.current} phone number`}
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
                    onClick={resendPhoneOTP}
                  />
                </Tooltip>
              </div>
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button loading={loading} type="primary" htmlType="submit">
                {step === Step.verifyCurrentPhone ? "Finish" : "Next"}
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
        <title>Change phone number | Intuition Exchange</title>
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
