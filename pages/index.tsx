import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import Head from "next/head";
import { Product } from "@prisma/client";
import useSWR, { SWRConfig } from "swr";
import Image from "next/image";
import productIcon from "../public/icon-product.jpg";
import client from "@libs/server/prismaClient";

export interface ProductWithCount extends Product {
  _count: {
    favorites: number;
  };
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductsResponse>("/api/products");
  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 divide-y">
        {data
          ? data.products?.map((product) => (
              <Item
                id={product.id}
                key={product.id}
                title={product.name}
                price={product.price}
                hearts={product._count?.favorites || 0}
                imageURL={product.imageUrl}
              />
            ))
          : "Loading..."}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
      {/* <Image src={productIcon} placeholder="blur" quality={10} alt="" /> */}
    </Layout>
  );
};

/**
 * SSR 과 SWR 을 함께 사용하여 기본값이 있는 pre-render 를 구현할 수 있다
 *
 * 현재 코드가 어떻게 실행되는지 분석을 해보자
 * 먼저 index.tsx 파일이 호출되면, export default 로 SWRPage 가 설정되어 있기 때문에 아래 코드가 실행될 것이다
 * 이때 props 를 필요로 하기 때문에 같은 파일 안에 선언되어 있는 getServerSideProps() 가 먼저 호출된다
 * getServerSideProps() 에서 products 를 조회 하여 반환할 것이다
 * 이 products 에는 _count 가 없다
 * SWRConfig 의 value 로 fallback 값을 가진 객체가 세팅 되는데,
 * 이 코드의 의미는 Key "/api/products" 의 초기 데이터로 ok:true 와 products 를 가진 object 를 세팅한다는 뜻이다
 * SWR 초기 값을 가진 상태로 Home 컴포넌트가 렌더링되어 일차적으로 화면에 그려진다
 * Home 컴포넌트 안에서 useSWR 을 호출하고 있는데,
 * fallback 에 선언된 키에 데이터를 덮어씌워 실제 데이터와 차이가 있다면 리렌더링된다
 * 이 때 products 의 _count 값이 생겨서 좋아요 숫자가 0에서 디비 값으로 변화할 것이다
 */
const SWRPage: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products": {
            ok: true,
            products
          }
        }
      }}
    >
      <Home />
    </SWRConfig>
  );
};

/**
 * getServerSideProps()
 * - 페이지에서 getServerSideProps 함수를 export 하면
 *  Next.js 에서는 getServerSideProps 에서 반환된 데이터를 사용하여 해당 페이지를 미리 렌더링 한다
 * - HTML 코드에 데이터가 삽입된 채로 화면이 그려지기 때문에 이를 서버 사이드 렌더링 (SSR) 이라고 부른다
 * - getServerSideProps 함수를 작성할 때 그 반환 값으로 props 를 가진 object 를 반환하도록 작성해야 한다
 */
export async function getServerSideProps() {
  const products = await client.product.findMany({});
  return {
    props: {
      products: JSON.parse(JSON.stringify(products))
    }
  };
}

export default SWRPage;
