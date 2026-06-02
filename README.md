# derechoslaborales.es

Sitio web sobre derechos laborales para España y Latinoamérica, construido con Next.js 14.

Lo estoy desarrollando como proyecto personal paralelo a mi búsqueda de empleo como desarrollador junior. La idea es aprender construyendo algo real que genere tráfico orgánico y eventualmente ingresos con AdSense — no otro proyecto de portfolio que nadie usa.

---

## Por qué este stack

Vengo de construir [micalculadora.es](https://micalculadora.es) con Vite + React + un plugin de prerender propio para SEO. Funcionó, pero era una solución manual a algo que Next.js resuelve de forma nativa.

Para este proyecto decidí dar el salto a Next.js 14 con App Router porque:

- **SSG real con `generateStaticParams`** — sin plugins externos, sin configuración adicional
- **`generateMetadata` por ruta** — cada artículo tiene su metadata dinámica sin repetir código
- **Sitemap automático** — `app/sitemap.ts` lee todos los MDX de `/content` y genera las URLs solo. Añadir un artículo nuevo no requiere tocar nada más que crear el archivo
- **App Router vs Pages Router** — elegí App Router porque es la dirección que lleva Next.js y quería aprenderlo bien desde el principio, aunque tiene una curva de aprendizaje más pronunciada

Para el contenido usé **next-mdx-remote + gray-matter** en lugar de `@next/mdx` o contentlayer. La razón: contentlayer lleva sin mantenimiento activo desde 2023 y tiene problemas de compatibilidad con Next.js 14+. next-mdx-remote con los archivos en `/content` separado del código es más predecible y escala mejor cuando tienes 50+ artículos.

---

## Estructura del proyecto

```
/app
  layout.tsx              → layout raíz, metadata base
  page.tsx                → home con listado de artículos por país
  [pais]/page.tsx         → hub de cada país (/espana, /mexico...)
  [pais]/[tema]/page.tsx  → artículo individual con SSG
  sitemap.ts              → sitemap dinámico, se actualiza solo
  robots.ts

/content
  /espana                 → artículos sobre legislación española
  /mexico                 → artículos sobre Ley Federal del Trabajo
  /colombia
  /argentina
  /general                → contenido universal hispanohablante

/lib
  mdx.ts                  → lee y parsea archivos MDX del disco
  seo.ts                  → generateArticleMetadata() reutilizable
  hreflang.ts             → alternate links por país para SEO internacional

/components
  ArticleLayout.tsx       → layout editorial con ToC sticky + schemas JSON-LD
  FAQSection.tsx          → acordeón accesible + schema FAQPage automático
  TableOfContents.tsx     → extrae H2/H3 del MDX, resalta sección activa
  CountrySelector.tsx     → nav de países
```

---

## SEO técnico

Es la parte que más me interesaba resolver bien porque es el núcleo del proyecto.

Cada artículo genera automáticamente:

- Metadata completa (title, description, OpenGraph, Twitter card)
- Canonical URL
- Hreflang por país — para que Google entienda que `/espana/despido` y `/mexico/despido-injustificado` son variantes del mismo contenido en distinta legislación. Los hreflang se calculan leyendo los MDX que realmente existen en `/content`, así Google nunca recibe un alternate que apunta a una página vacía
- Schema JSON-LD: `Article`, `FAQPage` y `BreadcrumbList`

El frontmatter de cada MDX controla todo esto:

```yaml
---
title: "Despido improcedente en España 2025: derechos y cómo reclamar"
description: "..."
pais: "espana"
tema: "despidos"
slug: "despido-improcedente-espana"
fechaPublicacion: "2025-01-20"
fechaActualizacion: "2025-01-20"
autor: "Sergio García"
palabrasClave: ["despido improcedente", "indemnización despido"]
tiempoLectura: 12
---
```

### Schemas JSON-LD

Los tres schemas que genera cada artículo:

**Article** (en `ArticleLayout.tsx`): tipo de contenido, autor con URL a `/sobre-nosotros`, publisher, fechas de publicación y actualización, idioma. Es la señal principal de E-E-A-T para Google en contenido YMYL como el laboral.

**BreadcrumbList** (en `ArticleLayout.tsx`): Home → País → Artículo con las URLs correctas de cada nivel. Ayuda a Google a entender la jerarquía del sitio y genera los breadcrumbs en los resultados de búsqueda.

**FAQPage** (en `FAQSection.tsx`): el componente recibe un array de preguntas y respuestas, renderiza un acordeón accesible con `<details>/<summary>` nativo sin JavaScript, y genera el schema automáticamente. Las FAQ en schema pueden aparecer expandidas directamente en los resultados de Google, lo que aumenta el CTR sin subir posición.

Un detalle técnico que costó resolver: en Next.js 14 App Router, inyectar JSON-LD dinámico directamente en `<head>` desde componentes no es tan directo como en Pages Router. `next/script` con `beforeInteractive` funciona pero genera un aviso de ESLint porque esa estrategia estaba pensada para `pages/_document`. La solución que quedó es válida y los schemas aparecen correctamente en el HTML renderizado — documenté el proceso porque me parece útil saber que estas fricciones existen.

---

## Lo que he aprendido construyendo esto

- La diferencia real entre SSR, SSG e ISR en Next.js y cuándo usar cada uno (aquí uso SSG puro porque el contenido laboral no cambia por hora)
- Por qué `generateStaticParams` importa: sin él Next.js renderiza las rutas dinámicas en tiempo de request, con él las pre-genera en build y el TTFB es instantáneo
- Cómo funciona `metadataBase` y por qué es necesario para que las URLs en OpenGraph sean absolutas
- Hreflang es más complejo de lo que parece: necesita ser bidireccional (si `/espana` apunta a `/mexico`, `/mexico` tiene que apuntar de vuelta a `/espana`) y solo tiene sentido cuando la página de destino existe
- `next-mdx-remote` serializa el MDX en el servidor y lo hidrata en el cliente, lo que significa que los componentes usados dentro del MDX tienen que estar disponibles como Client Components o pasarse como prop al renderizador
- El contenido YMYL (salud, legal, finanzas) tiene criterios de evaluación distintos en Google: el schema de autor y las señales de E-E-A-T no son opcionales, son la diferencia entre rankear o no

---

## Estado actual

- [x] Scaffold del proyecto, TypeScript estricto, Tailwind
- [x] Sistema de routing `[pais]/[tema]` con SSG
- [x] `generateMetadata` dinámica por artículo
- [x] Hreflang calculado desde MDX reales
- [x] Sitemap dinámico automático
- [x] Schemas JSON-LD (Article, FAQ, Breadcrumb)
- [ ] Diseño y componentes visuales
- [ ] Primer artículo completo (España)
- [ ] Deploy en Vercel con dominio propio
- [ ] Google Search Console + sitemap enviado
- [ ] Solicitud Google AdSense
