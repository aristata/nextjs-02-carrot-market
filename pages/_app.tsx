import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import Script from "next/script";

function UserCheck() {
  const { user } = useUser();
  return null;
}

const fetcher = (url: string) => fetch(url).then((response) => response.json());

/**
 * [Script component]
 * - NextJs Script 컴포넌트는 HTML script 태그의 확장 입니다
 * - 개발자는 애플리케이션에서 써드 파티 스크립트의 로드되는 우선 순위를 설정 할 수 있습니다
 * - 이로 인해 페이지가 로드되는 성능을 향상 시킬 수 있습니다
 * - beforeInteractive : 스크립트가 interactive 되기 전에 로드 된다
 * - afterInteractive : 스크립트가 interactive 된 후에 로드 된다
 * - lazyOnload : 다른 소스들을 불러온 이후에 로드 된다
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: fetcher }}>
      <div className="w-full max-w-xl mx-auto">
        <UserCheck />
        <Component {...pageProps} />
      </div>
      {/* <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="lazyOnload"
      />
      <Script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={() => {
          //@ts-ignore
          window.fbAsyncInit = function () {
            //@ts-ignore
            FB.init({
              appId: "your-app-id",
              autoLogAppEvents: true,
              xfbml: true,
              version: "v14.0"
            });
          };
        }}
      /> */}
    </SWRConfig>
  );
}

export default MyApp;
