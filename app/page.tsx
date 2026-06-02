import Link from "next/link";

import { getAllArticles, PAISES } from "@/lib/mdx";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Derechos Laborales por país",
  "Consulta guías laborales por país con contenido preparado para SEO y generación estática."
);

export default async function HomePage() {
  const articles = await getAllArticles();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <section className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">Guías laborales</p>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">Derechos laborales claros, organizados por país</h1>
        <p className="mt-5 text-lg text-ink/75">
          Una base editorial en Next.js 14 con MDX, metadatos dinámicos, sitemap automático y rutas estáticas.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Países</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PAISES.map((pais) => (
            <Link className="rounded border border-ink/15 bg-white p-4 hover:border-accent" href={`/${pais}`} key={pais}>
              <span className="font-medium capitalize">{pais}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Últimos artículos</h2>
        <div className="mt-5 grid gap-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link className="rounded border border-ink/15 bg-white p-5 hover:border-accent" href={article.url} key={article.url}>
                <p className="text-sm font-medium uppercase tracking-wide text-accent">{article.frontmatter.pais}</p>
                <h3 className="mt-2 text-xl font-semibold">{article.frontmatter.title}</h3>
                <p className="mt-2 text-ink/70">{article.frontmatter.description}</p>
              </Link>
            ))
          ) : (
            <p className="text-ink/70">Todavía no hay artículos publicados.</p>
          )}
        </div>
      </section>
    </div>
  );
}
