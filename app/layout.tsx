
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { NeuralCursor } from "@/components/ui/NeuralCursor";
import { CRTOverlay } from "@/components/ui/CRTOverlay";
import { MatrixBackground } from "@/components/ui/MatrixBackground";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["100", "400", "700", "800"],
});

export const metadata: Metadata = {
  title: "MATHPREP_AI // PCSTYLE",
  description: "Generuj rozbudowane plany nauki matematyki z pomocą AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${jetbrainsMono.variable} antialiased bg-black`}>
        <MatrixBackground />
        <CRTOverlay />
        <ConvexClientProvider>
          <div className="relative z-10">{children}</div>
        </ConvexClientProvider>
        <NeuralCursor />
      </body>
    </html>
  );
}
