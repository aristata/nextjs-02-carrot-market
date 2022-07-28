import type { NextPage } from "next";
import Layout from "@components/layout";
import Button from "@components/button";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { Product, User } from "@prisma/client";
import Link from "next/link";

interface ProductWithUser extends Product {
  user: User;
}

interface ProductDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
}

const ProductDetail: NextPage = () => {
  const router = useRouter();
  const { data, error } = useSWR<ProductDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!data && !error) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [data, error]);
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
              ${isLoading ? "Loading..." : data?.product?.price}
            </span>
            <p className="text-gray-700 my-6">
              {isLoading ? "Loading..." : data?.product?.description}
            </p>
            <div className="flex items-center justify-between space-x-2">
              <Button text="Talk to seller" large />
              <button className="flex p-3 rounded-md items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500">
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
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="grid grid-cols-2 gap-4 mt-5">
            {data?.relatedProducts.map((relatedProduct) => (
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
