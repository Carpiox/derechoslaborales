# Derechos Laborales

Proyecto base con Next.js 14, App Router, TypeScript estricto, Tailwind CSS, `next-mdx-remote` y `gray-matter`.

## Estructura

- `app/`: rutas App Router, metadata, sitemap y robots.
- `content/`: archivos MDX organizados por país.
- `lib/`: lectura MDX, SEO y generación de hreflang.
- `components/`: layout editorial y componentes reutilizables.

## Frontmatter requerido

Cada archivo MDX debe incluir:

```ts
{
  title: string;
  description: string;
  pais: "espana" | "mexico" | "colombia" | "argentina" | "general";
  tema: string;
  slug: string;
  fechaPublicacion: string;
  fechaActualizacion: string;
  autor: string;
  palabrasClave: string[];
  tiempoLectura: number;
}
```

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

Configura `NEXT_PUBLIC_SITE_URL` para generar URLs absolutas correctas en metadata, sitemap y robots. Si no se define, se usa `https://www.derechoslaborales.com`.
