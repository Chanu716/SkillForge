"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, User, Bell, Info } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

export default function SettingsPage() {
    const router = useRouter();
    const { username, setUsername, resetProgress, xp, level } = useGameStore();
    const [name, setName] = useState(username);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setUsername(name);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        if (confirm("WARNING: This will purge all progress and neural mapping. Are you sure?")) {
            resetProgress();
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen relative">
            <AnimatedBackground imageSrc="/backgrounds/dashboard.png" />
            <div className="relative z-10 min-h-screen overflow-y-auto">
                <div className="p-8 md:p-12 max-w-3xl mx-auto pb-24">
                <header className="mb-12 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm py-4 -mt-4 z-20">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Button>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-white">System Configuration</h1>
                    </div>
                </header>

                <main className="space-y-8">
                    {/* Account Overview */}
                    <section className="bg-black/40 border border-primary/20 rounded-xl p-6 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-6">
                            <Info className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold text-white">Account Overview</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Username</div>
                                <div className="text-white font-bold truncate">{username}</div>
                            </div>
                            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Level</div>
                                <div className="text-primary font-bold text-xl">{level}</div>
                            </div>
                            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total XP</div>
                                <div className="text-secondary font-bold">{xp}</div>
                            </div>
                            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                                <div className="text-green-400 font-bold">Active</div>
                            </div>
                        </div>
                    </section>

                    {/* Profile Settings */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold text-white">Profile Settings</h2>
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Username
                                    </label>
                                    <div className="flex gap-3">
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="flex-1 bg-black/50 border-white/20 text-white"
                                            placeholder="Enter username"
                                        />
                                        <Button onClick={handleSave} variant="cyber" size="sm" className="min-w-[100px]">
                                            {saved ? "✓ Saved" : <><Save className="w-4 h-4 mr-2" /> Update</>}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Learning Preferences */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Bell className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold text-white">Learning Preferences</h2>
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
                                    <div>
                                        <div className="font-bold text-white">Auto-Save Progress</div>
                                        <div className="text-xs text-muted-foreground">Automatically sync progress to cloud</div>
                                    </div>
                                    <div className="h-6 w-10 bg-primary/20 rounded-full relative">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-primary rounded-full" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
                                    <div>
                                        <div className="font-bold text-white">Show Hints</div>
                                        <div className="text-xs text-muted-foreground">Display hints during simulations</div>
                                    </div>
                                    <div className="h-6 w-10 bg-primary/20 rounded-full relative">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-primary rounded-full" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
                                    <div>
                                        <div className="font-bold text-white">Animations</div>
                                        <div className="text-xs text-muted-foreground">Enable smooth transitions and effects</div>
                                    </div>
                                    <div className="h-6 w-10 bg-primary/20 rounded-full relative">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-primary rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Trash2 className="w-5 h-5 text-red-400" />
                            <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
                        </div>
                        <div className="bg-red-950/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-md">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="font-bold text-red-400 text-lg mb-1">Factory Reset</div>
                                    <div className="text-sm text-red-400/60 max-w-md">
                                        Irreversibly purges all topics, projects, and XP data. System returns to initial boot state. This action cannot be undone.
                                    </div>
                                </div>
                                <Button onClick={handleReset} variant="destructive" size="lg" className="min-w-[160px]">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Initiate Purge
                                </Button>
                            </div>
                        </div>
                    </section>

                </main>
                </div>
            </div>
        </div>
    );
}
