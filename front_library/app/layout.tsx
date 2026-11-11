import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider"

import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
 
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
 
export const metadata: Metadata = {
  title: "SIBI | Biblioteca universitaria",
  description: "Consulta el repositorio académico y accede a los servicios bibliotecarios de la Universidad Nacional de San Martín.",
  applicationName: "SIBI",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f2e9" },
    { media: "(prefers-color-scheme: dark)", color: "#111f25" },
  ],
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <head />
            <body className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
                <Toaster className="cursor-pointer error" closeButton={true} duration={5000} richColors={true}/>
            </body>
        </html>
    );
}
