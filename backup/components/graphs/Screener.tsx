import React from "react";

export type ScreenerWidgetProps = {
  colorTheme?: string;
  defaultColumn?: string;
  defaultScreen?: string;
  height?: string | number;
  locale?: string;
  market?: string;
  showToolbar?: boolean;
  width?: string | number;
};

type ScreenerProps = {
  children?: never;
  widgetProps?: ScreenerWidgetProps;
  widgetPropsAny?: any;
};

const Screener = (props: ScreenerProps) => {
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
        width: 1100,
        height: 512,
        defaultColumn: "overview",
        defaultScreen: "general",
        market: "forex",
        showToolbar: true,
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

export default Screener;
