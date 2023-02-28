import React from "react";

declare const TradingView: any;

export type AdvancedChartWidgetProps = {
  allow_symbol_change?: boolean;
  autosize?: boolean;
  container_id?: string;
  enable_publishing?: boolean;
  height?: string | number;
  hide_side_toolbar?: boolean;
  hide_top_toolbar?: boolean;
  interval?: string;
  locale?: string;
  range?: string;
  save_image?: boolean;
  style?: string;
  symbol?: string;
  theme?: string;
  timezone?: string;
  toolbar_bg?: string;
  width?: string | number;
  withdateranges?: boolean;
};

type AdvancedChartProps = {
  children?: never;
  widgetProps?: AdvancedChartWidgetProps;
  widgetPropsAny?: any;
};

const AdvancedChart = (props: AdvancedChartProps) => {
  const { widgetProps, widgetPropsAny } = props;

  let containerId = "advanced-chart-widget-container";
  if (widgetProps?.container_id) {
    containerId = widgetProps?.container_id;
  }

  const ref: { current: HTMLDivElement | null } = React.createRef();

  React.useEffect(() => {
    let refValue: any;

    if (ref.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        if (typeof TradingView !== "undefined") {
          new TradingView.widget({
            width: "100%",
            height: "640px",
            symbol: "BITMEX:XBTUSD",
            interval: "240",
            range: "1M",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "9",
            locale: "en",
            toolbar_bg: "rgba(0, 0, 0, 0.8)",
            hide_top_toolbar: false,
            hide_side_toolbar: false,
            withdateranges: true,
            save_image: true,
            enable_publishing: false,
            container_id: containerId,
            ...widgetProps,
            ...widgetPropsAny,
          });
        }
      };
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
  }, [widgetProps?.symbol, widgetProps?.theme]);

  return <div id={containerId} ref={ref} />;
};

export default AdvancedChart;
