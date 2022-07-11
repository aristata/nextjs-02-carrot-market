import type {NextPage} from "next";

const Chats: NextPage = () => {
  return (
    <div className="py-10 divide-y-[1px]">
      {[1, 2, 3, 4, 5, 6].map((_, i) => (
        <div key={i} className="flex px-6 items-center space-x-3 py-3 cursor-pointer">
          <div className="w-12 h-12 bg-slate-300 rounded-full"/>
          <div>
            <p className="text-gray-700">Steve Jebs</p>
            <p className="text-sm text-gray-500">내일 정오에 1층에서 만나요</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Chats;
