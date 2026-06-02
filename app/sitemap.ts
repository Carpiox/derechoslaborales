import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/hreflang";
import { getAllArticles } from "@/lib/mdx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();
  const countryRoutes = Array.from(new Set(articles.map((article) => article.frontmatter.pais)));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    ...countryRoutes.map((pais) => ({
      url: absoluteUrl(`/${pais}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(article.url),
      lastModified: new Date(article.frontmatter.fechaActualizacion),
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}
