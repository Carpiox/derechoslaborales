import type { TocHeading } from "@/lib/mdx";

type TableOfContentsProps = {
  headings: TocHeading[];
};

export default function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="border-l border-ink/15 pl-4 text-sm">
      <p className="mb-3 font-semibold">Contenido</p>
      <ol className="space-y-2">
        {headings.map((heading) => (
          <li className={heading.level === 3 ? "ml-4" : undefined} key={`${heading.id}-${heading.text}`}>
            <a className="text-ink/70 hover:text-accent" href={`#${heading.id}`}>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
