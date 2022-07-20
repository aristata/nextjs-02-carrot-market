import type { NextPage } from "next";
import Layout from "@components/layout";
import Link from "next/link";

const Chat: NextPage = () => {
  return (
    <Layout title="채팅" hasTabBar>
      <div className="py-10 divide-y-[1px]">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <Link href={`/chats/${i}`} key={i}>
            <a className="px-6 py-3 flex items-center space-x-3 cursor-pointer">
              <div className="w-12 h-12 bg-slate-300 rounded-full" />
              <div>
                <p className="text-gray-700">장성민</p>
                <p className="text-sm text-gray-500">
                  내일 정오에 1층에서 만나요
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chat;
