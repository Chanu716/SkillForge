import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "SkillForge",
    description: "Immersive Learning & Project Ecosystem",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={clsx(inter.variable, outfit.variable, "font-sans antialiased bg-background text-foreground overflow-hidden h-screen w-screen selection:bg-primary selection:text-white")}>
                <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-[-1]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none z-[-1]" />
                {children}
            </body>
        </html>
    );
}
