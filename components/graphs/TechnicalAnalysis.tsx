import React from "react";

export type TechnicalAnalysisWidgetProps = {
  colorTheme?: string;
  height?: string | number;
  interval?: string;
  isTransparent?: boolean;
  locale?: string;
  showIntervalTabs?: boolean;
  symbol?: string;
  width?: string | number;
};

type TechnicalAnalysisProps = {
  children?: never;
  widgetProps?: TechnicalAnalysisWidgetProps;
  widgetPropsAny?: any;
};

const TechnicalAnalysis = (props: TechnicalAnalysisProps) => {
  const { widgetProps, widgetPropsAny } = props;

  const ref: { current: HTMLDivElement | null } = React.createRef();

  React.useEffect(() => {
    let refValue: any;

    if (ref.current) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/" +
        "embed-widget-technical-analysis.js";

      script.async = true;
      script.type = "text/javascript";
      script.innerHTML = JSON.stringify({
        symbol: "NASDAQ:NVDA",
        showIntervalTabs: true,
        interval: "1m",
        width: 425,
        height: 450,
        isTransparent: false,
        locale: "en",
        colorTheme: "dark",
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
  }, [widgetProps?.symbol]);

  return <div ref={ref} />;
};

export default TechnicalAnalysis;
