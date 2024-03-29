import React from "react";

export type CryptocurrencyMarketWidgetProps = {
  colorTheme?: string;
  defaultColumn?: string;
  displayCurrency?: string;
  height?: string | number;
  isTransparent?: boolean;
  locale?: string;
  screener_type?: string;
  width?: string | number;
};

type CryptocurrencyMarketProps = {
  children?: never;
  widgetProps?: CryptocurrencyMarketWidgetProps;
  widgetPropsAny?: any;
};

const CryptocurrencyMarket = (props: CryptocurrencyMarketProps) => {
  const { widgetProps, widgetPropsAny } = props;

  const ref: { current: HTMLDivElement | null } = React.createRef();

  React.useEffect(() => {
    let refValue: any;

    if (ref.current) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/" +
        "embed-widget-screener.js";

      script.async = true;
      script.type = "text/javascript";
      script.innerHTML = JSON.stringify({
        width: 1000,
        height: 490,
        defaultColumn: "overview",
        screener_type: "crypto_mkt",
        displayCurrency: "USD",
        colorTheme: "dark",
        locale: "en",
        ...widgetProps,
        ...widgetPropsAny,
      });

      ref.current.appendChild(script);
      refValue = ref.current;
    }

    return () => {
      if (refValue) {
        while (refValue.firstChild) {
          refValue.removeChild(refValue.firstChild);
        }
      }
    };
  }, [ref, widgetProps, widgetPropsAny]);

  return <div ref={ref} />;
};

export default CryptocurrencyMarket;
