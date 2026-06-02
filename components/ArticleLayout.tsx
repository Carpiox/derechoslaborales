import type { ReactNode } from "react";

import TableOfContents from "@/components/TableOfContents";
import type { ArticleFrontmatter, TocHeading } from "@/lib/mdx";

type ArticleLayoutProps = {
  frontmatter: ArticleFrontmatter;
  headings: TocHeading[];
  children: ReactNode;
};

export default function ArticleLayout({ frontmatter, headings, children }: ArticleLayoutProps) {
  return (
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
  );
}
