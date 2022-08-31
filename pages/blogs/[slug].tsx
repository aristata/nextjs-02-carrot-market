import { NextPage } from "next";

/**
 * PostDetail 파일은 static html 파일을 렌더링 할 것이다
 * - Dynamic(동적) 의 경우에는 데이터 베이스에서 데이터가 있는지 확인하고 화면을 그린다
 *  - /products/1, /products/2, /community/128
 * - Static(정적) 의 경우에는 이미 있는 데이터로 화면을 그린다
 *  - /blogs/01_first_blog, /blogs/02_second_blog
 */
const PostDetail: NextPage = () => {
  return <h1>안녕</h1>;
};

export function getStaticProps() {
  return {
    props: {}
  };
}

export default PostDetail;
