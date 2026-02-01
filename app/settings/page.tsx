"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Volume2, Monitor } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export default function SettingsPage() {
    const router = useRouter();
    const { username, setUsername, resetProgress } = useGameStore();
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
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <header className="max-w-4xl mx-auto mb-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-3xl font-bold font-display tracking-tight text-white">System Configuration</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto space-y-12">

                {/* Profile Section */}
                <section className="space-y-6">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest border-b border-white/10 pb-2">Identity Matrix</h2>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Operator Designation (Username)</label>
                                <div className="flex gap-4">
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="max-w-md"
                                    />
                                    <Button onClick={handleSave} variant="cyber" size="sm">
                                        {saved ? "Saved" : <><Save className="w-4 h-4 mr-2" /> Update</>}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Preferences Simulation */}
                <section className="space-y-6">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest border-b border-white/10 pb-2">Sensory Output</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-center justify-between opacity-50 cursor-not-allowed" title="Not available in simulation">
                            <div className="flex items-center gap-3">
                                <Monitor className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="font-bold">Interface Theme</div>
                                    <div className="text-xs text-muted-foreground">Dark Mode (Locked)</div>
                                </div>
                            </div>
                            <div className="h-6 w-10 bg-primary/20 rounded-full relative">
                                <div className="absolute right-1 top-1 h-4 w-4 bg-primary rounded-full" />
                            </div>
                        </div>

                        <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-center justify-between opacity-50 cursor-not-allowed">
                            <div className="flex items-center gap-3">
                                <Volume2 className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="font-bold">Audio Feedback</div>
                                    <div className="text-xs text-muted-foreground">System Sounds</div>
                                </div>
                            </div>
                            <div className="h-6 w-10 bg-white/10 rounded-full relative">
                                <div className="absolute left-1 top-1 h-4 w-4 bg-gray-500 rounded-full" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="space-y-6">
                    <h2 className="text-sm font-bold text-red-500/80 uppercase tracking-widest border-b border-red-900/30 pb-2">Danger Zone</h2>
                    <div className="bg-red-950/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-bold text-red-400">Factory Reset</div>
                                <div className="text-sm text-red-400/60 max-w-sm">
                                    Irreversibly purges all topics, projects, and XP data. System returns to initial boot state.
                                </div>
                            </div>
                            <Button onClick={handleReset} variant="destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Initiate Purge
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
