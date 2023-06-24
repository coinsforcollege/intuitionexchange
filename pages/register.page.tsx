import { ReloadOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Tooltip,
} from "antd";
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

  const onFinish = async (values: any) => {
    setLoading(true);

    await axiosInstance.default
      .post<{
        message: string;
      }>("/api/account/create", { ...values, country: "US" })
      .then((res) => {
        notification.success({
          message: res.data.message,
          placement: "bottomLeft",
        });
        setLoading(false);
        if (!otpSent) {
          setOtpSent(true);
        } else {
          router.replace("/login");
        }
      })
      .catch(HandleError(notification));

    setLoading(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resendEmailOTP = async () => {
    setLoading(true);

    await axiosInstance.default
      .post<{
        message: string;
      }>("/otp/resend/email", {
        email: form.getFieldValue("email"),
        type: "REGISTER",
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resendPhoneOTP = async () => {
    setLoading(true);

    await axiosInstance.default
      .post<{
        message: string;
      }>("/otp/resend/phone", {
        phoneCountry: form.getFieldValue("phoneCountry"),
        phone: form.getFieldValue("phone"),
        type: "REGISTER",
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
          <Card
            title={otpSent ? "Verify contact details" : "Create an account"}
          >
            <Form
              layout="vertical"
              disabled={loading}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              form={form}
            >
              <div style={{ display: otpSent ? "none" : "block" }}>
                <Row justify="space-between" gutter={8}>
                  <Col xs={24}>
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
                  </Col>
                  <Col xs={24}>
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
                            disabled
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
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Password"
                      required
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter strong password here!",
                        },
                        {
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                          message:
                            "Must contain at least 8 characters with a combination of uppercase & lowercase letters, numbers, and special characters",
                        },
                      ]}
                    >
                      <Input.Password
                        type="password"
                        placeholder="Please enter strong password here"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  style={{ marginBottom: "0px" }}
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(
                                "Should accept privacy policy and terms of use"
                              )
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    I have read and accept the{" "}
                    <Link href="/terms-of-use" target="_blank">
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" target="_blank">
                      Privacy Policy
                    </Link>{" "}
                    of InTuition Exchange.
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name="patriotAct"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Should accept U.S. Patriot Act")
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    I have read and accept the terms of{" "}
                    <a
                      onClick={() => {
                        Modal.info({
                          title: "U.S. Patriot Act",
                          content: (
                            <div>
                              <p>
                                To help the government fight the funding of
                                terrorism and money laundering activities,
                                federal law requires all financial institutions
                                to obtain, verify, and record information that
                                identifies each person who opens an account.
                                What this means for you: when you open an
                                account, we will ask for your name, address,
                                date of birth, and other information that will
                                allow us to identify you. We may also ask to see
                                your driver&apos;s license and other identifying
                                documents.
                              </p>
                              <a
                                href="https://www.fincen.gov/resources/statutes-regulations/usa-patriot-act"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Read more
                              </a>
                            </div>
                          ),
                          onOk() {},
                        });
                      }}
                    >
                      U.S. Patriot Act
                    </a>
                    .
                  </Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit">
                    Continue
                  </Button>
                </Form.Item>

                <Form.Item>
                  Already have an account?{" "}
                  <Link href="/login">Login here!</Link>
                </Form.Item>
              </div>

              {otpSent && (
                <div>
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
                        name="otpEmail"
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
                          shouldAutoFocus
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

                  <Form.Item
                    extra={
                      <div style={{ padding: "4px 0" }}>
                        Sent to +{form.getFieldValue("phoneCountry")}
                        {form.getFieldValue("phone")}
                      </div>
                    }
                    label="Phone verification code"
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
                        name="otpPhone"
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
                            form.setFieldValue("otpPhone", otp)
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
                          onClick={resendPhoneOTP}
                        />
                      </Tooltip>
                    </div>
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button
                        loading={loading}
                        onClick={() => {
                          form.setFieldValue("otpEmail", "");
                          form.setFieldValue("otpPhone", "");
                          setOtpSent(false);
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        loading={loading}
                        type="primary"
                        htmlType="submit"
                      >
                        Verify
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
        <title>Create an account | Intuition Exchange</title>
      </Head>
      <Header />
      <>{page}</>
      <Footer />
    </>
  );
};

export default Page;
