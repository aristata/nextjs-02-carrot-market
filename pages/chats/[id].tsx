import type {NextPage} from "next";
import Layout from "../../components/layout";
import Message from "../../components/message";

const ChatDetail: NextPage = () => {
  return (
    <Layout canGoBack title="장성민">
      <div className={"px-4 py-10 pb-16 space-y-4"}>
        <Message message="안녕하세요. 얼마에 파실 건가요?"/>
        <Message message="20,000원" reversed/>
        <Message message="도른자"/>
        <Message message="꺼졍!" reversed/>
        <form className="fixed py-2 bg-white bottom-0 inset-x-0">
          <div className="relative flex items-center max-w-md mx-auto w-full">
            <input type="text"
                   className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none focus:border-orange-500 pr-12"/>
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button
                className="flex items-center rounded-full bg-orange-500 text-white text-sm px-2 hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer">&rarr;</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
