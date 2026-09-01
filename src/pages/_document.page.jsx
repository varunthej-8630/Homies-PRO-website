import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Nanum+Pen+Script&display=swap" rel="stylesheet" />
          <link href="/fonts/NeueHaasDisplayBold.woff2" as="font" type="font/woff2" />
          <link href="/fonts/NeueHaasDisplayLight.woff2" as="font" type="font/woff2" />
          <link href="/fonts/NeueHaasDisplayLightItalic.woff2" as="font" type="font/woff2" />
          <link href="/fonts/NeueHaasDisplayMedium.woff2" as="font" type="font/woff2" />
          <link href="/fonts/NeueHaasDisplayRoman.woff2" as="font" type="font/woff2" />
          <link href="/fonts/NeueHaasDisplayRomanItalic.woff2" as="font" type="font/woff2" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
