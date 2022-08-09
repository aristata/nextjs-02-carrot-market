import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import useUser from "@libs/client/useUser";

function UserCheck() {
  const { user } = useUser();
  return null;
}

const fetcher = (url: string) => fetch(url).then((response) => response.json());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: fetcher }}>
      <div className="w-full max-w-xl mx-auto">
        <UserCheck />
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
