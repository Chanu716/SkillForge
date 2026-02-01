"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { Brain, Code2, Database, Cpu, Terminal, Lock, ChevronRight, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const router = useRouter();
    const { xp, level, subjects, projects } = useGameStore();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen p-8 md:p-12 overflow-y-auto">
            <header className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-1">
                        Command Center
                    </h1>
                    <p className="text-muted-foreground text-sm">Welcome back, Developer.</p>
                </div>
                <div className="text-right flex items-center gap-4">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest text-right">
                        <div className="mb-1">Current Level</div>
                        <div className="text-2xl font-mono font-bold text-primary">LVL {level} <span className="text-sm text-muted-foreground font-normal">/ {xp} XP</span></div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => router.push('/settings')} className="text-muted-foreground hover:text-white">
                        <Settings className="w-6 h-6" />
                    </Button>
                </div>
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
                {/* Learning Pathways Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Brain className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold tracking-wide">Learning Pathways</h2>
                    </div>

                    <div className="space-y-4">
                        {subjects.map((subject) => (
                            <motion.div
                                key={subject.id}
                                variants={item}
                                onClick={() => router.push(`/subject/${subject.id}`)}
                                className="group relative bg-card/50 hover:bg-card border border-white/5 hover:border-primary/50 transition-all duration-300 rounded-xl p-6 cursor-pointer overflow-hidden backdrop-blur-sm"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                    {subject.id === 'DBMS' ? <Database className="w-12 h-12 text-blue-500/10" /> :
                                        subject.id === 'OS' ? <Cpu className="w-12 h-12 text-green-500/10" /> :
                                            <Terminal className="w-12 h-12 text-purple-500/10" />}
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                                            subject.id === 'DBMS' ? "bg-blue-500/10 text-blue-400" :
                                                subject.id === 'OS' ? "bg-green-500/10 text-green-400" :
                                                    "bg-purple-500/10 text-purple-400"
                                        )}>
                                            {subject.id}
                                        </span>
                                        <div className="text-xs text-muted-foreground">{subject.topics.filter(t => t.isCompleted).length} / {subject.topics.length} TOPICS</div>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                                        {subject.title} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h3>
                                    <div className="max-h-24 overflow-y-auto">
                                        <p className="text-sm text-muted-foreground">{subject.description}</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(subject.topics.filter(t => t.isCompleted).length / subject.topics.length) * 100}%` }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Project Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Code2 className="w-6 h-6 text-secondary" />
                        <h2 className="text-xl font-bold tracking-wide">Project Workspace</h2>
                    </div>

                    <div className="space-y-4">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                variants={item}
                                onClick={() => router.push(`/project/${project.id}`)}
                                className={cn(
                                    "group relative bg-card/50 border border-white/5 transition-all duration-300 rounded-xl p-6 overflow-hidden backdrop-blur-sm cursor-pointer hover:border-secondary/50",
                                )}
                            >
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-secondary transition-colors">{project.title}</h3>
                                    <div className="max-h-24 overflow-y-auto mb-2">
                                        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {project.levels.map((lvl, i) => (
                                            <div key={lvl.id} className={cn(
                                                "h-1.5 rounded-full transition-colors",
                                                lvl.isCompleted ? "bg-green-500" :
                                                    lvl.isLocked ? "bg-white/10" : "bg-secondary"
                                            )} title={lvl.title} />
                                        ))}
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {project.levels.filter(l => l.isCompleted).length} / {project.levels.length} Levels Completed
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </motion.div>
        </div>
    );
}
