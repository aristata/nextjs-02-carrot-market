import type { NextPage } from "next";
import Layout from "@components/layout";
import Input from "@components/input";
import TextArea from "@components/textarea";
import Button from "@components/button";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const ItemUpload: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [uploadProduct, { loading, data }] =
    useMutation<UploadProductMutation>("/api/products");
  const photo = watch("photo");
  const [photoPreview, setPhotoPreview] = useState("");
  const onValid = async ({ name, price, description }: UploadProductForm) => {
    if (loading) return;
    if (photo && photo.length > 0) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const imageForm = new FormData();
      const fileName = `${name}_${Date.now()}`;
      imageForm.append("file", photo[0], fileName);
      const {
        result: { id }
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: imageForm
        })
      ).json();

      const avatarUrl = `https://imagedelivery.net/lsllCjR7DyIdCm2ctTC0DQ/${id}`;
      uploadProduct({ name, price, description, photoUrl: avatarUrl });
    } else {
      uploadProduct({ name, price, description });
    }
  };
  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);
  return (
    <Layout canGoBack title="Upload product">
      <form className={"p-4 space-y-4"} onSubmit={handleSubmit(onValid)}>
        <div>
          {photoPreview ? (
            <img
              src={photoPreview}
              className="w-full text-gray-600  h-46 rounded-md"
            />
          ) : (
            <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("photo")}
                accept="image/*"
                className="hidden"
                type="file"
              />
            </label>
          )}
        </div>
        <Input
          register={register("name", { required: true })}
          label="Name"
          name="name"
          type="text"
          required
        />
        <Input
          register={register("price", { required: true })}
          label="Price"
          name="price"
          type="text"
          kind="price"
          required
        />
        <TextArea
          register={register("description", { required: true })}
          label="Description"
          name="description"
          required
        />
        <Button loading={loading} text="Upload item" />
      </form>
    </Layout>
  );
};

export default ItemUpload;
