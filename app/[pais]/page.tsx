import Link from "next/link";
import { notFound } from "next/navigation";

import { getArticlesByPais, isPais, PAISES } from "@/lib/mdx";
import { generatePageMetadata } from "@/lib/seo";

type CountryPageProps = {
  params: {
    pais: string;
  };
};

export function generateStaticParams() {
  return PAISES.map((pais) => ({ pais }));
}

export function generateMetadata({ params }: CountryPageProps) {
  if (!isPais(params.pais)) {
    return {};
  }

  return generatePageMetadata(
    `Derechos laborales en ${params.pais}`,
    `Guías y recursos sobre derechos laborales para ${params.pais}.`,
    `/${params.pais}`
  );
}

export default async function CountryPage({ params }: CountryPageProps) {
  if (!isPais(params.pais)) {
    notFound();
  }

  const articles = await getArticlesByPais(params.pais);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">País</p>
        <h1 className="text-4xl font-bold capitalize md:text-5xl">{params.pais}</h1>
        <p className="mt-4 text-lg text-ink/75">Artículos disponibles para esta jurisdicción.</p>
      </header>

      <section className="mt-10 grid gap-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link className="rounded border border-ink/15 bg-white p-5 hover:border-accent" href={article.url} key={article.url}>
              <p className="text-sm font-medium text-accent">{article.frontmatter.tema}</p>
              <h2 className="mt-2 text-2xl font-semibold">{article.frontmatter.title}</h2>
              <p className="mt-2 text-ink/70">{article.frontmatter.description}</p>
            </Link>
          ))
        ) : (
          <p className="rounded border border-ink/15 bg-white p-5 text-ink/70">No hay artículos publicados para este país todavía.</p>
        )}
      </section>
    </div>
  );
}
