import { Row } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import { ReactElement } from "react";

import { FiatBalance } from "./balance";
import { FiatTransactions } from "./transactions";

export function Page() {
  return (
    <>
      <Row>
        <FiatBalance />
      </Row>
      <Row style={{ paddingTop: "2rem" }}>
        <FiatTransactions />
      </Row>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Fiat | Intuition Exchange</title>
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
