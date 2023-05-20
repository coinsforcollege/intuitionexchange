import { Col, Row } from "antd";
import Footer from "components/footer";
import AdvancedChart from "components/graphs/AdvancedChart";
import Header, { HeaderKey } from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import { ResponsiveContext } from "context/responsive";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

import { ExchangeContextProvider } from "../../context/exchange-context";
import { HistoryScreen } from "./history";
import { PairsScreen } from "./pairs";
import { QuoteScreen } from "./quote";
import { TradeHistory } from "./trade-history";

export function Page() {
  const router = useRouter();
  const { isDarkMode } = React.useContext(ResponsiveContext);
  const [asset, setAsset] = React.useState("BTC");
  const [baseAsset, setBaseAsset] = React.useState("USD");
  const [selectedBase, setSelectedBase] = React.useState("USD");

  React.useEffect(() => {
    if (router.isReady) {
      if (typeof router.query.pair === "string") {
        const [asset, base] = router.query.pair.split("-");
        if (asset !== undefined && base !== undefined) {
          setAsset(asset.toUpperCase());
          setBaseAsset(base.toUpperCase());
          setSelectedBase(base.toUpperCase());
        }
      }
    }
  }, [router.isReady]);

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={6} xxl={5}>
          <PairsScreen
            selectedBase={selectedBase}
            setSelectedBase={setSelectedBase}
            base={baseAsset}
            setBase={setBaseAsset}
            asset={asset}
            setAsset={setAsset}
          />
        </Col>
        <Col xs={24} lg={10} xxl={12}>
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
        <Col xs={24} lg={8} xxl={7}>
          <div>
            <QuoteScreen asset={asset} base={baseAsset} />
            <div style={{ paddingTop: "1rem" }}>
              <TradeHistory asset={asset} />
            </div>
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
        <Header fullWidth active={HeaderKey.Exchange} />
        <div className="container" style={{ maxWidth: "100%" }}>
          <ExchangeContextProvider>{page}</ExchangeContextProvider>
        </div>
        <Footer fullWidth />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
