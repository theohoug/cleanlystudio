/**
 * @file layout.tsx
 * @description Root layout for Awwwards portfolio v2
 * @author Cleanlystudio
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["200", "300", "400", "500"] });

const siteUrl = "https://cleanlystudio.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cleanlystudio | Creative Developer",
    template: "%s | Cleanlystudio",
  },
  description: "Développeur créatif basé en Normandie. Création de sites web immersifs, applications mobiles et expériences 3D premium.",
  keywords: ["développeur web", "creative developer", "portfolio", "Three.js", "React", "Next.js", "Normandie", "freelance", "site immersif", "WebGL", "3D"],
  authors: [{ name: "Théo Houguet", url: siteUrl }],
  creator: "Cleanlystudio",
  publisher: "Cleanlystudio",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Cleanlystudio",
    title: "Cleanlystudio | Creative Developer",
    description: "Développeur créatif basé en Normandie. Création de sites web immersifs, applications mobiles et expériences 3D premium.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cleanlystudio - Crafting Digital Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleanlystudio | Creative Developer",
    description: "Développeur créatif basé en Normandie. Sites immersifs, apps mobiles et expériences 3D premium.",
    images: ["/og-image.png"],
    creator: "@cleanlystudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cleanlystudio",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
