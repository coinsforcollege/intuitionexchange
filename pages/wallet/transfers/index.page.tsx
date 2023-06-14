import { Tabs, TabsProps } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import { ReactElement } from "react";

import { AssetTransfers } from "./asset";
import { FiatTransfers } from "./fiat";

function Page() {
  const items: TabsProps["items"] = [
    {
      key: "fiat",
      label: `Fiat`,
      children: <FiatTransfers />,
    },
    {
      key: "asset",
      label: `Asset`,
      children: <AssetTransfers />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Fiat History | Intuition Exchange</title>
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
