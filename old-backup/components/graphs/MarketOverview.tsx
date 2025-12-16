import React from "react";

export type MarketOverviewWidgetProps = {
  belowLineFillColorFalling?: string;
  belowLineFillColorGrowing?: string;
  colorTheme?: string;
  dateRange?: string;
  gridLineColor?: string;
  height?: string | number;
  isTransparent?: boolean;
  largeChartUrl?: string;
  locale?: string;
  plotLineColorFalling?: string;
  plotLineColorGrowing?: string;
  scaleFontColor?: string;
  showChart?: boolean;
  showSymbolLogo?: boolean;
  symbolActiveColor?: string;
  tabs?: any;
  width?: string | number;
};

type MarketOverviewProps = {
  children?: never;
  widgetProps?: MarketOverviewWidgetProps;
  widgetPropsAny?: any;
};

const MarketOverview = (props: MarketOverviewProps) => {
  const { widgetProps, widgetPropsAny } = props;

  const ref: { current: HTMLDivElement | null } = React.createRef();

  React.useEffect(() => {
    let refValue: any;

    if (ref.current) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/" +
        "embed-widget-market-overview.js";

      script.async = true;
      script.type = "text/javascript";
      script.innerHTML = JSON.stringify({
        colorTheme: "dark",
        dateRange: "12M",
        showChart: true,
        locale: "en",
        largeChartUrl: "",
        isTransparent: false,
        showSymbolLogo: true,
        width: "400",
        height: "660",
        plotLineColorGrowing: "rgba(25, 118, 210, 1)",
        plotLineColorFalling: "rgba(25, 118, 210, 1)",
        gridLineColor: "rgba(42, 46, 57, 1)",
        scaleFontColor: "rgba(120, 123, 134, 1)",
        belowLineFillColorGrowing: "rgba(33, 150, 243, 0.12)",
        belowLineFillColorFalling: "rgba(33, 150, 243, 0.12)",
        symbolActiveColor: "rgba(33, 150, 243, 0.12)",
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

export default MarketOverview;
