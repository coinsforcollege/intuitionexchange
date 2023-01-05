import { Row } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import { ReactElement } from "react";

import { AssetBalance } from "./balance";
import { AssetTransactions } from "./transactions";

export function Page() {
  return (
    <>
      <Row>
        <AssetBalance />
      </Row>
      <Row style={{ paddingTop: "2rem" }}>
        <AssetTransactions />
      </Row>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Assets | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header />
        <div className="container">{page}</div>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
