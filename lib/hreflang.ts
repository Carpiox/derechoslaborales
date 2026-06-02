import "server-only";

import { getAllArticles, isPais, type Pais } from "@/lib/mdx";

export const SITE_URL = "https://derechoslaborales.com";

export const COUNTRY_LOCALES: Record<Pais, string> = {
  espana: "es-ES",
  mexico: "es-MX",
  colombia: "es-CO",
  argentina: "es-AR",
  general: "es"
};

export function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL).replace(/\/$/, "");
}

export function absoluteUrl(pathname: string): string {
  return `${getBaseUrl()}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export async function generateHreflang(pais: string, tema: string): Promise<Record<string, string>> {
  if (!isPais(pais)) {
    return {};
  }

  const articles = await getAllArticles();

  return articles
    .filter((article) => article.frontmatter.slug === tema)
    .reduce<Record<string, string>>((languages, article) => {
      languages[COUNTRY_LOCALES[article.frontmatter.pais]] = `/${article.frontmatter.pais}/${article.frontmatter.slug}`;
      return languages;
    }, {});
}
