"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, ArrowRight, Zap, Shield, Flame, Activity, Clock, Users, Timer, Factory, Info, XCircle } from "lucide-react";

type Difficulty = "EASY" | "MEDIUM" | "HARD" | null;

interface Level {
    id: number;
    title: string;
    question: string;
    formula: string;
    options: number[];
    correctAnswer: number;
    explanation: string;
}

const GENERATE_LEVELS = (diff: Difficulty): Level[] => {
    if (!diff) return [];
    return Array.from({ length: 15 }, (_, i) => {
        const id = i + 1;
        if (diff === "EASY") {
            const a = (i + 2) * 2;
            const b = (i + 2) * 2;
            return {
                id, title: `Efficiency Alpha ${id}`,
                question: `Drone A completes a task in ${a}h, Drone B in ${b}h. How long if they sync?`,
                formula: "Together = (A * B) / (A + B)",
                correctAnswer: (a * b) / (a + b),
                options: [(a * b) / (a + b), a + b, a, b],
                explanation: `Since they work together, their combined rate is 1/${a} + 1/${b}. Simplified: (${a}*${b})/(${a}+${b}) = ${(a * b) / (a + b)}.`
            };
        }
        if (diff === "MEDIUM") {
            const a = 10 + i;
            const b = 20 + i;
            const ans = parseFloat(((a * b) / (a + b)).toFixed(1));
            return {
                id, title: `Process Expert ${id}`,
                question: `Unit X processes data in ${a}ms. Unit Y in ${b}ms. Sync time?`,
                formula: "Result = (X*Y)/(X+Y) rounded to 1 decimal",
                correctAnswer: ans,
                options: [ans, Math.floor(ans), Math.ceil(ans), parseFloat((ans + 1).toFixed(1))],
                explanation: `Combined efficiency is the reciprocal of the sum of reciprocals. (${a} * ${b}) / (${a} + ${b}) = ${ans}.`
            };
        }
        // HARD: 3 Workers
        const a = 12;
        const b = 15;
        const c = 20;
        return {
            id, title: `Master Architect ${id}`,
            question: `Core Alpha: ${a}s, Core Beta: ${b}s, Core Gamma: ${c}s. Total sync time?`,
            formula: "1/T = 1/A + 1/B + 1/C",
            correctAnswer: 5,
            options: [5, 6, 8, 10],
            explanation: `1/12 + 1/15 + 1/20 = (5+4+3)/60 = 12/60 = 1/5. Thus, T = 5 seconds.`
        };
    });
};

