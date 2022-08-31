import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

interface Post {
  blogTitle: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  console.log(posts);
  return (
    <Layout title="블로그">
      <h1 className="font-semibold text-lg text-center mt-5 mb-10">
        Latest Posts:
      </h1>
      {posts.map((post, index) => (
        <div key={index} className="mb-5">
          <Link href={`/blogs/${post.slug}`}>
            <a>
              <span className="text-lg text-red-500">{post.blogTitle}</span>
              <div>
                <span>{post.date}</span>
                {" / "}
                <span>{post.category}</span>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </Layout>
  );
};

/**
 * getServersideProps() 는 페이지가 요청될 때마다 호출되어 실행된다
 * 반면에 getStaticProps() 는 딱 한번, 이 페이지가 빌드되고 nextjs 가 이 페이지를 Html 로 생성할 때 딱 한번만 호출되어 실행된다
 */
export async function getStaticProps() {
  // readdirSync 는 디렉토리의 파일들을 불러오는 nodejs 함수 이다
  // 디렉토리 위치상 "../posts" 가 되어야 할 것 같지만,
  // nextjs 에서 posts 디렉토리를 pages 디렉토리와 같은 경로로 인식하기 때문에
  // "./posts" 로 표시하였다
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");

    // "." 을 기준으로 파일명을 문자열 배열로 변환한다
    const [slug, _] = file.split(".");

    // matter 의 data 부분과 slug 를 스프레드 연산자를 사용하여 하나의 객체로 묶어서 반환한다
    return { ...matter(content).data, slug };
  });
  return {
    props: {
      posts: blogPosts.reverse()
    }
  };
}

export default Blog;
