import type { Metadata } from "next";

import { generateHreflang, SITE_URL, absoluteUrl } from "@/lib/hreflang";
import type { ArticleFrontmatter } from "@/lib/mdx";

export async function generateArticleMetadata(frontmatter: ArticleFrontmatter): Promise<Metadata> {
  const canonicalUrl = `${SITE_URL}/${frontmatter.pais}/${frontmatter.slug}`;
  const languages = await generateHreflang(frontmatter.pais, frontmatter.slug);
  const title = `${frontmatter.title} | DerechosLaborales`;

  return {
    title: {
      absolute: title
    },
    description: frontmatter.description,
    keywords: frontmatter.palabrasClave,
    authors: [{ name: frontmatter.autor }],
    alternates: {
      canonical: canonicalUrl,
      languages
    },
    openGraph: {
      title,
      description: frontmatter.description,
      type: "article",
      url: canonicalUrl,
      publishedTime: frontmatter.fechaPublicacion,
      modifiedTime: frontmatter.fechaActualizacion,
      authors: [frontmatter.autor],
      tags: frontmatter.palabrasClave
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: frontmatter.description
    }
  };
}

export function generatePageMetadata(title: string, description: string, pathname = "/"): Metadata {
  const url = absoluteUrl(pathname);

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      type: "website"
    }
  };
}
