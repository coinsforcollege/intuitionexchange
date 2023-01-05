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
  Select,
  Space,
  Typography,
} from "antd";
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

  const onFinish = (values: any) => {
    setLoading(true);

    axiosInstance.default
      .post<{
        message: string;
      }>("/api/account/create", values)
      .then((res) => {
        notification.success({ content: res.data.message });
        setLoading(false);
        if (!otpSent) {
          setOtpSent(true);
        } else {
          router.replace("/login");
        }
      })
      .catch((err: AxiosError<{ message: string }>) => {
        notification.error({
          content:
            err.response?.data?.message ??
            err.message ??
            "Unknown error, please try again",
        });
        setLoading(false);
      });
  };

  return (
    <>
      <div className="container">
        <div
          style={{
            margin: "auto",
            maxWidth: "600px",
            paddingTop: "2vw",
          }}
        >
          <Card
            title={
              otpSent
                ? "Verify your email address and phone"
                : "Create an account"
            }
          >
            <Form
              layout="vertical"
              disabled={loading}
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <div style={{ display: otpSent ? "none" : "block" }}>
                <Row justify="space-between" gutter={8}>
                  <Col xs={24} md={24} style={{ paddingBottom: "20px" }}>
                    <Typography>
                      Currently intuition exchange is limited to beta testers
                      only and you need an invitation to be able to create an
                      account.
                    </Typography>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="First name"
                      required
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your first name!",
                        },
                      ]}
                    >
                      <Input placeholder="Please enter your first name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Middle name"
                      name="middleName"
                      rules={[
                        {
                          required: false,
                          message: "Please enter your middle name!",
                        },
                      ]}
                    >
                      <Input placeholder="Please enter your middle name" />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      label="Last name"
                      required
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your last name!",
                        },
                      ]}
                    >
                      <Input placeholder="Please enter your last name" />
                    </Form.Item>
                  </Col>
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
                          message: "Please enter your password!",
                        },
                        {
                          min: 8,
                          message: "Password should be 8 characters!",
                        },
                        {
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                          message:
                            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
                        },
                      ]}
                    >
                      <Input
                        type="password"
                        placeholder="Password length must be greater than 8 characters"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Invitation Code"
                      required
                      name="invitationCode"
                      rules={[
                        {
                          required: true,
                          message: "Please enter invitation code!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter the invitation code shared with you by Intuition team" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Country"
                      name="country"
                      extra="We currently serve only in the United States"
                      required
                      rules={[
                        {
                          required: true,
                          message: "Please select your country!",
                        },
                      ]}
                      initialValue="US"
                    >
                      <Select
                        disabled
                        placeholder="Select country"
                        options={[{ label: "United States", value: "US" }]}
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
                  Already have an account? Go to{" "}
                  <Link href="/login">login</Link>!
                </Form.Item>
              </div>

              {otpSent && (
                <div>
                  <Form.Item
                    label="Verify email"
                    required
                    name="otpEmail"
                    rules={[
                      {
                        required: true,
                        message: "Please enter verification code!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter the verification code sent to your email address" />
                  </Form.Item>

                  <Form.Item
                    label="Verify phone"
                    required
                    name="otpPhone"
                    rules={[
                      {
                        required: true,
                        message: "Please enter verification code!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter the verification code sent to your phone" />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button
                        loading={loading}
                        onClick={() => setOtpSent(false)}
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
