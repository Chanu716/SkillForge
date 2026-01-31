"use client";

import { useGameStore } from "@/store/gameStore";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Play, CheckCircle2, Save, Terminal as TerminalIcon, Database, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, use } from "react";
import { cn } from "@/lib/utils";

export default function ProjectWorkspacePage({ params }: { params: Promise<{ projectId: string }> }) {
    const unwrappedParams = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const levelId = searchParams.get('level');

    const { projects, unlockProjectLevel } = useGameStore();
    const [output, setOutput] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const project = projects.find(p => p.id === unwrappedParams.projectId);
    const level = project?.levels.find(l => l.id === levelId);

    if (!project || !level) return <div className="p-12 text-center text-red-500">Invalid Project Context</div>;

    const handleRun = () => {
        setIsRunning(true);
        setOutput(['> Initializing build environment...', '> Compiling assets...', '> Running validation tests...']);

        setTimeout(() => {
            const success = Math.random() > 0.3; // Simulating pass/fail
            if (success) {
                setOutput(prev => [...prev, '✓ TESTS PASSED', '> Deploying to staging...']);
                // Mark complete? Note: store doesn't have simple 'completeLevel' yet, we reused unlockProjectLevel maybe? 
                // Actually we need a completeLevel action.
                // For now, let's just simulate output.
            } else {
                setOutput(prev => [...prev, '✗ ERROR: Schema validation failed. Table "Users" missing primary key.']);
            }
            setIsRunning(false);
        }, 2000);
    };

    return (
        <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/project/${project.id}`)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{project.title}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-secondary">{level.title}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setOutput([])}>
                        <Save className="w-4 h-4 mr-2" /> Save Draft
                    </Button>
                    <Button onClick={handleRun} disabled={isRunning} variant="cyber" size="sm">
                        <Play className={cn("w-4 h-4 mr-2", isRunning && "animate-spin")} />
                        {isRunning ? "Compiling..." : "Deploy & Test"}
                    </Button>
                </div>
            </header>

            {/* Workspace Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar / File Explorer */}
                <div className="w-64 border-r border-white/5 bg-black/20 p-4 hidden md:block">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Files</div>
                    <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded cursor-pointer text-white">
                            <Database className="w-4 h-4 text-blue-400" /> schema.sql
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer transition-colors">
                            <TerminalIcon className="w-4 h-4 text-purple-400" /> queries.sql
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer transition-colors">
                            <Layout className="w-4 h-4 text-green-400" /> readme.md
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 bg-[#1e1e1e] p-8 font-mono text-sm text-gray-300 pointer-events-none opacity-80">
                        {/* Placeholder Editor Content */}
                        <p className="text-gray-500">// {level.description}</p>
                        <p className="text-blue-400">CREATE TABLE</p> <span className="text-yellow-300">Users</span> (
                        <div className="pl-4">
                            id <span className="text-blue-400">SERIAL PRIMARY KEY</span>,<br />
                            username <span className="text-blue-400">VARCHAR(50)</span> NOT NULL,<br />
                            email <span className="text-blue-400">VARCHAR(100)</span> UNIQUE<br />
                        </div>
                        );
                    </div>

                    {/* Terminal / Output */}
                    <div className="h-48 border-t border-white/10 bg-black p-4 font-mono text-xs overflow-y-auto">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2 sticky top-0 bg-black pb-2">
                            <TerminalIcon className="w-3 h-3" /> Console Output
                        </div>
                        {output.map((line, i) => (
                            <div key={i} className={cn("mb-1", line.includes('✓') ? "text-green-400" : line.includes('✗') ? "text-red-400" : "text-gray-400")}>
                                {line}
                            </div>
                        ))}
                        {output.length === 0 && <span className="text-gray-600">Ready for deployment...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
