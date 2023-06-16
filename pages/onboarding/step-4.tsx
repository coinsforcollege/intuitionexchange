import { Button, List, Result, Space, Typography } from "antd";
import { OnboardingAuthContext } from "context/protect-route-onboarding";
import { useRouter } from "next/router";
import React from "react";

import { IOnboardingStatus } from "./index.page";

export default function OnboardingStep3({
  refreshStatus,
  status,
  reApply,
}: {
  reApply: () => Promise<void>;
  refreshStatus: () => void;
  status: IOnboardingStatus;
}) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { refresh } = React.useContext(OnboardingAuthContext);

  const isError = status.errors.length > 0;

  const SuccessScreen = () => (
    <>
      <Result
        status="success"
        title="Congratulations!"
        subTitle="Your InTuition Exchange account is ready."
        extra={[
          <Button
            key="action"
            type="primary"
            onClick={async () => {
              await refresh();
              router.replace("/exchange");
            }}
          >
            Start Trading
          </Button>,
        ]}
      />
    </>
  );

  const PendingScreen = () => (
    <>
      <Result
        style={{ padding: "1rem 0" }}
        status={!isError ? "info" : "warning"}
        title={
          isError || status.success !== 0
            ? "Account creation was unsuccessful!"
            : "Onboarding complete!"
        }
        subTitle={
          isError || status.success !== 0
            ? "We were unable to authenticate the information provided by you. Please try again with correct identity details."
            : "It can take up to 5 minutes to process the information you provided. Click on refresh to check status of your account."
        }
        extra={[
          <Space
            key="actions"
            direction="vertical"
            style={{ textAlign: "start" }}
          >
            {status.errors.length > 0 && (
              <div>
                <List
                  header={<div style={{ color: "#dc4446" }}>Exceptions</div>}
                  bordered
                  dataSource={status.errors}
                  renderItem={(item) => (
                    <List.Item>
                      <Typography.Text>{item.description}</Typography.Text>
                    </List.Item>
                  )}
                />
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                justifyContent: "center",
                padding: "1rem 0",
              }}
            >
              <Button
                loading={loading}
                disabled={!isError || status.success !== 0}
                type="primary"
                onClick={async () => {
                  setLoading(true);
                  await reApply();
                  setLoading(false);
                }}
              >
                Close and Restart application
              </Button>
              <Button onClick={refreshStatus}>Refresh</Button>
            </div>
          </Space>,
        ]}
      />
    </>
  );

  const GetScreen = () => {
    if (status.success) {
      return <SuccessScreen />;
    }

    return <PendingScreen />;
  };

  return (
    <>
      <GetScreen />
      <div style={{ textAlign: "center" }}>
        <Typography.Title level={5}>
          Please write to us at support@intuitionexchange.com with the above
          details for more help.
        </Typography.Title>
      </div>
    </>
  );
}
