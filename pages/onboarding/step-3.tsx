import { Button, Result, Row, Space, Spin } from "antd";
import { NotificationContext } from "context/notification";
import { OnboardingAuthContext } from "context/protect-route-onboarding";
import React from "react";
import { useEffectOnce } from "usehooks-ts";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";

import { IOnboardingForm } from "./index.page";

interface SocureVerifyResult {
  documentVerification: {
    decision?: {
      name: string;
      value: "reject" | "accept";
    };
    documentData?: {
      address?: string;
      documentNumber?: string;
      firstName?: string;
      fullName?: string;
      parsedAddress?: {
        city?: string;
        country?: string;
        physicalAddress?: string;
        postalCode?: string;
        state?: string;
      };
      surName?: string;
    };
    documentType?: {
      country?: string;
      state?: string;
      type?: string;
    };
  };
  referenceId: string;
}

interface SocureResponse {
  documentUuid: string;
  key: string;
  referenceId: string;
  status: string;
  verifyResult: SocureVerifyResult;
}

export default function OnboardingStep2({
  form,
  loading,
  onBack,
  onFinish,
  setForm,
}: {
  form: IOnboardingForm;
  loading: boolean;
  onBack: () => void;
  onFinish: () => void;
  setForm: React.Dispatch<React.SetStateAction<IOnboardingForm>>;
}) {
  const [error, setError] = React.useState("");
  const { user } = React.useContext(OnboardingAuthContext);
  const { api: notification } = React.useContext(NotificationContext);

  const isDocumentUploaded =
    form.socureDeviceId.length !== 0 && form.socureDocumentId.length !== 0;

  const launch = (token: string) => {
    if (window.Socure) {
      window.Socure.cleanup();
      window.Socure.unmount();
    }

    // document capture
    const config = {
      // onProgress: console.log, //callback method for reading the progress status
      onSuccess: (response: SocureResponse) => {
        console.log(response);
        if (response.status === "VERIFICATION_COMPLETE") {
          if (
            response.verifyResult.documentVerification.decision?.value ===
            "accept"
          ) {
            setForm((prev) => ({
              ...prev,
              socureDocumentId: response.documentUuid,
            }));
          } else {
            setError(
              "Apologies, but the documents you uploaded are not acceptable. Please try again or contact support"
            );
          }
        }
      },
      // onError: console.log, //callback method to read the error response
      qrCodeNeeded: true, //toggle the QR code display
    };

    const input =
      process.env.NEXT_PUBLIC_NODE_ENV === "development"
        ? {}
        : {
            mobileNumber: `+${user.phoneCountry}${user.phone}`,
          };

    window.SocureInitializer.init(token).then((lib: any) => {
      lib.init(token, "#main-socure", config).then(function () {
        lib.start(2, input).catch((err: any) => {
          setError(err?.status ?? "");
        });
      });
    });
  };

  const launchDevicer = (token: string) => {
    const deviceFPOptions = {
      publicKey: token,
      userConsent: true,
      context: "onboarding",
    };

    window.devicer.run(
      deviceFPOptions,
      function (response: { result: string; sessionId: string }) {
        console.log(response);
        if (response.result === "Captured") {
          setForm((prev) => ({ ...prev, socureDeviceId: response.sessionId }));
        }
      }
    );
  };

  const startSocure = async () => {
    setForm((prev) => ({
      ...prev,
      socureDeviceId: "",
      socureDocumentId: "",
    }));

    axiosInstance.user
      .post<{ token: string }>("/api/onboarding/socure")
      .then((res) => {
        setTimeout(() => {
          launch(res.data.token);
          launchDevicer(res.data.token);
        }, 1000);
      })
      .catch(HandleError(notification));
  };

  useEffectOnce(() => {
    startSocure();
  });

  return (
    <>
      {error.length > 0 && (
        <Row style={{ justifyContent: "center" }}>
          <Result
            status="error"
            title="Something went wrong!"
            subTitle={error}
            extra={
              <Button loading={loading} onClick={startSocure} type="primary">
                Try Again
              </Button>
            }
          />
        </Row>
      )}
      {error.length === 0 && isDocumentUploaded && (
        <Row style={{ justifyContent: "center" }}>
          <Result
            status="success"
            title="Documents Uploaded!"
            subTitle="Click on finish to submit your application."
            extra={
              <Button
                loading={loading}
                disabled={!isDocumentUploaded}
                onClick={onFinish}
                type="primary"
              >
                Finish
              </Button>
            }
          />
        </Row>
      )}
      {error.length === 0 && !isDocumentUploaded && (
        <Row>
          <div
            style={{
              background: "white",
              color: "black",
              padding: "1rem",
              borderRadius: "8px",
              width: "100%",
            }}
            id="main-socure"
          >
            <Spin />
          </div>
        </Row>
      )}
      <Row style={{ paddingTop: "2rem" }}>
        <Space>
          <Button disabled={loading} type="dashed" onClick={onBack}>
            Back
          </Button>
        </Space>
      </Row>
    </>
  );
}
