import type { Pais } from "@/lib/mdx";

export const COUNTRY_LOCALES: Record<Pais, string> = {
  espana: "es-ES",
  mexico: "es-MX",
  colombia: "es-CO",
  argentina: "es-AR",
  general: "es"
};

export type HreflangTarget = {
  pais: Pais;
  slug: string;
};

export function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.derechoslaborales.com").replace(/\/$/, "");
}

export function absoluteUrl(pathname: string): string {
  return `${getBaseUrl()}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function generateHreflangAlternates(targets: HreflangTarget[]): Record<string, string> {
  const languages = targets.reduce<Record<string, string>>((accumulator, target) => {
    accumulator[COUNTRY_LOCALES[target.pais]] = absoluteUrl(`/${target.pais}/${target.slug}`);
    return accumulator;
  }, {});

  const defaultTarget = targets.find((target) => target.pais === "general") ?? targets[0];

  if (defaultTarget) {
    languages["x-default"] = absoluteUrl(`/${defaultTarget.pais}/${defaultTarget.slug}`);
  }

  return languages;
}
