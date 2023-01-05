import { Card, Col, Row, Steps } from "antd";
import { AxiosError } from "axios";
import Footer from "components/footer";
import Header from "components/header";
import LoadingScreen from "components/loading-screen";
import { NotificationContext } from "context/notification";
import { OnboardingAuthContextProvider } from "context/protect-route-onboarding";
import Head from "next/head";
import React, { ReactElement } from "react";
import { axiosInstance } from "util/axios";

import OnboardingStep0 from "./step-0";
import OnboardingStep1 from "./step-1";
import OnboardingStep2 from "./step-2";
import OnboardingStep3 from "./step-3";
import OnboardingStep4 from "./step-4";

export interface IOnboardingForm {
  address: {
    city: string;
    country: string;
    postalCode: string;
    region: string;
    street1: string;
    street2: string;
  };
  birthday: {
    day: string;
    month: string;
    year: string;
  };
  firstName: string;
  lastName: string;
  middleName: string;
  sex: string;
  socureDeviceId: string;
  socureDocumentId: string;
  taxCountry: string;
  taxId: string;
}

export interface IOnboardingStatus {
  errors: { code?: string; description: string }[];
  maxLimitReached: boolean;
  pending: number;
  rejected: number;
  success: number;
  total: number;
}

export function Page() {
  const { api: notification } = React.useContext(NotificationContext);

  const [status, setStatus] = React.useState<IOnboardingStatus | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [agreement, setAgreement] = React.useState("");
  const [form, setForm] = React.useState<IOnboardingForm>({
    address: {
      city: "",
      country: "US",
      postalCode: "",
      region: "",
      street1: "",
      street2: "",
    },
    birthday: {
      day: "",
      month: "",
      year: "",
    },
    firstName: "",
    lastName: "",
    middleName: "",
    sex: "male",
    socureDeviceId: "",
    socureDocumentId: "",
    taxCountry: "US",
    taxId: "",
  });

  React.useEffect(() => {
    refreshStatus();
  }, []);

  const refreshStatus = () => {
    axiosInstance.user
      .get<IOnboardingStatus>("/api/onboarding/status")
      .then((res) => {
        setStatus(res.data);
        if (
          res.data.success > 0 ||
          res.data.pending !== 0 ||
          res.data.maxLimitReached
        ) {
          setStep(4);
        }
      })
      .catch((err: AxiosError<{ message?: string }>) => {
        notification.error({
          content:
            err.response?.data?.message ??
            err.message ??
            "Unknown error, please try again",
        });
      });
  };

  const onFinish = async () => {
    setLoading(true);
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      await axiosInstance.user
        .post<{ agreement: string }>("/api/onboarding/agreement-preview", form)
        .then((res) => {
          setAgreement(res.data.agreement);
          setStep(2);
        })
        .catch((err: AxiosError<{ message?: string }>) => {
          notification.error({
            content:
              err.response?.data?.message ??
              err.message ??
              "Unknown error, please try again",
          });
        });
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      await axiosInstance.user
        .post<{ agreement: string }>("/api/onboarding/finish", form)
        .then(() => {
          setStep(4);
          refreshStatus();
        })
        .catch((err: AxiosError<{ message?: string }>) => {
          notification.error({
            content:
              err.response?.data?.message ??
              err.message ??
              "Unknown error, please try again",
          });
        });
    } else if (step === 4) {
      await axiosInstance.user
        .post<{ message: string }>("/api/onboarding/restart")
        .then((resp) => {
          notification.success({
            content: resp.data.message,
          });
          resetForm();
          setStep(0);
          refreshStatus();
        })
        .catch((err: AxiosError<{ message?: string }>) => {
          notification.error({
            content:
              err.response?.data?.message ??
              err.message ??
              "Unknown error, please try again",
          });
        });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setAgreement("");
    setForm({
      address: {
        city: "",
        country: "US",
        postalCode: "",
        region: "",
        street1: "",
        street2: "",
      },
      birthday: {
        day: "",
        month: "",
        year: "",
      },
      firstName: "",
      lastName: "",
      middleName: "",
      sex: "male",
      socureDeviceId: "",
      socureDocumentId: "",
      taxCountry: "US",
      taxId: "",
    });
  };

  if (!status) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="container">
        <Row
          justify="center"
          style={{ paddingTop: "2vw", paddingBottom: "12vw" }}
        >
          <Col xs={24} style={{ alignSelf: "center" }}>
            <Steps
              current={step}
              items={[
                {
                  title: "Personal Details",
                  description: "Basic details including TAX information",
                },
                {
                  title: "Address",
                  description: "User address details",
                },
                {
                  title: "User Agreement",
                  description: "Read Prime Trust agreement",
                },
                {
                  title: "Upload documents",
                  description: "Identity and AML check",
                },
                {
                  title: "Finish",
                  description: "Onboarding complete",
                },
              ]}
            />
          </Col>
          <Col xs={24}>
            <div
              style={{
                maxWidth: step < 2 ? "800px" : undefined,
                margin: "auto",
                paddingTop: "2vw",
              }}
            >
              <Card
                title="Onboarding"
                extra="Avoid closing or refreshing the window between each step"
              >
                {step === 0 && (
                  <OnboardingStep0
                    form={form}
                    setForm={setForm}
                    loading={loading}
                    onFinish={onFinish}
                  />
                )}
                {step === 1 && (
                  <OnboardingStep1
                    form={form}
                    setForm={setForm}
                    loading={loading}
                    onFinish={onFinish}
                    onBack={() => setStep(0)}
                  />
                )}
                {step === 2 && (
                  <OnboardingStep2
                    agreement={agreement}
                    loading={loading}
                    onFinish={onFinish}
                    onBack={() => {
                      setAgreement("");
                      setStep(1);
                    }}
                  />
                )}
                {step === 3 && (
                  <OnboardingStep3
                    form={form}
                    setForm={setForm}
                    loading={loading}
                    onFinish={onFinish}
                    onBack={() => {
                      setForm((prev) => ({
                        ...prev,
                        socureDeviceId: "",
                        socureDocumentId: "",
                      }));
                      setStep(2);
                    }}
                  />
                )}
                {step === 4 && (
                  <OnboardingStep4
                    reApply={() => onFinish()}
                    status={status}
                    refreshStatus={refreshStatus}
                  />
                )}
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Onboarding | Intuition Exchange</title>
      </Head>
      <OnboardingAuthContextProvider>
        <Header />
        <>{page}</>
        <Footer />
      </OnboardingAuthContextProvider>
    </>
  );
};

export default Page;
