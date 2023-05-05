import { Button, Checkbox, Col, Row, Space } from "antd";
import React from "react";

export default function OnboardingStep1({
  agreement,
  loading,
  onBack,
  onFinish,
}: {
  agreement: string;
  loading: boolean;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [agree, setAgree] = React.useState(false);
  const [read, setRead] = React.useState(false);

  React.useEffect(() => {
    const agreementDiv = document.getElementById("agreement");

    if (agreementDiv) {
      agreementDiv.addEventListener("scroll", () => {
        if (
          agreementDiv.scrollTop + agreementDiv.clientHeight >=
          agreementDiv.scrollHeight
        ) {
          if (!read) {
            setRead(true);
          }
        }
      });
    }
  }, []);

  return (
    <>
      <Row>
        <div
          id="agreement"
          style={{
            background: "white",
            color: "black",
            padding: "1rem",
            borderRadius: "8px",
            maxHeight: 600,
            overflowY: "auto",
          }}
          dangerouslySetInnerHTML={{ __html: agreement }}
        />
      </Row>
      <Row style={{ paddingTop: "2rem" }}>
        <Col>
          <Row style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
            <Checkbox checked={agree} onChange={() => setAgree(!agree)}>
              I have read and accept the Prime Trust user agreement.
            </Checkbox>
          </Row>
          <Space>
            <Button disabled={loading} type="dashed" onClick={onBack}>
              Back
            </Button>
            <Button
              disabled={loading || !agree}
              type="primary"
              onClick={onFinish}
            >
              Submit
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
}
