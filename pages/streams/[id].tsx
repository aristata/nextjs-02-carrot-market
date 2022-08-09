import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream, StreamMessage, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import useUser from "@libs/client/useUser";

interface StreamMessageWithUser extends StreamMessage {
  user: User;
}
interface StreamWithStreamMessages extends Stream {
  streamMessages: StreamMessageWithUser[];
}
interface StreamResponse {
  ok: boolean;
  stream: StreamWithStreamMessages;
}
interface StreamMessageForm {
  message: string;
}

interface StreamMessageResponse {
  ok: boolean;
  streamMessage: StreamMessage;
}

const LiveDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null
  );
  const { register, handleSubmit, reset } = useForm<StreamMessageForm>();
  const [
    postStreamMessage,
    { data: streamMessageData, loading: streamMessageLoading }
  ] = useMutation<StreamMessageResponse>(
    `/api/streams/${router.query.id}/messages`
  );
  const onValid = (form: StreamMessageForm) => {
    if (streamMessageLoading) return;
    reset();
    postStreamMessage(form);
  };
  useEffect(() => {
    if (streamMessageData && streamMessageData.ok) {
      mutate();
    }
  }, [streamMessageData, mutate]);
  return (
    <Layout canGoBack title="라이브 상세보기">
      {data && data.ok ? (
        <div className="py-10 px-4  space-y-4">
          <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {data.stream.title}
            </h1>
            <span className="text-2xl block mt-3 text-gray-900">
              ₩{data.stream.price}
            </span>
            <p className=" my-6 text-gray-700">{data.stream.description}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
            <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
              {data.stream.streamMessages.map((message) => (
                <Message
                  key={message.id}
                  message={message.message}
                  reversed={message.user.id === user?.id}
                />
              ))}
            </div>
            <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
              <form
                onSubmit={handleSubmit(onValid)}
                className="flex relative max-w-md items-center  w-full mx-auto"
              >
                <input
                  {...register("message", { required: true })}
                  type="text"
                  required
                  className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
                />
                <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                  <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                    &rarr;
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <span className="p-4 text-center text-red-500 font-bold block">
          조회 결과가 없습니다
        </span>
      )}
    </Layout>
  );
};

export default LiveDetail;
