"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const hasGoogleOAuth = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";
const hasGitHubOAuth = process.env.NEXT_PUBLIC_GITHUB_ENABLED === "true";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        // Call registration API (to be implemented)
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        setIsLoading(false);
        if (res.ok) {
            // Auto-login after registration
            await signIn("credentials", { email, password, redirect: false });
            router.push("/dashboard");
        } else {
            const data = await res.json().catch(() => ({}));
            setError(data?.error || "Registration failed");
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[50px_50px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-2">Initialize Node</h1>
                    <p className="text-muted-foreground text-sm">Join the SkillForge ecosystem.</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground ml-1">Operator Name</label>
                        <Input
                            type="text"
                            placeholder="Neo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground ml-1">Email Signal</label>
                        <Input type="email" placeholder="user@skillforge.io" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground ml-1">Set Access Key</label>
                        <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <Button
                        type="submit"
                        variant="cyber"
                        className="w-full mt-6"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Establish Link"}
                    </Button>
                </form>
                {(hasGoogleOAuth || hasGitHubOAuth) && (
                    <div className="my-6 flex flex-col gap-2">
                        {hasGoogleOAuth && (
                            <Button variant="outline" className="w-full" onClick={() => signIn("google")}>Sign up with Google</Button>
                        )}
                        {hasGitHubOAuth && (
                            <Button variant="outline" className="w-full" onClick={() => signIn("github")}>Sign up with GitHub</Button>
                        )}
                    </div>
                )}

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <Button variant="link" onClick={() => router.push('/auth')} className="text-muted-foreground hover:text-white">
                        ← Back to Gate
                    </Button>
                </div>
            </motion.div>
        </main>
    );
}
