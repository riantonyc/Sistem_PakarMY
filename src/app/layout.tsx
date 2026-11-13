import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPK Kesiapan Atlet Muaythai | Pengkot Pontianak",
  description:
    "Sistem Pakar Hibrida Fuzzy AHP–TOPSIS–CF untuk Kesiapan Atlet Pengurus Kota Muaythai Pontianak berbasis Regulasi IFMA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-canvas text-primary antialiased selection:bg-accent-red selection:text-white">
        {children}
      </body>
    </html>
  );
}

