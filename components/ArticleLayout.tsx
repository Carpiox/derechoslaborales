/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import type { ReactNode } from "react";
import Script from "next/script";

import TableOfContents from "@/components/TableOfContents";
import { SITE_URL } from "@/lib/hreflang";
import type { ArticleFrontmatter, TocHeading } from "@/lib/mdx";

type ArticleLayoutProps = {
  frontmatter: ArticleFrontmatter;
  headings: TocHeading[];
  children: ReactNode;
};

type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[];

type JsonLdObject = {
  [key: string]: JsonLdValue;
};

function stringifyJsonLd(schema: JsonLdObject): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

function buildArticleSchema(frontmatter: ArticleFrontmatter): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    datePublished: frontmatter.fechaPublicacion,
    dateModified: frontmatter.fechaActualizacion,
    author: {
      "@type": "Person",
      name: frontmatter.autor,
      url: `${SITE_URL}/sobre-nosotros`
    },
    publisher: {
      "@type": "Organization",
      name: "DerechosLaborales.com"
    },
    inLanguage: "es"
  };
}

function buildBreadcrumbSchema(frontmatter: ArticleFrontmatter): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: frontmatter.pais,
        item: `${SITE_URL}/${frontmatter.pais}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.title,
        item: `${SITE_URL}/${frontmatter.pais}/${frontmatter.slug}`
      }
    ]
  };
}

export default function ArticleLayout({ frontmatter, headings, children }: ArticleLayoutProps) {
  const articleSchema = buildArticleSchema(frontmatter);
  const breadcrumbSchema = buildBreadcrumbSchema(frontmatter);

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(articleSchema) }}
        id={`article-schema-${frontmatter.pais}-${frontmatter.slug}`}
        strategy="beforeInteractive"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(breadcrumbSchema) }}
        id={`breadcrumb-schema-${frontmatter.pais}-${frontmatter.slug}`}
        strategy="beforeInteractive"
        type="application/ld+json"
      />
      <article className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <header className="mb-10 border-b border-ink/15 pb-8">
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent">{frontmatter.pais}</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{frontmatter.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-ink/75">{frontmatter.description}</p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/65">
              <div>
                <dt className="sr-only">Autor</dt>
                <dd>{frontmatter.autor}</dd>
              </div>
              <div>
                <dt className="sr-only">Actualización</dt>
                <dd>Actualizado: {frontmatter.fechaActualizacion}</dd>
              </div>
              <div>
                <dt className="sr-only">Tiempo de lectura</dt>
                <dd>{frontmatter.tiempoLectura} min de lectura</dd>
              </div>
            </dl>
          </header>
          <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-accent">{children}</div>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </div>
      </article>
    </>
  );
}
