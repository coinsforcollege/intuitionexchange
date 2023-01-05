import { Button, Result, Row, Space } from "antd";
import { OnboardingAuthContext } from "context/protect-route-onboarding";
import React from "react";

import { IOnboardingForm } from "./index.page";

const SOCURE_PUBLIC_KEY = "fd6ced03-3abb-4931-a7a3-11ce4310876d";

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
  const { user } = React.useContext(OnboardingAuthContext);
  React.useEffect(() => {
    if (window.Socure) {
      window.Socure.cleanup();
      window.Socure.unmount();
    }

    setForm((prev) => ({
      ...prev,
      socureDocumentId: "",
      socureDeviceId: "",
    }));

    const deviceFPOptions = {
      publicKey: SOCURE_PUBLIC_KEY,
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

    // document capture
    const config = {
      // onProgress: console.log, //callback method for reading the progress status
      onSuccess: (response: { documentUuid: string; status: string }) => {
        if (response.status === "VERIFICATION_COMPLETE") {
          setForm((prev) => ({
            ...prev,
            socureDocumentId: response.documentUuid,
          }));
        }
      },
      // onError: console.log, //callback method to read the error response
      qrCodeNeeded: true, //toggle the QR code display
    };

    const input = {
      mobileNumber: `+${user.phoneCountry}${user.phone}`,
    };

    window.SocureInitializer.init(SOCURE_PUBLIC_KEY).then((lib: any) => {
      lib.init(SOCURE_PUBLIC_KEY, "#main-socure", config).then(function () {
        lib.start(2, input);
      });
    });
  }, []);

  const isDocumentUploaded =
    form.socureDeviceId.length !== 0 && form.socureDocumentId.length !== 0;

  return (
    <>
      {isDocumentUploaded && (
        <Row style={{ justifyContent: "center" }}>
          <Result status="success" title="Documents Uploaded, continue!" />
        </Row>
      )}
      {!isDocumentUploaded && (
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
          />
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
