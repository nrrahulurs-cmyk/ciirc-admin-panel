import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CIIRC Admin OS | Centre for Intelligent and Interactive Robotics and Cybernetics",
  description:
    "Enterprise Admin Operating System for CIIRC's digital, research, faculty, content and event ecosystem.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 min-h-screen font-sans selection:bg-sky-500/20 selection:text-sky-600">
        {children}
      </body>
    </html>
  );
}
