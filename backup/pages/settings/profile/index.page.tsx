import { EditOutlined, InboxOutlined, MobileOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Space, Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { SettingsLayout, SettingsSidebar } from "components/settings-layout";
import {
  UserAuthContext,
  UserAuthContextProvider,
} from "context/protect-route-user";
import Head from "next/head";
import Link from "next/link";
import React from "react";

function Page() {
  const { user } = React.useContext(UserAuthContext);

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <Typography.Title level={4}>
          {user.firstName} {user.middleName} {user.lastName}
        </Typography.Title>
        <div
          className={css({
            display: "flex",
            alignItems: "center",
          })}
        >
          <InboxOutlined style={{ fontSize: "1.25rem" }} />
          <Typography
            style={{
              fontSize: "1.25rem",
              paddingLeft: "1rem",
              flexGrow: 1,
              fontWeight: 600,
            }}
          >
            {user.email}
          </Typography>
          <Link href="/settings/profile/email">
            <EditOutlined style={{ fontSize: "1.25rem" }} />
          </Link>
        </div>
        <div
          className={css({
            display: "flex",
            alignItems: "center",
          })}
        >
          <MobileOutlined style={{ fontSize: "1.25rem" }} />
          <Typography
            style={{
              fontSize: "1.25rem",
              paddingLeft: "1rem",
              flexGrow: 1,
              fontWeight: 600,
            }}
          >
            +{user.phoneCountry}-{user.phone}
          </Typography>
          <Link href="/settings/profile/phone">
            <EditOutlined style={{ fontSize: "1.25rem" }} />
          </Link>
        </div>
      </Space>
    </div>
  );
}

Page.GetLayout = function GetLayout(page: React.ReactElement) {
  return (
    <>
      <Head>
        <title>Profile settings | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header />
        <SettingsLayout selected={SettingsSidebar.Profile}>
          {page}
        </SettingsLayout>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
