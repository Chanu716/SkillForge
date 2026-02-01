"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, ArrowRight, Brain, Sparkles, Hash, Zap, Shield, Flame, Activity, Info, XCircle } from "lucide-react";

type LevelType = "GRID_SEQUENCE" | "TRIANGLE_MATH" | "SQUARE_LOGIC" | "CROSS_LOGIC" | "LINE_SEQUENCE" | "NUMBER_GRID";
type Difficulty = "EASY" | "MEDIUM" | "HARD" | null;

interface Level {
    id: number;
    type: LevelType;
    title: string;
    gridSteps?: number[]; 
    nodes?: number[]; 
    centerValue?: number;
    sequence?: number[];
    gridData?: number[][];
    options: number[];
    correctAnswer: number;
    explanation: string;
}

const GENERATE_LEVELS_BY_DIFF = (diff: Difficulty): Level[] => {
    if (!diff) return [];
    
    return Array.from({ length: 15 }, (_, i) => {
        const id = i + 1;
        const typePool: LevelType[] = ["GRID_SEQUENCE", "CROSS_LOGIC", "LINE_SEQUENCE", "NUMBER_GRID", "TRIANGLE_MATH"];
        const type = typePool[i % typePool.length];

        if (diff === "EASY") {
            if (type === "LINE_SEQUENCE") return {
                id, type, title: `Easy Sequence ${id}`,
                sequence: [id * 2, id * 2 + 2, id * 2 + 4, -1],
                options: [id * 2 + 6, id * 2 + 8, id * 2 + 5, id * 2 + 7],
                correctAnswer: id * 2 + 6,
                explanation: `The sequence follows a simple +2 pattern. ${id * 2 + 4} + 2 = ${id * 2 + 6}.`
            };
            if (type === "CROSS_LOGIC") return {
                id, type, title: `Easy Cross ${id}`,
                nodes: [10, 5, 5, 10], 
                options: [10, 20, 30, 0],
                correctAnswer: 10,
                explanation: "The pattern is (Left + Right) + (Top - Bottom). In this case: (5 + 5) + (10 - 10) = 10."
            };
            return {
                id, type: "GRID_SEQUENCE", title: `Easy Grid ${id}`,
                gridSteps: [0, 1, 2],
                options: [0, 1, 2, 3],
                correctAnswer: 3,
                explanation: "The token is moving clockwise one cell at a time. The next logical position is index 3."
            };
        }

        if (diff === "MEDIUM") {
            if (type === "NUMBER_GRID") return {
                id, type, title: `Mid Matrix ${id}`,
                gridData: [[12, 6, 12], [24, 12, 24], [36, -1, 36]],
                options: [12, 18, 24, 30],
                correctAnswer: 18,
                explanation: "Each middle number is exactly half of the surrounding numbers in its row. 36 / 2 = 18."
            };
            if (type === "LINE_SEQUENCE") return {
                id, type, title: `Mid Sequence ${id}`,
                sequence: [2, 4, 8, 16, -1],
                options: [24, 32, 40, 48],
                correctAnswer: 32,
                explanation: "The sequence doubles each time (x2). 16 x 2 = 32."
            };
            return {
                id, type: "CROSS_LOGIC", title: `Mid Cross ${id}`,
                nodes: [15, 20, 30, 10],
                options: [50, 55, 60, 45],
                correctAnswer: 55,
                explanation: "The logic is (Left + Right) + (Top - Bottom). Here: (20 + 30) + (15 - 10) = 50 + 5 = 55."
            };
        }

        // HARD
        if (type === "NUMBER_GRID") return {
            id, type, title: `Hard Matrix ${id}`,
            gridData: [[53, 15, 61], [47, 17, 24], [32, -1, 12]],
            options: [8, 9, 7, 6],
            correctAnswer: 8,
            explanation: "The middle number is the sum of digits of the outer numbers. For the last row: (3+2) + (1+2) = 5 + 3 = 8."
        };
        if (type === "LINE_SEQUENCE") return {
            id, type, title: `Hard Sequence ${id}`,
            sequence: [1, 2, 6, 24, -1],
            options: [48, 120, 144, 100],
            correctAnswer: 120,
            explanation: "This is a factorial sequence (1!, 2!, 3!, 4!). The next is 5!, which is 5 x 24 = 120."
        };
        return {
            id, type: "TRIANGLE_MATH", title: `Hard Tri ${id}`,
            nodes: [14, 8, 16],
            options: [6, 7, 8, 9],
            correctAnswer: 7,
            explanation: "Relationship: (Top * Left) / Right = Center. Calculation: (14 * 8) / 16 = 112 / 16 = 7."
        };
    });
};

