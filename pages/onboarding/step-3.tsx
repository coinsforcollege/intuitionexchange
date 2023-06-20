import { css } from "@emotion/css";
import { Button, Result, Row, Space, Spin } from "antd";
import { NotificationContext } from "context/notification";
import { OnboardingAuthContext } from "context/protect-route-onboarding";
import React from "react";
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
      dob?: string;
      documentNumber?: string;
      expirationDate?: string;
      firstName?: string;
      fullName?: string;
      issueDate?: string;
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
  const [start, setStart] = React.useState(false);
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
            "reject"
          ) {
            setError(
              "Apologies, but the documents you uploaded are not acceptable. Please try again or contact support"
            );
          } else {
            setForm((prev) => ({
              ...prev,
              socureDocumentId: response.documentUuid,
            }));
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
    setStart(true);

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

  function GetScreen() {
    if (error.length > 0) {
      return (
        <Row style={{ justifyContent: "center" }}>
          <Result
            status="error"
            title="Something went wrong!"
            subTitle={error}
            extra={
              <Button
                loading={loading}
                onClick={() => {
                  setError("");
                  startSocure();
                }}
                type="primary"
              >
                Try Again
              </Button>
            }
          />
        </Row>
      );
    } else if (isDocumentUploaded) {
      return (
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
      );
    } else if (!start) {
      return (
        <Row
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h2>Things to keep in mind during the verification process:</h2>
          <ul
            className={css({
              listStyle: "none",
            })}
          >
            <li>
              <span role="img" aria-label="checkmark">
                &#10004;
              </span>
              Camera for image capture has a minimum of 5 megapixels.
            </li>
            <li>
              <span role="img" aria-label="cross">
                &#10060;
              </span>
              Camera resolution is too low or camera is out of focus, lens is
              not clean.
            </li>
            <br />
            <li>
              <span role="img" aria-label="checkmark">
                &#10004;
              </span>
              ID occupies most (85-90%) of the overall image, and the edges of
              the ID are visible.
            </li>
            <li>
              <span role="img" aria-label="cross">
                &#10060;
              </span>
              ID has too much space around the edges.
            </li>
            <br />
            <li>
              <span role="img" aria-label="checkmark">
                &#10004;
              </span>
              ID is photographed on a solid, contrasting background.
            </li>
            <li>
              <span role="img" aria-label="cross">
                &#10060;
              </span>
              ID is photographed on a white background (or a similar background
              color as the ID).
            </li>
            <br />
            <li>
              <span role="img" aria-label="checkmark">
                &#10004;
              </span>
              ID is photographed in an upright position.
            </li>
            <li>
              <span role="img" aria-label="cross">
                &#10060;
              </span>
              ID is photographed in a skewed or rotated position.
            </li>
            <br />
            <li>
              <span role="img" aria-label="checkmark">
                &#10004;
              </span>
              ID image is clear and in focus with all details readable.
            </li>
            <li>
              <span role="img" aria-label="cross">
                &#10060;
              </span>
              ID image is blurred or obfuscated.
            </li>
            <br />
            <li>
              <span role="img" aria-label="checkmark">
                &#10004;
              </span>
              ID is well-lit during image capture.
            </li>
            <li>
              <span role="img" aria-label="cross">
                &#10060;
              </span>
              ID image has high glare or reflection (often caused by camera
              flash).
            </li>
            <br />
            <li>
              <span role="img" aria-label="checkmark">
                &#10004;
              </span>
              ID barcodes are visible in the image. Note that barcodes can be
              located on either the front or the back of the ID.
            </li>
            <li>
              <span role="img" aria-label="cross">
                &#10060;
              </span>
              ID barcode is missing or obfuscated in the image.
            </li>
          </ul>
          <Button type="primary" onClick={startSocure}>
            Start KYC
          </Button>
        </Row>
      );
    } else {
      return (
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
      );
    }
  }

  return (
    <>
      {GetScreen()}
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
