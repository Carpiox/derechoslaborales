import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

import ArticleLayout from "@/components/ArticleLayout";
import FAQSection from "@/components/FAQSection";
import { getAllArticles, getArticleBySlug, slugify } from "@/lib/mdx";
import { generateArticleMetadata } from "@/lib/seo";

type ArticlePageProps = {
  params: {
    pais: string;
    tema: string;
  };
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getAllArticles();

  return articles.map((article) => ({
    pais: article.frontmatter.pais,
    tema: article.frontmatter.slug
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.pais, params.tema);

  if (!article) {
    return {};
  }

  return generateArticleMetadata(article.frontmatter);
}

const mdxComponents = {
  FAQSection,
  h2: (props: ComponentPropsWithoutRef<"h2">) => {
    const text = String(props.children);
    return <h2 {...props} id={slugify(text)} />;
  },
  h3: (props: ComponentPropsWithoutRef<"h3">) => {
    const text = String(props.children);
    return <h3 {...props} id={slugify(text)} />;
  }
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.pais, params.tema);

  if (!article) {
    notFound();
  }

  return (
    <ArticleLayout frontmatter={article.frontmatter} headings={article.headings}>
      <MDXRemote components={mdxComponents} source={article.content} />
    </ArticleLayout>
  );
}
