import type { Metadata } from "next";
import Link from "next/link";

import CountrySelector from "@/components/CountrySelector";

import "./globals.css";

const siteDescription = "Guías claras y actualizadas sobre derechos laborales por país.";

export const metadata: Metadata = {
  metadataBase: new URL("https://derechoslaborales.com"),
  title: {
    default: "DerechosLaborales.com",
    template: "%s | DerechosLaborales.com"
  },
  description: siteDescription,
  applicationName: "DerechosLaborales.com",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "DerechosLaborales.com",
    description: siteDescription,
    url: "https://derechoslaborales.com",
    siteName: "DerechosLaborales.com",
    locale: "es_ES",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <header className="border-b border-ink/10 bg-paper/95">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <Link className="text-lg font-bold" href="/">
              Derechos Laborales
            </Link>
            <CountrySelector />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
