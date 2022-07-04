import type {NextPage} from 'next'

const Home: NextPage = () => {
  return (
    <div className={"flex flex-col space-y-2 p-5"}>
      <details className={"select-none open:text-amber-500"}>
        <summary className={"select-none cursor-pointer"}>당신이 가장 좋아하는 음식은 무엇입니까?</summary>
        <span className={"selection:bg-indigo-300 selection:text-white"}>5.스파게티</span>
      </details>
      <ul className={"list-decimal marker:text-teal-500"}>
        <li>짜장면</li>
        <li>치킨</li>
        <li>탕수육</li>
        <li>피자</li>
        <li>스파게티</li>
      </ul>
      <input type={"file"} className={"file:transition" +
        "file:border-0 file:rounded-xl file:bg-purple-400 file:px-5 file:text-white file:cursor-pointer " +
        "file:hover:text-purple-400 file:hover:bg-white file:hover:border-purple-400 file:hover:border"}/>
      <p className={"first-letter:text-7xl first-letter:hover:text-purple-400"}>안녕 만나서 반가워~🤍</p>
    </div>
  )
}

export default Home
