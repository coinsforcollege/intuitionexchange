import { Col, Row } from "antd";
import Footer from "components/footer";
import AdvancedChart from "components/graphs/AdvancedChart";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import { ResponsiveContext } from "context/responsive";
import Head from "next/head";
import React, { ReactElement } from "react";

import { ExchangeContextProvider } from "../../context/exchange-context";
import { HistoryScreen } from "./history";
import { PairsScreen } from "./pairs";
import { QuoteScreen } from "./quote";

export function Page() {
  const { isDarkMode } = React.useContext(ResponsiveContext);
  const [asset, setAsset] = React.useState("BTC");
  const [baseAsset, setBaseAsset] = React.useState("USD");

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={5} xxl={3}>
          <PairsScreen
            base={baseAsset}
            setBase={setBaseAsset}
            asset={asset}
            setAsset={setAsset}
          />
        </Col>
        <Col xs={24} lg={12} xxl={16}>
          <div>
            <AdvancedChart
              widgetProps={{
                theme: isDarkMode ? "dark" : "light",
                symbol: `${asset}${baseAsset}`,
                height: 400,
                toolbar_bg: "transparent",
                hide_side_toolbar: true,
              }}
            />
          </div>
          <div style={{ paddingTop: "12px" }}>
            <HistoryScreen />
          </div>
        </Col>
        <Col xs={24} lg={7} xxl={5}>
          <div>
            <QuoteScreen asset={asset} base={baseAsset} />
          </div>
        </Col>
      </Row>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Exchange | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header fullWidth />
        <div className="container" style={{ maxWidth: "100%" }}>
          <ExchangeContextProvider>{page}</ExchangeContextProvider>
        </div>
        <Footer fullWidth />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