export default function TimeWorkSimulator({ onComplete }: { onComplete: (score: number) => void }) {
    const [difficulty, setDifficulty] = useState<Difficulty>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<"SUCCESS" | "ERROR" | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const levels = useMemo(() => GENERATE_LEVELS(difficulty), [difficulty]);
    const level = levels[currentIdx];

    const handleCheck = (val: number) => {
        if (feedback) return;
        setSelected(val);
        if (val === level.correctAnswer) setFeedback("SUCCESS");
        else setFeedback("ERROR");
    };

    const nextLevel = () => {
        if (currentIdx < levels.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelected(null);
            setFeedback(null);
        } else {
            setIsFinished(true);
            onComplete(100);
        }
    };

    if (!difficulty) {
        return (
            <div className="w-full max-w-4xl mx-auto py-20 px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <Factory className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">TIME & WORK ARC</h1>
                    <p className="text-primary/60 font-mono tracking-widest uppercase">Optimize efficiency parameters for maximum throughput.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { id: "EASY", label: "NOVICE", icon: Zap, color: "text-cyan-400", bg: "bg-cyan-400/10" },
                        { id: "MEDIUM", label: "EXPERT", icon: Shield, color: "text-purple-400", bg: "bg-purple-400/10" },
                        { id: "HARD", label: "MASTER", icon: Flame, color: "text-red-400", bg: "bg-red-400/10" }
                    ].map((d, i) => (
                        <motion.button
                            key={d.id}
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            onClick={() => setDifficulty(d.id as Difficulty)}
                            className={cn("p-10 rounded-[40px] border-2 border-white/5 bg-white/5 hover:border-primary/50 transition-all", d.bg)}
                        >
                            <d.icon className={cn("w-12 h-12 mx-auto mb-6", d.color)} />
                            <h3 className="text-2xl font-black text-white">{d.label}</h3>
                            <div className="mt-4 flex justify-center gap-1">
                                {Array.from({ length: i + 1 }).map((_, j) => <div key={j} className="h-1 w-4 bg-primary/40 rounded-full" />)}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="text-center p-20 bg-black/40 rounded-[40px] border-2 border-primary/20 backdrop-blur-2xl">
                <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-8" />
                <h2 className="text-5xl font-bold text-white mb-4">EFFICIENCY PEAK REACHED</h2>
                <Button onClick={() => setDifficulty(null)}>RESTART PROTOCOL</Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
            <div className="flex justify-between items-end px-4">
                <div className="space-y-2">
                    <p className="text-xs font-mono text-primary uppercase tracking-[0.4em]">Efficiency Loop: {difficulty}</p>
                    <div className="flex gap-1.5">
                        {levels.map((_, i) => (
                            <div key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i < currentIdx ? "bg-primary w-4" : i === currentIdx ? "bg-primary w-12 shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "bg-white/5 w-4")} />
                        ))}
                    </div>
                </div>
                <Button variant="ghost" onClick={() => setDifficulty(null)} className="text-[10px] font-mono opacity-40">Abort</Button>
            </div>

            <motion.div 
                key={currentIdx + (feedback === "ERROR" ? "-err" : "")}
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.03] border-2 border-white/10 rounded-[50px] p-16 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm"
            >
                {feedback === "ERROR" ? (
                    <div className="flex flex-col items-center text-center max-w-2xl py-10">
                        <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Efficiency Leak ❌</h2>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 w-full text-left">
                            <p className="text-lg text-white/80 mb-6 font-medium">🧐 {level.explanation}</p>
                            <div className="flex justify-between items-center p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                                <span className="text-xs font-mono text-green-500/60 uppercase">Optimal Sync</span>
                                <span className="text-4xl font-black text-green-500 font-mono">{level.correctAnswer}</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={() => setFeedback(null)} size="lg" variant="outline">Retry</Button>
                            <Button onClick={nextLevel} size="lg">Next Task</Button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full space-y-12">
                        <div className="flex flex-col items-center gap-10">
                            <div className="flex gap-12">
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="p-8 bg-primary/10 border-2 border-primary/30 rounded-[32px] text-center shadow-[0_0_40px_rgba(var(--primary),0.1)]">
                                    <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
                                    <p className="text-3xl font-black text-white">{level.question.match(/\d+/g)?.[0] || '?'}</p>
                                    <p className="text-[10px] font-mono text-primary/60 uppercase">Load Alpha</p>
                                </motion.div>
                                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3.5 }} className="p-8 bg-secondary/10 border-2 border-secondary/30 rounded-[32px] text-center shadow-[0_0_40px_rgba(var(--secondary),0.1)]">
                                    <Activity className="w-8 h-8 text-secondary mx-auto mb-4" />
                                    <p className="text-3xl font-black text-white">{level.question.match(/\d+/g)?.[1] || '?'}</p>
                                    <p className="text-[10px] font-mono text-secondary/60 uppercase">Load Beta</p>
                                </motion.div>
                            </div>
                            <div className="text-center max-w-2xl">
                                <h3 className="text-3xl font-bold text-white leading-tight mb-4">{level.question}</h3>
                                <p className="text-xs font-mono text-white/30 tracking-[0.3em] uppercase">{level.formula}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
                            {level.options.map((opt, i) => (
                                <motion.button
                                    key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCheck(opt)}
                                    className={cn(
                                        "p-8 rounded-3xl border-2 transition-all font-mono text-2xl font-bold",
                                        selected === opt 
                                            ? (opt === level.correctAnswer ? "border-green-500 bg-green-500/20 text-green-500" : "border-red-500 bg-red-500/20 text-red-500")
                                            : "border-white/10 bg-white/5 text-white/60 hover:border-primary/50"
                                    )}
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
            
            <AnimatePresence>
                {feedback === "SUCCESS" && (
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="flex flex-col items-center gap-6">
                        <p className="text-primary font-mono text-sm tracking-[0.4em] uppercase font-bold animate-pulse">Throughput Optimized ✅</p>
                        <Button onClick={nextLevel} size="xl" className="rounded-full px-20 py-10 text-2xl font-black bg-primary hover:bg-primary/90 shadow-[0_20px_60px_rgba(var(--primary),0.3)] group">
                            NEXT QUESTION 🚀 <ArrowRight className="ml-6 w-8 h-8 group-hover:translate-x-3 transition-transform" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
