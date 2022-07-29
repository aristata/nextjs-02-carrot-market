import type { NextPage } from "next";
import Layout from "@components/layout";
import Button from "@components/button";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { useEffect, useState } from "react";
import { Product, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/frontend/useMutation";
import { cls } from "@libs/frontend/utils";

interface ProductWithUser extends Product {
  user: User;
}

interface ProductDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  isLiked: boolean;
  relatedProducts: Product[];
}

const ProductDetail: NextPage = () => {
  const router = useRouter();
  /* 
    [ bound mutate 사용 ]
    ( https://swr.vercel.app/ko/docs/mutation#%EB%B0%94%EC%9D%B8%EB%94%A9-%EB%90%9C-%EB%AE%A4%ED%85%8C%EC%9D%B4%ED%8A%B8 )
    useSWR에 의해 반환된 SWR 객체는 SWR의 키로 미리 바인딩 된 mutate() 함수를 포함하고 있습니다.
    bound mutate 함수는 기능적으로 전역 mutate 함수와 동일합니다. 하지만 key 파라미터를 요구하지 않습니다.
    mutate 를 사용하면 캐싱된 데이터를 갱신하여, 백엔드에서 최신 데이터를 가져 오기 전에 UI 를 갱신하는 장점이 있습니다.
    이를 낙관적(=optimistic) UI 업데이트 라고하는데,
    백엔드로부터 응답 데이터를 받기 전에 요청이 성공할 것이라고 낙관하고,
    미리 UI 를 갱신하기 때문에 붙여진 이름입니다.
  */
  const {
    data,
    error,
    mutate: boundMutate
  } = useSWR<ProductDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );

  /*
    [ unbound mutate 사용 ]
    ( https://swr.vercel.app/ko/docs/mutation#%EA%B0%B1%EC%8B%A0%ED%95%98%EA%B8%B0 )
    useSWRConfig() hook으로부터 mutate 함수를 얻을 수 있으며,
    mutate(key)를 호출하여 동일한 키를 사용하는 다른 SWR hook에게 갱신 메시지를 전역으로 브로드캐스팅할 수 있습니다.
    
    쉽게 말해 같은 화면의 데이터를 변경하길 원한다면, bound mutate 를 사용하고
    다른 화면의 데이터를 변경하길 원한다면, unbound mutate 를 사용하면 됩니다.
  */
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!data && !error) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [data, error]);

  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    // data 가 없으면 함수 종료
    if (!data) return;

    /* 
      mutate 함수의 첫번째 인자는 변경될 데이터 값 입니다.
      
      두번째 인자는 백엔드로 데이터를 검증할 것인지 여부 입니다.
      만약 두번째 인자의 값이 true 이었다면, 
        UI 에 먼저 변경된 데이터를 보여주고, 
        백그라운드에서 백엔드에 데이터 조회를 한 다음,
        백에서 가져온 데이터를 다시 UI 에 덮어씌웁니다.
    */
    boundMutate({ ...data, isLiked: !data.isLiked }, false);

    // unbound mutate 예
    // mutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
    // 만약 단순히 fetch 만 하고 싶다면 다음과 같이 사용할 수도 있습니다.
    // 이 경우에는 데이터만 갱신하는 효과가 있습니다.
    // mutate("/api/users/me")

    // 실제로 백엔드의 데이터를 갱신할 요청을 백엔드에 보냅니다.
    toggleFav({});
  };
  return (
    <Layout canGoBack>
      <div className="p-4">
        <div className="mb-8">
          <div className="h-96 bg-slate-300" />
          <div className="flex items-center space-x-3 py-3 border-b border-t cursor-pointer">
            <div className="w-12 h-12 bg-slate-300 rounded-full" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isLoading ? "Loading..." : data?.product?.user?.name}
              </p>
              <Link href={`/users/profiles/${data?.product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {isLoading ? "Loading..." : data?.product?.name}
            </h1>
            <span className="text-2xl text-gray-900 block mt-3">
              ₩{isLoading ? "Loading..." : data?.product?.price}
            </span>
            <p className="text-gray-700 my-6">
              {isLoading ? "Loading..." : data?.product?.description}
            </p>
            <div className="flex items-center justify-between space-x-2">
              <Button text="Talk to seller" large />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex p-3 rounded-md items-center justify-center hover:bg-gray-100",
                  data?.isLiked
                    ? "text-red-400 hover:text-red-500"
                    : "text-gray-400 hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="grid grid-cols-2 gap-4 mt-5">
            {data?.relatedProducts?.map((relatedProduct) => (
              <Link
                href={`/products/${relatedProduct.id}`}
                key={relatedProduct.id}
              >
                <a>
                  <div className="h-56 w-full bg-slate-300 mb-2" />
                  <h3 className="text-gray-700 -mb-1">{relatedProduct.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    ￦{relatedProduct.price}
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
