import type { Metadata } from "next";
import { Noto_Sans_Tamil, Noto_Serif_Tamil } from "next/font/google";
import "./globals.css";
import { NavigationProvider } from "@/src/navigation/NavigationProvider";
import { MainLayout } from "@/src/navigation/MainLayout";

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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ta">
      <body
        className={`${notoSansTamil.variable} ${notoSerifTamil.variable} font-[family-name:var(--font-tamil-sans)] antialiased`}
      >
        <NavigationProvider>
          <MainLayout>{children}</MainLayout>
        </NavigationProvider>
      </body>
    </html>
  );
}
