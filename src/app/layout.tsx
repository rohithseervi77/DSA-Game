import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXUS: The Living Algorithm | Adaptive DSA Cyberpunk Game",
  description: "An adaptive, procedurally evolving sci-fi strategy game secretly powered by 29 Data Structures and Algorithms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 cyber-grid selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
