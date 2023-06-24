import { LockOutlined, MobileOutlined, RightOutlined } from "@ant-design/icons";
import { Divider, Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { SettingsLayout, SettingsSidebar } from "components/settings-layout";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

function Page() {
  const router = useRouter();

  return (
    <div>
      <div
        className="settings-section-button flex-row"
        onClick={() => router.push("/settings/security/change-password")}
      >
        <LockOutlined style={{ color: "#3067F0", fontSize: "1.25rem" }} />
        <Typography
          style={{ marginLeft: "1rem", flexGrow: 1, fontWeight: 600 }}
        >
          Change Account Password
        </Typography>
        <RightOutlined />
      </div>
      <Divider style={{ margin: "0.5rem 0" }} />
      <div className="settings-section-button flex-row">
        <MobileOutlined style={{ color: "#3067F0", fontSize: "1.25rem" }} />
        <Typography
          style={{ marginLeft: "1rem", flexGrow: 1, fontWeight: 600 }}
        >
          Two Factor Authentication
        </Typography>
        <RightOutlined />
      </div>
    </div>
  );
}

Page.GetLayout = function GetLayout(page: React.ReactElement) {
  return (
    <>
      <Head>
        <title>Security Settings | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header />
        <SettingsLayout selected={SettingsSidebar.Security}>
          {page}
        </SettingsLayout>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
