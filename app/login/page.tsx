"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { cn } from "@/lib/utils";

const hasGoogleOAuth = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";
const hasGitHubOAuth = process.env.NEXT_PUBLIC_GITHUB_ENABLED === "true";


export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        setIsLoading(false);
        if (res?.ok) {
            router.push("/dashboard");
        } else {
            setError("Invalid credentials");
        }
    };

    const loginTheme = {
        accent: "from-sky-700 via-sky-400 to-sky-900",
        card: "border-sky-400/30 hover:border-sky-400/60 shadow-sky-400/20",
    };

    return (
        <div className={cn("min-h-screen flex items-center justify-center p-0 md:p-0 relative overflow-x-hidden bg-black/95")}> 
            {/* Animated login background */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="absolute inset-0 -z-10 pointer-events-none"
            >
                <div className={cn("w-full h-full blur-2xl", `bg-linear-to-br ${loginTheme.accent}`)} />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', duration: 0.7 }}
                className={cn("w-full max-w-md bg-white/5 border border-white/10 rounded-2xl shadow-xl p-8 backdrop-blur-xl", loginTheme.card)}
            >
                <h1 className="text-3xl font-black mb-6 text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]">Operator Login</h1>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <Input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <Input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <Button type="submit" variant="cyber" className="w-full" disabled={isLoading}>{isLoading ? "Signing In..." : "Sign In"}</Button>
                </form>
                {(hasGoogleOAuth || hasGitHubOAuth) && (
                    <div className="my-6 flex flex-col gap-2">
                        {hasGoogleOAuth && (
                            <Button variant="outline" className="w-full" onClick={() => signIn("google")}>Sign in with Google</Button>
                        )}
                        {hasGitHubOAuth && (
                            <Button variant="outline" className="w-full" onClick={() => signIn("github")}>Sign in with GitHub</Button>
                        )}
                    </div>
                )}
                <div className="mt-4 text-center text-sm text-muted-foreground">
                    <Button variant="link" onClick={() => router.push('/signup')} className="text-muted-foreground hover:text-white">
                        New here? Create an account
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
