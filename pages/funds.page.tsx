import Footer from "components/footer";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import React, { ReactElement } from "react";

import { AssetBalance } from "./assets/balance";
import { FiatBalance } from "./fiat/balance";

export function Page() {
  return (
    <>
      <div>
        <FiatBalance />
      </div>
      <div style={{ paddingTop: "2rem" }}>
        <AssetBalance />
      </div>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Funds | Intuition Exchange</title>
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
