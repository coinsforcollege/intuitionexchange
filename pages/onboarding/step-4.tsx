import { Button, List, Result, Space, Tooltip, Typography } from "antd";
import { OnboardingAuthContext } from "context/protect-route-onboarding";
import { useRouter } from "next/router";
import React from "react";

import { IOnboardingStatus } from "./index.page";

export default function OnboardingStep3({
  refreshStatus,
  status,
  reApply,
}: {
  reApply: () => void;
  refreshStatus: () => void;
  status: IOnboardingStatus;
}) {
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
        status={!isError && !status.maxLimitReached ? "info" : "warning"}
        title={
          isError || (status.maxLimitReached && status.success !== 0)
            ? "Account creation was unsuccessful!"
            : "Onboarding complete!"
        }
        subTitle={
          isError || (status.maxLimitReached && status.success !== 0)
            ? "We were unable to authenticate the information provided by you. Please try again with correct identity details."
            : "It can take upto 5 minutes to process the information you provided. You can refresh the page to check status of your account."
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
              <Tooltip
                title={
                  status.total >= 2
                    ? "You have reached the maximum number of applications you can make for an exchange account, please contact our support staff"
                    : undefined
                }
              >
                <Button
                  disabled={
                    !isError || status.success !== 0 || status.maxLimitReached
                  }
                  type="primary"
                  onClick={reApply}
                >
                  Close and Restart application
                </Button>
              </Tooltip>
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
