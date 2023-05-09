import { css } from "@emotion/css";
import { Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { SettingsLayout, SettingsSidebar } from "components/settings-layout";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import React from "react";

function Page() {
  return (
    <>
      <div>
        <Typography.Title level={4} style={{ paddingBottom: "1rem" }}>
          Exchange Fee Schedule
        </Typography.Title>
        <Typography.Paragraph>
          Understanding the fees associated with trading, depositing, and
          withdrawing on our exchange is essential for a smooth and
          cost-effective experience. This page outlines the various fees that
          apply to different activities on our platform.
        </Typography.Paragraph>
        <ul
          className={css({
            li: {
              paddingBottom: "1rem",
            },
          })}
        >
          <li>
            <Typography style={{ fontSize: "1.125rem" }}>
              <b>Trading Fees</b>
            </Typography>
            <Typography>
              Buy and Sell Fees: For every buy or sell transaction on the
              exchange, a fee of 0.49% of the transaction value is applied.
            </Typography>
          </li>
          <li>
            <Typography style={{ fontSize: "1.125rem" }}>
              <b>P2P Trade Fees</b>
            </Typography>
            <Typography>
              Peer-to-Peer Trading: Engaging in P2P trades on our platform also
              incurs a fee of 0.49% of the total value of the assets being sold.
              This fee is applied to each party involved in the transaction.
            </Typography>
          </li>
          <li>
            <Typography style={{ fontSize: "1.125rem" }}>
              <b>Deposit and Withdrawal Fees</b>
            </Typography>
            <Typography>
              Deposit Fees: There are no fees for depositing funds into your
              account on our exchange.
              <br />
              Withdrawal Fees: Similarly, there are no fees for withdrawing
              funds from your account. You can move your assets off the exchange
              without incurring extra charges.
            </Typography>
          </li>
        </ul>
      </div>
      <div>
        <Typography.Title level={4} style={{ paddingBottom: "1rem" }}>
          Account Limits and Fee Changes
        </Typography.Title>
        <ul
          className={css({
            li: {
              paddingBottom: "1rem",
            },
          })}
        >
          <li>
            <Typography style={{ fontSize: "1.125rem" }}>
              <b>Account Limits</b>
            </Typography>
            <Typography>
              Please be aware that there may be certain limits on your account,
              which affect how much you can buy and sell of a particular asset.
              To check these limits, visit the account limits section in your
              profile.
            </Typography>
          </li>
          <li>
            <Typography style={{ fontSize: "1.125rem" }}>
              <b>Fee Changes</b>
            </Typography>
            <Typography>
              Our fees are subject to change without prior notice. However, rest
              assured that a quote will be presented to you before any
              transaction is executed, allowing you to confirm and accept the
              updated fees.
            </Typography>
          </li>
          <li>
            <Typography style={{ fontSize: "1.125rem" }}>
              <b>Standard Rates</b>
            </Typography>
            <Typography>
              The fees listed on this page are our standard rates and do not
              take into account any promotional offers or discounts. Stay tuned
              for announcements about special offers that may reduce your
              trading costs.
            </Typography>
          </li>
        </ul>
        <Typography.Paragraph>
          By familiarizing yourself with the fee structure on our exchange, you
          can make informed decisions about your trading activities and maximize
          your potential gains. If you have any questions or concerns about our
          fees, please don&apos;t hesitate to reach out to our support team.
        </Typography.Paragraph>
      </div>
    </>
  );
}

Page.GetLayout = function GetLayout(page: React.ReactElement) {
  return (
    <>
      <Head>
        <title>Fees - Settings | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header />
        <SettingsLayout selected={SettingsSidebar.Fees}>{page}</SettingsLayout>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
