type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  items: FAQItem[];
};

export default function FAQSection({ items }: FAQSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="not-prose my-10 space-y-3" id="faq">
      <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
      {items.map((item) => (
        <details className="rounded border border-ink/15 bg-white p-4" key={item.question}>
          <summary className="cursor-pointer font-medium">{item.question}</summary>
          <p className="mt-3 text-ink/75">{item.answer}</p>
        </details>
      ))}
    </section>
  );
}
