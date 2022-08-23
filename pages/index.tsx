import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import Head from "next/head";
import { Product } from "@prisma/client";
import useSWR from "swr";
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

const Home: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<ProductsResponse>("/api/products");
  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            hearts={product._count.favorites}
            imageURL={product.imageUrl}
          />
        ))}
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
 * getServerSideProps()
 * - 페이지에서 getServerSideProps 함수를 export 하면
 *  Next.js 에서는 getServerSideProps 에서 반환된 데이터를 사용하여 해당 페이지를 미리 렌더링 한다
 * - HTML 코드에 데이터가 삽입된 채로 화면이 그려지기 때문에 이를 서버 사이드 렌더링 (SSR) 이라고 부른다
 * - getServerSideProps 함수를 작성할 때 그 반환 값으로 props 를 가진 object 를 반환하도록 작성해야 한다
 */
export async function getServerSideProps() {
  const products = await client.product.findMany({
    include: {
      _count: {
        select: {
          favorites: true
        }
      }
    }
  });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products))
    }
  };
}

export default Home;
