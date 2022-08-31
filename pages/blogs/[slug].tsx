import { readdirSync } from "fs";
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

/*
 * - getStaticPaths 는 동적 URL 이 있는 페이지에서 getStaticProps 를 사용할 때 필요하다
 * - nextjs 가 동적인 변수를 갖는 페이지를 생성하려면 우리가 nextjs 에게 어떤 페이지들을 만들어야 하는지 알려줘야만 한다
 */
export function getStaticPaths() {
  const fileNames = readdirSync("./posts").map((file) => {
    const [fileName, _] = file.split(".");
    return { params: { slug: fileName } };
  });

  return {
    paths: fileNames,
    fallback: false
  };
}

export function getStaticProps() {
  return {
    props: {}
  };
}

export default PostDetail;
