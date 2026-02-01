import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import clsx from "clsx";
import { AuthProvider, ProgressLoader } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const cinzel = localFont({
    src: [
        {
            path: "./fonts/CinzelDecorative-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/CinzelDecorative-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "./fonts/CinzelDecorative-Black.ttf",
            weight: "900",
            style: "normal",
        },
    ],
    variable: "--font-cinzel",
});

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
            <body className={clsx(inter.variable, outfit.variable, cinzel.variable, "font-sans antialiased bg-background text-foreground overflow-hidden h-screen w-screen selection:bg-primary selection:text-white")}>
                <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-[-1]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none z-[-1]" />
                <AuthProvider>
                    <ProgressLoader />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
