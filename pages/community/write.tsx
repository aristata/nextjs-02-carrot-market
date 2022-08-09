import type { NextPage } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import Button from "@components/button";
import { Post } from "@prisma/client";
import { useForm, FieldErrorsImpl } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  // 라우터
  const router = useRouter();

  // 스테이트
  // 위치 정보
  const { latitude, longitude } = useCoords();

  // 폼
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<WriteForm>();

  const onValid = (data: WriteForm) => {
    if (loading) return;
    post({ ...data, latitude, longitude }); // 포스트 데이터를 전송할 때, 위도와 경도 데이터를 함께 전송한다
  };
  const onInvalid = (error: FieldErrorsImpl) => {
    console.error(error);
  };

  // 뮤테이션
  const [post, { loading, data }] = useMutation<WriteResponse>("/api/posts");

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data?.post.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Write Post">
      <form
        onSubmit={handleSubmit(onValid, onInvalid)}
        className="p-4 space-y-4"
      >
        <TextArea
          register={register("question", {
            required: {
              value: true,
              message: "질문을 입력해 주세요"
            },
            maxLength: {
              value: 150,
              message: "최대 150자 까지 입력할 수 있습니다"
            },
            minLength: { value: 10, message: "최소 10자 이상 입력해야 합니다" }
          })}
          required
          placeholder={"Ask a question!"}
        />
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
