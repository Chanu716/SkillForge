"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

const hasGoogleOAuth = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";
const hasGitHubOAuth = process.env.NEXT_PUBLIC_GITHUB_ENABLED === "true";


export default function LoginPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    
    // Password change states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSaved, setPasswordSaved] = useState(false);

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

    const handlePasswordChange = async () => {
        setPasswordError('');
        setPasswordSaved(false);

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setPasswordError(data.error || 'Failed to change password');
                return;
            }

            setPasswordSaved(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                setPasswordSaved(false);
                setShowPasswordChange(false);
            }, 2000);
        } catch (error) {
            setPasswordError('An error occurred. Please try again.');
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
                <h1 className="text-3xl font-black mb-6 text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]">
                    {session ? "Change Password" : "Operator Login"}
                </h1>
                
                {/* Only show password change if user is already logged in */}
                {session ? (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Current Password
                            </label>
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="bg-black/50 border-white/20 text-white"
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                New Password
                            </label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-black/50 border-white/20 text-white"
                                placeholder="Enter new password (min 6 characters)"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Confirm New Password
                            </label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-black/50 border-white/20 text-white"
                                placeholder="Confirm new password"
                            />
                        </div>
                        {passwordError && (
                            <div className="text-red-400 text-sm flex items-center gap-2 bg-red-950/20 border border-red-500/20 rounded-lg p-3">
                                <span>⚠</span> {passwordError}
                            </div>
                        )}
                        <Button 
                            onClick={handlePasswordChange} 
                            variant="cyber" 
                            className="w-full"
                            disabled={!currentPassword || !newPassword || !confirmPassword}
                        >
                            {passwordSaved ? "✓ Password Updated" : <><Lock className="w-4 h-4 mr-2" /> Change Password</>}
                        </Button>
                        <div className="mt-4 text-center">
                            <Button variant="link" onClick={() => router.push('/dashboard')} className="text-muted-foreground hover:text-white">
                                Back to Dashboard
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </motion.div>
        </div>
    );
}