export default function AptitudeBridge({ onComplete }: { onComplete: (score: number) => void }) {
    const [difficulty, setDifficulty] = useState<Difficulty>(null);
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<"SUCCESS" | "ERROR" | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const levels = useMemo(() => GENERATE_LEVELS_BY_DIFF(difficulty), [difficulty]);
    const level = levels[currentLevelIdx];

    const handleCheck = (val: number) => {
        if (feedback) return; // Prevent multiple clicks during feedback
        setSelectedOption(val);
        if (val === level.correctAnswer) {
            setFeedback("SUCCESS");
        } else {
            setFeedback("ERROR");
        }
    };

    const nextLevel = () => {
        if (currentLevelIdx < levels.length - 1) {
            setCurrentLevelIdx(prev => prev + 1);
            setSelectedOption(null);
            setFeedback(null);
        } else {
            setIsFinished(true);
            onComplete(100);
        }
    };

    const retryLevel = () => {
        setSelectedOption(null);
        setFeedback(null);
    };

    if (!difficulty) {
        return (
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block p-4 rounded-3xl bg-secondary/10 border border-secondary/20 mb-6">
                        <Brain className="w-12 h-12 text-primary animate-pulse" />
                    </div>
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">SELECT PROTOCOL</h1>
                    <p className="text-primary/60 font-mono tracking-widest uppercase text-sm">Synchronize neural architecture for challenge levels.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-6">
                    {[
                        { id: "EASY", label: "NOVICE", icon: Zap, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
                        { id: "MEDIUM", label: "EXPERT", icon: Shield, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
                        { id: "HARD", label: "MASTER", icon: Flame, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" }
                    ].map((d, i) => (
                        <motion.button
                            key={d.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setDifficulty(d.id as Difficulty)}
                            className={cn(
                                "relative group p-10 rounded-[40px] border-2 transition-all duration-500 overflow-hidden",
                                d.bg, d.border, "hover:border-white/20"
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <d.icon className={cn("w-16 h-16 mx-auto mb-8", d.color)} />
                            <h3 className={cn("text-3xl font-black text-white mb-2 tracking-tighter", d.color)}>{d.label}</h3>
                            <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.2em]">Neural Path {i + 1}</p>
                            
                            <div className="mt-8 flex justify-center gap-1">
                                {Array.from({ length: i + 1 }).map((_, j) => (
                                    <div key={j} className={cn("h-1 w-6 rounded-full bg-white/20", d.color.replace('text-', 'bg-'))} />
                                ))}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    if (isFinished) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-20 bg-black/40 rounded-[40px] border-2 border-primary/20 backdrop-blur-2xl shadow-2xl">
                <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-10 drop-shadow-[0_0_40px_rgba(250,204,21,0.2)]" />
                <h2 className="text-6xl font-bold text-white mb-6 tracking-tighter">COGNITIVE SYNC COMPLETE</h2>
                <p className="text-primary/70 font-mono text-lg tracking-[0.6em] uppercase mb-16">Intelligence parameters maximized.</p>
                <div className="inline-block px-10 py-4 bg-primary/10 border border-primary/30 rounded-full text-primary font-mono text-sm animate-pulse">
                    TERMINATING NEURAL LINK...
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
            {/* Header HUD */}
            <div className="w-full mb-16 flex justify-between items-end px-6">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/20 border border-primary/40">
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-mono text-primary uppercase tracking-[0.5em] font-bold">Protocol: {difficulty}</p>
                            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Active Neural Link</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {levels.map((_, i) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "h-2 rounded-full transition-all duration-700",
                                    i < currentLevelIdx ? "bg-primary w-6" : i === currentLevelIdx ? "bg-primary w-[80px] shadow-[0_0_20px_rgba(var(--primary),0.8)]" : "bg-white/10 w-6"
                                )} 
                            />
                        ))}
                    </div>
                </div>
                <div className="text-right ml-12">
                    <Button variant="ghost" onClick={() => setDifficulty(null)} className="text-[10px] font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity mb-4">Reset Link</Button>
                    <div className="text-xs font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Sync Efficiency</div>
                    <div className="text-5xl font-bold text-white font-mono tracking-tighter">
                        {Math.floor(((currentLevelIdx) / levels.length) * 100)}<span className="text-2xl text-primary/50 text-primary">%</span>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentLevelIdx + (feedback === "ERROR" ? "-error" : "")}
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                    className="bg-black/40 border-2 border-white/10 rounded-[50px] p-6 w-full min-h-[320px] flex flex-col items-center justify-between relative overflow-hidden backdrop-blur-xl shadow-3xl"
                >
                    {/* Background Glows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-10" />
                    
                    {/* Visual Puzzle Area */}
                    <div className="flex-1 w-full flex items-center justify-center py-6">
                        {feedback === "ERROR" ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center text-center max-w-2xl"
                            >
                                <div className="p-6 rounded-full bg-red-500/20 border-2 border-red-500/40 mb-8">
                                    <XCircle className="w-16 h-16 text-red-500" />
                                </div>
                                <h2 className="text-4xl font-black text-red-500 mb-4 tracking-tighter uppercase">Neural Desync: Incorrect</h2>
                                
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 text-left w-full">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Info className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold">Analysis Feedback</span>
                                    </div>
                                    <div className="max-h-32 overflow-y-auto">
                                        <p className="text-white/80 text-lg leading-relaxed mb-6 font-medium">
                                            {level.explanation}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Correct Resonance</span>
                                        <span className="text-3xl font-black text-green-500 font-mono">{level.correctAnswer}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button 
                                        onClick={retryLevel}
                                        size="lg"
                                        className="bg-white/5 hover:bg-white/10 text-white rounded-full px-12 py-6 font-bold border border-white/10 transition-all hover:scale-105"
                                    >
                                        RETRY CALIBRATION
                                    </Button>
                                    <Button 
                                        onClick={nextLevel}
                                        size="lg"
                                        className="bg-primary/20 hover:bg-primary/30 text-primary rounded-full px-12 py-6 font-bold border border-primary/30 transition-all hover:scale-105"
                                    >
                                        NEXT SEQUENCE
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {level.type === "GRID_SEQUENCE" && (
                                    <div className="flex flex-col items-center gap-20">
                                        <div className="flex gap-12 items-center">
                                            {level.gridSteps?.map((activeIdx, i) => (
                                                <div key={i} className="flex flex-col items-center gap-6">
                                                    <div className="grid grid-cols-2 gap-3 p-4 bg-white/5 rounded-3xl border-2 border-white/20 shadow-2xl">
                                                        {[0, 1, 2, 3].map(cell => (
                                                            <div 
                                                                key={cell} 
                                                                className={cn(
                                                                    "w-14 h-14 rounded-xl transition-all duration-500", 
                                                                    cell === activeIdx ? "bg-primary shadow-[0_0_25px_rgba(var(--primary),0.8)] scale-110" : "bg-white/5 border border-white/5"
                                                                )} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="text-[12px] font-mono text-white/40 uppercase tracking-[0.4em] font-black">PHASE {i + 1}</div>
                                                </div>
                                            ))}
                                            
                                            <div className="text-primary animate-pulse opacity-50">
                                                <ArrowRight className="w-10 h-10" />
                                            </div>

                                            <div className="flex flex-col items-center gap-6">
                                                <div className="grid grid-cols-2 gap-3 p-4 bg-primary/10 rounded-3xl border-2 border-primary/40 shadow-[0_0_30px_rgba(var(--primary),0.2)] relative">
                                                    {[0, 1, 2, 3].map(cell => (
                                                        <div key={cell} className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                                                            <Hash className="w-6 h-6 text-primary/20" />
                                                        </div>
                                                    ))}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-3xl">
                                                        <Sparkles className="w-12 h-12 text-primary animate-pulse shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
                                                    </div>
                                                </div>
                                                <div className="text-[12px] font-mono text-primary uppercase tracking-[0.4em] font-black">Predict</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {level.type === "CROSS_LOGIC" && (
                                    <div className="relative w-80 h-80 flex items-center justify-center">
                                        <div className="absolute top-4 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-black text-white">{level.nodes?.[0]}</div>
                                        <div className="absolute bottom-4 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-black text-white">{level.nodes?.[3]}</div>
                                        <div className="absolute left-4 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-black text-white">{level.nodes?.[1]}</div>
                                        <div className="absolute right-4 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-black text-white">{level.nodes?.[2]}</div>
                                        
                                        <div className="w-28 h-28 rounded-full bg-primary/10 border-4 border-primary/40 flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary),0.3)]">
                                            <span className="text-6xl font-black text-primary animate-pulse">?</span>
                                        </div>
                                    </div>
                                )}

                                {level.type === "LINE_SEQUENCE" && (
                                    <div className="flex gap-4 items-center flex-wrap justify-center px-10">
                                        {level.sequence?.map((val, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-20 h-20 rounded-full border-2 flex items-center justify-center text-3xl font-black transition-all duration-700",
                                                    val === -1 ? "border-primary/50 bg-primary/10 animate-pulse text-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]" : "border-white/10 bg-white/5 text-white"
                                                )}>
                                                    {val === -1 ? "?" : val}
                                                </div>
                                                {i < (level.sequence?.length || 0) - 1 && <div className="w-6 h-0.5 bg-white/5" />}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {level.type === "NUMBER_GRID" && (
                                    <div className="grid grid-cols-3 gap-8">
                                        {level.gridData?.flat().map((val, i) => (
                                            <div key={i} className={cn(
                                                "w-32 h-24 rounded-3xl border-2 flex items-center justify-center text-5xl font-black transition-all",
                                                val === -1 
                                                    ? "border-primary/60 bg-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.3)] text-primary animate-pulse" 
                                                    : "border-white/10 bg-black/40 text-white"
                                            )}>
                                                {val === -1 ? "?" : val}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {level.type === "TRIANGLE_MATH" && (
                                    <div className="relative w-80 h-80">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-3xl text-white font-bold">{level.nodes?.[0]}</div>
                                        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-3xl text-white font-bold">{level.nodes?.[1]}</div>
                                        <div className="absolute bottom-0 right-0 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-3xl text-white font-bold">{level.nodes?.[2]}</div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary/50 flex items-center justify-center">
                                                <span className="text-5xl font-bold text-primary animate-pulse">?</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Interaction Options */}
                    {!feedback || feedback === "SUCCESS" ? (
                        <div className="w-full space-y-12">
                            <div className="flex justify-center gap-10 flex-wrap">
                                {level.options.map((option, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ y: -8, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleCheck(option)}
                                        className={cn(
                                            "w-28 h-28 rounded-3xl border-4 transition-all duration-500 flex flex-col items-center justify-center gap-2 relative overflow-hidden",
                                            selectedOption === option 
                                                ? (option === level.correctAnswer ? "border-green-500 bg-green-500/30 text-green-400 shadow-[0_0_40px_rgba(34,197,94,0.5)]" : "border-red-500 bg-red-500/30 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]")
                                                : "border-white/10 bg-black/40 text-white/90 hover:border-primary hover:bg-primary/20 hover:text-primary shadow-xl"
                                        )}
                                    >
                                        {level.type === "GRID_SEQUENCE" ? (
                                            <div className="grid grid-cols-2 gap-1.5 p-2 bg-black/40 rounded-lg">
                                                {[0, 1, 2, 3].map(cell => (
                                                    <div key={cell} className={cn("w-6 h-6 rounded-md", cell === option ? "bg-current shadow-[0_0_10px_currentColor]" : "bg-current/10")} />
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-4xl font-black font-mono tracking-tighter">{option}</span>
                                        )}
                                        <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest font-black">{String.fromCharCode(65 + i)}</span>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="flex justify-center h-20">
                                <AnimatePresence>
                                    {feedback === "SUCCESS" && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                                            exit={{ opacity: 0, scale: 0.8 }}
                                        >
                                            <Button 
                                                onClick={nextLevel} 
                                                size="xl" 
                                                className="bg-primary hover:bg-primary/90 text-white px-20 py-8 rounded-[25px] text-xl font-black shadow-[0_20px_50px_rgba(var(--primary),0.3)] group relative overflow-hidden"
                                            >
                                                <span className="relative z-10 flex items-center gap-4">
                                                    CONTINUE SYNC <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                                                </span>
                                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : null}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}