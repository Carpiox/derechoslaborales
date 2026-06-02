import Link from "next/link";

const countries = [
  { href: "/espana", label: "España" },
  { href: "/mexico", label: "México" },
  { href: "/colombia", label: "Colombia" },
  { href: "/argentina", label: "Argentina" },
  { href: "/general", label: "General" }
];

export default function CountrySelector() {
  return (
    <nav aria-label="Selector de país" className="flex flex-wrap items-center gap-2 text-sm">
      {countries.map((country) => (
        <Link
          className="rounded border border-ink/15 px-3 py-1.5 transition hover:border-accent hover:text-accent"
          href={country.href}
          key={country.href}
        >
          {country.label}
        </Link>
      ))}
    </nav>
  );
}
