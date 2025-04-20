import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" style={{ height: "100vh" }}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Anonymous+Pro"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body className="antialiased" style={{ height: "100vh" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
