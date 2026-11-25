import type { Metadata, Viewport } from "next";
import { Noto_Sans_Tamil, Noto_Serif_Tamil } from "next/font/google";
import "./globals.css";
import { NavigationProvider } from "@/src/navigation/NavigationProvider";
import { MainLayout } from "@/src/navigation/MainLayout";
import { WorkspaceProvider } from "@/src/workspace/WorkspaceProvider";
import { LANG_BOOT_SCRIPT } from "@/src/i18n/lang";

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-tamil",
  display: "swap",
});

const notoSerifTamil = Noto_Serif_Tamil({
  subsets: ["tamil", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-serif-tamil",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kotravel Vedic Astrology — பஞ்சாங்கம் & முகூர்த்தம்",
  description: "தினசரி பஞ்சாங்கம் மற்றும் முகூர்த்த நேரங்கள்",
  applicationName: "Kotravel",
  // Installed on an iPhone or iPad's home screen it opens full screen, under this name (Android and desktop read app/manifest.ts)
  appleWebApp: { capable: true, title: "Kotravel", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

// The page fills the whole screen of a phone with a notch (the bars keep clear of it with env(safe-area-inset-*)), and the browser's own
// bar takes the colour of the program's top bar, in the light and the dark theme.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2b1b12" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0911" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The boot script may set lang="en" and data-lang before React hydrates (src/i18n/lang.ts), hence suppressHydrationWarning here
    <html lang="ta" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
      </head>
      <body
        className={`${notoSansTamil.variable} ${notoSerifTamil.variable} font-[family-name:var(--font-tamil-sans)] antialiased`}
      >
        <WorkspaceProvider>
          <NavigationProvider>
            <MainLayout>{children}</MainLayout>
          </NavigationProvider>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
