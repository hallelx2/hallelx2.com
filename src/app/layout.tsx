import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/tokens.css";
import "@/styles/nav.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hallelx2.com"),
  title: "hallelx2 labs",
  description:
    "hallelx2 labs builds the products healthcare, education and the AI ecosystem need — six of them, on three open-source libraries we wrote and released, with every claim measured in public.",
  icons: { icon: "/assets/img/favicon.svg" },
  openGraph: {
    siteName: "hallelx2 labs",
    type: "website",
    images: ["/assets/img/og-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Nav behaviour (click / keyboard / Escape / outside-click). It fails
            open: without it the menus stay reachable via :focus-within.
            afterInteractive: DOM mutations before hydration get reverted. */}
        <Script src="/js/nav.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
