import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./provider/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DumelDump",
  description:
    "A private digital diary for your thoughts, stories, and memories.",

  openGraph: {
    title: "DumelDump",
    description:
      "A private digital diary for your thoughts, stories, and memories.",
    url: "https://dumel-dump.vercel.app",
    siteName: "DumelDump",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "DumelDump",
    description:
      "A private digital diary for your thoughts, stories, and memories.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dumel-bg mx-5 mt-2 pb-20">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
