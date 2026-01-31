"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Save, CheckCircle2, AlertTriangle, Terminal as TerminalIcon, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { cn } from "@/lib/utils";

export default function ProjectWorkspace({ params }: { params: { projectId: string } }) {
    const router = useRouter();
    const { projects, updateProjectPhase } = useGameStore();
    const project = projects.find(p => p.id === params.projectId);

    const [activeFile, setActiveFile] = useState('schema.sql');
    const [code, setCode] = useState("-- Define your table structure here\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) NOT NULL\n);");
    const [terminalOutput, setTerminalOutput] = useState<string[]>(["System initialized...", "Waiting for input..."]);
    const [isValidating, setIsValidating] = useState(false);

    if (!project) return <div>Project Not Found</div>;

    const phases = ['ANALYSIS', 'DESIGN', 'IMPLEMENTATION', 'OPTIMIZATION', 'VALIDATION', 'COMPLETED'];

    const handleRun = () => {
        setIsValidating(true);
        setTerminalOutput(prev => [...prev, "> Executing script...", "Analyzing schema normalization..."]);

        setTimeout(() => {
            setTerminalOutput(prev => [...prev, "✔ Syntax Check Passed", "✔ 3NF Verified", "System deployed to staging."]);
            setIsValidating(false);
            if (project.currentPhase !== 'COMPLETED') {
                updateProjectPhase(project.id, 'COMPLETED'); // Simplified progression for demo
            }
        }, 2000);
    };

    return (
        <div className="h-screen flex flex-col bg-[#0d0d12] text-white overflow-hidden font-sans">
            {/* Top Bar */}
            <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-card/20 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-sm font-bold tracking-wide">{project.title}</h1>
                        <div className="flex gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                            <span>{project.currentPhase} MODE</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={handleRun} disabled={isValidating}>
                        {isValidating ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><RotateCcw className="w-4 h-4" /></motion.div> : <Play className="w-4 h-4 mr-2" />}
                        {isValidating ? "Compiling..." : "Deploy"}
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar / File Explorer */}
                <div className="w-64 border-r border-white/5 bg-card/10 flex flex-col">
                    <div className="p-3 text-xs font-bold text-muted-foreground uppercase tracking-widest"> Explorer</div>
                    <div className="flex-1">
                        <div
                            onClick={() => setActiveFile('schema.sql')}
                            className={cn("px-4 py-2 text-sm cursor-pointer flex items-center gap-2", activeFile === 'schema.sql' ? "bg-primary/10 text-primary border-l-2 border-primary" : "hover:bg-white/5")}
                        >
                            <Database className="w-4 h-4" /> schema.sql
                        </div>
                        <div
                            onClick={() => setActiveFile('query.sql')}
                            className={cn("px-4 py-2 text-sm cursor-pointer flex items-center gap-2", activeFile === 'query.sql' ? "bg-primary/10 text-primary border-l-2 border-primary" : "hover:bg-white/5")}
                        >
                            <TerminalIcon className="w-4 h-4" /> query.sql
                        </div>
                    </div>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-white/5 bg-card/5">
                        <div className="px-4 py-2 text-sm border-r border-white/5 bg-[#0d0d12] border-t-2 border-t-primary">{activeFile}</div>
                    </div>

                    {/* Code Editor (Simple Textarea for now) */}
                    <div className="flex-1 relative">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full bg-[#0d0d12] text-sm font-mono p-4 resize-none focus:outline-none text-blue-100 selection:bg-primary/30"
                            spellCheck={false}
                        />
                    </div>

                    {/* Terminal */}
                    <div className="h-48 border-t border-white/10 bg-black/40 flex flex-col">
                        <div className="px-4 py-1 text-[10px] bg-white/5 flex justify-between uppercase tracking-widest text-muted-foreground">
                            <span>Console Output</span>
                            <span>Ready</span>
                        </div>
                        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1">
                            {terminalOutput.map((line, i) => (
                                <div key={i} className={cn(line.includes("✔") ? "text-green-400" : "text-muted-foreground")}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { RotateCcw } from "lucide-react";
