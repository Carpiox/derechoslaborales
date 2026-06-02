/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from "next/script";

type FAQItem = {
  pregunta: string;
  respuesta: string;
};

type FAQSectionProps = {
  items: FAQItem[];
};

type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[];

type JsonLdObject = {
  [key: string]: JsonLdValue;
};

function stringifyJsonLd(schema: JsonLdObject): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

function buildFAQPageSchema(items: FAQItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.respuesta
      }
    }))
  };
}

function createFAQScriptId(items: FAQItem[]): string {
  const source = items.map((item) => `${item.pregunta}:${item.respuesta}`).join("|");
  let hash = 0;

  for (const character of source) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return `faq-schema-${hash.toString(36)}`;
}

export default function FAQSection({ items }: FAQSectionProps) {
  if (items.length === 0) {
    return null;
  }

  const faqSchema = buildFAQPageSchema(items);
  const scriptId = createFAQScriptId(items);

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(faqSchema) }}
        id={scriptId}
        strategy="beforeInteractive"
        type="application/ld+json"
      />
      <section className="not-prose my-10 space-y-3" id="faq">
        <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
        {items.map((item) => (
          <details className="rounded border border-ink/15 bg-white p-4" key={item.pregunta}>
            <summary className="cursor-pointer font-medium">{item.pregunta}</summary>
            <p className="mt-3 text-ink/75">{item.respuesta}</p>
          </details>
        ))}
      </section>
    </>
  );
}
