import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { content } from "@/content";
import { ReactQuery } from "@/provider/reactQuery";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: content.nameApp,
  description: content.desc,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} antialiased bg-white text-black`}
      >
        <ReactQuery>
          {children}
        </ReactQuery>
      </body>
    </html>
  );
}
