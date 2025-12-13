import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { cache as eCache } from "@emotion/css";
import createEmotionServer from "@emotion/server/create-instance";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import React from "react";

function setInitialColorMode() {
  function getInitialColorMode() {
    const preference = window.localStorage.getItem("theme");
    const hasExplicitPreference = typeof preference === "string";
    /**
     * If the user has explicitly chosen light or dark,
     * use it. Otherwise, this value will be null.
     */
    if (hasExplicitPreference) {
      return preference;
    }
    // If there is no saved preference, use a media query
    const mediaQuery = "(prefers-color-scheme: dark)";
    const mql = window.matchMedia(mediaQuery);
    const hasImplicitPreference = typeof mql.matches === "boolean";
    if (hasImplicitPreference) {
      return mql.matches ? "dark" : "light";
    }
    // default to 'light'.
    return "light";
  }
  const colorMode = getInitialColorMode();
  // add HTML attribute if dark mode
  document.documentElement.setAttribute("data-theme", colorMode);
}
// our function needs to be a string
const blockingSetInitialColorMode = `(function() {
		${setInitialColorMode.toString()}
		setInitialColorMode();
})()
`;

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const cache = createCache();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          (
            <StyleProvider cache={cache}>
              <App {...props} />
            </StyleProvider>
          ),
      });

    const page = await ctx.renderPage();
    const { extractCritical } = createEmotionServer(eCache);
    const { ids, css } = extractCritical(page.html);
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <React.Fragment>
          {initialProps.styles}
          {/* This is hack, `extractStyle` does not currently support returning JSX or related data. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `</script>${extractStyle(cache)}<script>`,
            }}
          />
          <style
            data-emotion={`css ${ids.join(" ")}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        </React.Fragment>
      ),
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: blockingSetInitialColorMode,
            }}
          />
          <script
            async
            id="ze-snippet"
            src="https://static.zdassets.com/ekr/snippet.js?key=6928fb7c-3031-448a-8510-336c15e7a88e"
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
