import React from "react";
import rehypeExternalLinks from "rehype-external-links";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

type MarkDownRendererProps = {
  markdown: string;
};
const MarkDownRenderer = ({ markdown }: MarkDownRendererProps) => {
  const content = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeExternalLinks, { rel: ["nofollow"], target: "_blank" })
    .use(rehypeStringify)
    .processSync(markdown);
  let contentHtml = content.toString().trimEnd();
  if (contentHtml.startsWith("<p>") && contentHtml.endsWith("</p>")) {
    contentHtml = contentHtml.slice(3, -4);
  }

  return (
    <span
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    ></span>
  );
};

export default MarkDownRenderer;
