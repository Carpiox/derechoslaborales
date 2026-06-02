import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/hreflang";
import type { ArticleFrontmatter } from "@/lib/mdx";

type SeoInput = {
  frontmatter: ArticleFrontmatter;
  hreflangs?: Record<string, string>;
};

export function generateSeoMetadata({ frontmatter, hreflangs = {} }: SeoInput): Metadata {
  const url = absoluteUrl(`/${frontmatter.pais}/${frontmatter.slug}`);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.palabrasClave,
    authors: [{ name: frontmatter.autor }],
    alternates: {
      canonical: url,
      languages: hreflangs
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: "article",
      url,
      publishedTime: frontmatter.fechaPublicacion,
      modifiedTime: frontmatter.fechaActualizacion,
      authors: [frontmatter.autor],
      tags: frontmatter.palabrasClave
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
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
