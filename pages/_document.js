import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="google-site-verification" content="T5vTCzLN624DPglsqSZcxXYGii9cxtjC7e0BQIpazxY" />
        <meta name="msvalidate.01" content="A15390E60B0057715C784052E3E98F10" />
        <meta name="naver-site-verification" content="1e79b713fa8d4963c8dfacdbe6b0cc7cd301a93a" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
