import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import matter from "gray-matter";

export const PAISES = ["espana", "mexico", "colombia", "argentina", "general"] as const;

export type Pais = (typeof PAISES)[number];

export type ArticleFrontmatter = {
  title: string;
  description: string;
  pais: Pais;
  tema: string;
  slug: string;
  fechaPublicacion: string;
  fechaActualizacion: string;
  autor: string;
  palabrasClave: string[];
  tiempoLectura: number;
};

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type Article = {
  frontmatter: ArticleFrontmatter;
  content: string;
  filePath: string;
  headings: TocHeading[];
  url: `/${Pais}/${string}`;
};

const contentDirectory = path.join(process.cwd(), "content");

export function isPais(value: string): value is Pais {
  return PAISES.includes(value as Pais);
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function requireString(data: Record<string, unknown>, key: keyof ArticleFrontmatter, filePath: string): string {
  const value = data[key];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid or missing "${key}" in ${filePath}`);
  }

  return value;
}

function parseFrontmatter(data: Record<string, unknown>, filePath: string): ArticleFrontmatter {
  const pais = requireString(data, "pais", filePath);
  const palabrasClave = data.palabrasClave;
  const tiempoLectura = data.tiempoLectura;

  if (!isPais(pais)) {
    throw new Error(`Invalid "pais" in ${filePath}. Expected one of: ${PAISES.join(", ")}`);
  }

  if (!Array.isArray(palabrasClave) || !palabrasClave.every((item) => typeof item === "string")) {
    throw new Error(`Invalid or missing "palabrasClave" in ${filePath}`);
  }

  if (typeof tiempoLectura !== "number" || !Number.isFinite(tiempoLectura)) {
    throw new Error(`Invalid or missing "tiempoLectura" in ${filePath}`);
  }

  return {
    title: requireString(data, "title", filePath),
    description: requireString(data, "description", filePath),
    pais,
    tema: requireString(data, "tema", filePath),
    slug: requireString(data, "slug", filePath),
    fechaPublicacion: requireString(data, "fechaPublicacion", filePath),
    fechaActualizacion: requireString(data, "fechaActualizacion", filePath),
    autor: requireString(data, "autor", filePath),
    palabrasClave,
    tiempoLectura
  };
}

function extractHeadings(content: string): TocHeading[] {
  return content
    .split("\n")
    .map((line) => line.match(/^(##|###)\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => {
      const text = match[2].replace(/[#*_`]/g, "").trim();

      return {
        id: slugify(text),
        text,
        level: match[1] === "##" ? 2 : 3
      };
    });
}

async function parseArticleFile(filePath: string): Promise<Article> {
  const rawFile = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(rawFile);
  const frontmatter = parseFrontmatter(data, filePath);

  return {
    frontmatter,
    content,
    filePath,
    headings: extractHeadings(content),
    url: `/${frontmatter.pais}/${frontmatter.slug}`
  };
}

export const getAllArticles = cache(async (): Promise<Article[]> => {
  if (!(await pathExists(contentDirectory))) {
    return [];
  }

  const countryDirectories = await fs.readdir(contentDirectory, { withFileTypes: true });
  const articles = await Promise.all(
    countryDirectories
      .filter((entry) => entry.isDirectory())
      .flatMap(async (countryDirectory) => {
        const directoryPath = path.join(contentDirectory, countryDirectory.name);
        const files = await fs.readdir(directoryPath);

        return Promise.all(
          files
            .filter((fileName) => fileName.endsWith(".mdx"))
            .map((fileName) => parseArticleFile(path.join(directoryPath, fileName)))
        );
      })
  );

  return articles
    .flat()
    .sort(
      (first, second) =>
        new Date(second.frontmatter.fechaActualizacion).getTime() -
        new Date(first.frontmatter.fechaActualizacion).getTime()
    );
});

export async function getArticleBySlug(pais: string, slug: string): Promise<Article | null> {
  if (!isPais(pais)) {
    return null;
  }

  const articles = await getAllArticles();

  return articles.find((article) => article.frontmatter.pais === pais && article.frontmatter.slug === slug) ?? null;
}

export async function getArticlesByPais(pais: string): Promise<Article[]> {
  if (!isPais(pais)) {
    return [];
  }

  const articles = await getAllArticles();

  return articles.filter((article) => article.frontmatter.pais === pais);
}

export async function getArticlesBySlug(slug: string): Promise<Article[]> {
  const articles = await getAllArticles();

  return articles.filter((article) => article.frontmatter.slug === slug);
}
