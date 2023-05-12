import { Button, Result, Row, Space, Spin } from "antd";
import { AxiosError } from "axios";
import { NotificationContext } from "context/notification";
import { OnboardingAuthContext } from "context/protect-route-onboarding";
import React from "react";
import { axiosInstance } from "util/axios";
import { useEffectOnce } from "util/effect-once";

import { IOnboardingForm } from "./index.page";

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
      onSuccess: (response: { documentUuid: string; status: string }) => {
        if (response.status === "VERIFICATION_COMPLETE") {
          setForm((prev) => ({
            ...prev,
            socureDocumentId: response.documentUuid,
          }));

          setTimeout(() => {
            if (isDocumentUploaded) {
              onFinish();
            }
          }, 5_000);
        }
      },
      // onError: console.log, //callback method to read the error response
      qrCodeNeeded: true, //toggle the QR code display
    };

    const input = {
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
      .catch((err: AxiosError<{ errors?: string[] }>) => {
        if (err.response?.data.errors?.length) {
          err.response.data.errors.forEach((err) => notification.error(err));
        } else {
          notification.error({
            content: err.message ?? "An error occurred, please try again later",
          });
        }
      });
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
          />
        </Row>
      )}
      {error.length === 0 && isDocumentUploaded && (
        <Row style={{ justifyContent: "center" }}>
          <Result
            status="success"
            title="Documents Uploaded!"
            subTitle="Click on finish to submit your application."
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
          <Button
            disabled={loading || !isDocumentUploaded}
            type="primary"
            onClick={onFinish}
          >
            Finish
          </Button>
        </Space>
      </Row>
    </>
  );
}
