import Document, { Head, Html, Main, NextScript } from "next/document";

/**
 *  - _document.tsx 파일은 HTML 뼈대를 잡을 때 사용한다
 *  - 이 파일은 빌드시 서버에서 한 번만 사용되기 때문에 onClick 과 같은 이벤트 핸들러를 사용할 수 없다
 *  - 주로 앱 전체에 공통적으로 적용할 HTML 마크업을 여기에 사용하면 된다
 *  - 예를 들어 구글 폰트 적용
 */
export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Dongle&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
