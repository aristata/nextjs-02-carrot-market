import type { NextPage } from "next";
import Button from "@components/button";
import TextArea from "@components/textarea";
import Input from "@components/input";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { Stream } from "@prisma/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface CreateStreamForm {
  title: string;
  price: number;
  description: string;
  formErrors?: string;
}
interface CreateStreamResponse {
  ok: boolean;
  stream: Stream;
}
const CreateStream: NextPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<CreateStreamForm>();
  const [createStream, { data, loading }] =
    useMutation<CreateStreamResponse>(`/api/streams`);
  const onValid = (form: CreateStreamForm) => {
    if (loading) return;
    createStream(form);
  };
  const router = useRouter();
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Create Stream">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input
          register={register("title", { required: "제목을 입력해 주세요" })}
          required
          label="Title"
          name="title"
          type="text"
        />
        <Input
          register={register("price", { required: "가격을 입력해 주세요" })}
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", {
            required: "설명을 입력해 주세요"
          })}
          name="description"
          label="Description"
        />
        <Button loading={loading} text="Create stream" />
      </form>
    </Layout>
  );
};

export default CreateStream;
