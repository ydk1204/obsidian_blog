import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="google-site-verification" content="T5vTCzLN624DPglsqSZcxXYGii9cxtjC7e0BQIpazxY" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
