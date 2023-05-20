import { Col, Row } from "antd";
import Footer from "components/footer";
import Header, { HeaderKey } from "components/header";
import { ExchangeContextProvider } from "context/exchange-context";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { OrderType } from "types";

import { HistoryScreen } from "./history";
import { MatchScreen } from "./match-screen";
import { PairsScreen } from "./pairs";
import { QuoteScreen } from "./quote";
import { VolumeScreen } from "./volume";

export function Page() {
  const router = useRouter();
  const [asset, setAsset] = React.useState("BTC");
  const [selectedBase, setSelectedBase] = React.useState("USD");
  const [baseAsset, setBaseAsset] = React.useState("USD");
  const [orderType, setOrderType] = React.useState<OrderType>(OrderType.Buy);
  const [unit, setUnit] = React.useState(0);
  const [price, setPrice] = React.useState(0);

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
            <HistoryScreen />
          </div>
          <div style={{ paddingTop: "1rem" }}>
            <MatchScreen
              asset={asset}
              base={baseAsset}
              unit={unit}
              setUnit={setUnit}
              price={price}
              setPrice={setPrice}
            />
          </div>
        </Col>
        <Col xs={24} lg={8} xxl={7}>
          <div>
            <QuoteScreen
              asset={asset}
              base={baseAsset}
              orderType={orderType}
              setOrderType={setOrderType}
              unit={unit}
              setUnit={setUnit}
              price={price}
              setPrice={setPrice}
            />
          </div>
          <div style={{ paddingTop: "1rem" }}>
            <VolumeScreen
              asset={asset}
              base={baseAsset}
              setOrderType={setOrderType}
              unit={unit}
              setUnit={setUnit}
              price={price}
              setPrice={setPrice}
            />
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
        <title>P2P | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header fullWidth active={HeaderKey.P2P} />
        <div className="container" style={{ maxWidth: "100%" }}>
          <ExchangeContextProvider>{page}</ExchangeContextProvider>
        </div>
        <Footer fullWidth />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
