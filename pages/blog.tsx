import Layout from "@components/layout";
import { readdirSync } from "fs";

const Blog = () => {
  return (
    <Layout title="블로그">
      <h1 className="font-semibold text-lg">Latest Posts:</h1>
      <ul></ul>
    </Layout>
  );
};

/**
 * getServersideProps() 는 페이지가 요청될 때마다 호출되어 실행된다
 * 반면에 getStaticProps() 는 딱 한번, 이 페이지가 빌드되고 nextjs 가 이 페이지를 Html 로 생성할 때 딱 한번만 호출되어 실행된다
 */
export async function getStaticProps() {
  // readdirSync 는 디렉토리의 파일들을 불러오는 nodejs 함수 이다
  const files = readdirSync("./posts");
  return {
    props: {}
  };
}

export default Blog;
