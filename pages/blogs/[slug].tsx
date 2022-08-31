import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

/**
 * PostDetail 파일은 static html 파일을 렌더링 할 것이다
 * - Dynamic(동적) 의 경우에는 데이터 베이스에서 데이터가 있는지 확인하고 화면을 그린다
 *  - /products/1, /products/2, /community/128
 * - Static(정적) 의 경우에는 이미 있는 데이터로 화면을 그린다
 *  - /blogs/01_first_blog, /blogs/02_second_blog
 */
const PostDetail: NextPage<{ post: string }> = ({ post }) => {
  return <h1>{post}</h1>;
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

/**
 * remark-html
 * - 마크다운 문서를 HTML 로 변경해주는 라이브러리
 * - npm i remark-html remark-parse unified
 *
 * - 파라미터로 전달되는 slug 를 사용하여 파일을 읽어 들인 다음
 * - 해당 파일(md 파일)을 HTML 로 변환하여 화면에 뿌려 준다
 */
export const getStaticProps: GetStaticProps = async (ctx) => {
  // 파일 시스템에서 파일을 동기적으로 읽고 front matter 를 파싱한다
  // matter() 와 동일한 객체를 반환한다
  const { data, content } = matter.read(`./posts/${ctx.params?.slug}.md`);
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);
  return {
    props: {
      post: value
    }
  };
};

export default PostDetail;
