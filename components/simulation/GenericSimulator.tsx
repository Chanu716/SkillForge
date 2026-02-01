"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, ArrowRight, Zap, Shield, Flame, Terminal, Database, Cpu, Info, CheckCircle2, XCircle } from "lucide-react";

type Difficulty = "EASY" | "MEDIUM" | "HARD" | null;

interface Level {
    id: number;
    title: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface GenericSimulatorProps {
    topicId: string;
    topicTitle: string;
    onComplete: (score: number) => void;
}

const GET_CONTENT = (topicId: string, diff: Difficulty): Level[] => {
    if (!diff) return [];
    
    // Default content generator for various topics
    const contentMap: Record<string, any> = {
        'dbms-rel': {
            icon: Database,
            EASY: [
                { q: "What is the primary key in a relational table?", a: "A unique identifier for each record", ex: "Primay keys must be unique and non-null.", opts: ["A unique identifier for each record", "A column with a foreign key", "Any numeric column", "The first column in a table"] },
                { q: "What does a 'Tuple' represent in a relational model?", a: "A row in a table", ex: "In relational terminology, a row is called a tuple and a column is an attribute.", opts: ["A row in a table", "A column in a table", "A primary key", "A database schema"] }
            ],
            MEDIUM: [
                { q: "What is Referential Integrity?", a: "Foreign keys must match a primary key in another table", ex: "It ensures relationships between tables remain consistent.", opts: ["Foreign keys must match a primary key in another table", "All tables must be normalized to 3NF", "Primary keys cannot be composite", "No duplicate rows allowed"] }
            ],
            HARD: [
                { q: "Which relational algebra operation combines rows from two tables based on a condition?", a: "Join", ex: "Joins are used to combine data from multiple relations.", opts: ["Join", "Projection", "Selection", "Union"] }
            ]
        },
        'dbms-er': {
            icon: Database,
            EASY: [
                { q: "In an ER diagram, what shape represents an Entity?", a: "Rectangle", ex: "Rectangles denote entities, ovals denote attributes.", opts: ["Rectangle", "Oval", "Diamond", "Square"] }
            ]
        },
        'os-proc': {
            icon: Cpu,
            EASY: [
                { q: "What is a 'Process' in an Operating System?", a: "A program in execution", ex: "A process is a dynamic entity, while a program is static.", opts: ["A program in execution", "A file on a disk", "A keyboard input", "A physical CPU core"] }
            ]
        },
        'os-sched': {
            icon: Cpu,
            EASY: [
                { q: "Which scheduling algorithm uses a concept of 'Time Quantum'?", a: "Round Robin", ex: "Round Robin uses preemption and time slices for fairness.", opts: ["Round Robin", "First Come First Serve", "Shortest Job First", "Priority Scheduling"] }
            ],
            MEDIUM: [
                { q: "Which algorithm can lead to starvation of long processes?", a: "Shortest Job First", ex: "SJF prioritizes shorter tasks, potentially delaying long tasks indefinitely.", opts: ["Shortest Job First", "Round Robin", "FCFS", "Multi-level Queue"] }
            ]
        },
        'os-dead': {
            icon: Shield,
            EASY: [
                { q: "What are the four necessary conditions for Deadlock?", a: "Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait", ex: "All four must occur simultaneously for a deadlock to exist.", opts: ["Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait", "CPU Scaling, Memory Paging, Mutex, Semaphores", "Wait, Signal, Lock, Release", "None of the above"] }
            ],
            MEDIUM: [
                { q: "The Banker's Algorithm is used for:", a: "Deadlock Avoidance", ex: "It checks if resource allocation leaves the system in a safe state.", opts: ["Deadlock Avoidance", "Deadlock Recovery", "Process Migration", "Memory Allocation"] }
            ]
        },
        'os-files': {
            icon: Database,
            EASY: [
                { q: "An 'Inode' in a file system stores:", a: "Metadata about a file", ex: "Inodes store permissions, ownership, and pointer to data blocks, but not the filename.", opts: ["Metadata about a file", "The actual file data", "The filename", "A copy of the whole directory"] }
            ],
            MEDIUM: [
                { q: "A 'Symlink' (Symbolic Link) differs from a 'Hard Link' because:", a: "It points to a path rather than an inode", ex: "Symlinks can cross file system boundaries and link to directories.", opts: ["It points to a path rather than an inode", "It copies the data directly", "It is faster for search", "It cannot be deleted"] }
            ]
        }
    };

    const baseData = contentMap[topicId] || {
        EASY: [{ q: `Testing knowledge of ${topicId}...`, a: "Option A", ex: "Sample explanation.", opts: ["Option A", "Option B", "Option C", "Option D"] }]
    };

    const pool = baseData[diff] || baseData.EASY;
    
    return Array.from({ length: 5 }, (_, i) => {
        const data = pool[i % pool.length];
        return {
            id: i + 1,
            title: `Logic Unit ${i + 1}`,
            question: data.q,
            options: data.opts,
            correctAnswer: data.a,
            explanation: data.ex
        };
    });
};

export default function GenericSimulator({ topicId, topicTitle, onComplete }: GenericSimulatorProps) {
    const [difficulty, setDifficulty] = useState<Difficulty>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<"SUCCESS" | "ERROR" | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const levels = useMemo(() => GET_CONTENT(topicId, difficulty), [difficulty, topicId]);
    const level = levels[currentIdx];

    const handleCheck = (val: string) => {
        if (feedback) return;
        setSelected(val);
        if (val === level.correctAnswer) setFeedback("SUCCESS");
        else setFeedback("ERROR");
    };

    const nextLevel = () => {
        if (currentIdx < levels.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelected(null);
            setFeedback(feedback === "SUCCESS" ? null : null); // Simple reset
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
                    <Terminal className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">{topicTitle.toUpperCase()}</h1>
                    <p className="text-primary/60 font-mono tracking-widest uppercase">Select knowledge assessment difficulty.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {["EASY", "MEDIUM", "HARD"].map((d, i) => (
                        <motion.button
                            key={d}
                            whileHover={{ y: -10 }}
                            onClick={() => setDifficulty(d as Difficulty)}
                            className="p-10 rounded-[40px] border-2 border-white/5 bg-white/5 hover:border-primary/50 transition-all font-black text-2xl text-white"
                        >
                            {d === "EASY" ? <Shield className="w-12 h-12 mx-auto mb-6 text-primary" /> : 
                             d === "MEDIUM" ? <Zap className="w-12 h-12 mx-auto mb-6 text-primary" /> : 
                             <Flame className="w-12 h-12 mx-auto mb-6 text-primary" />}
                            {d === "EASY" ? "NOVICE" : d === "MEDIUM" ? "EXPERT" : "MASTER"}
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    if (isFinished) return <div className="text-center p-20 text-white text-4xl font-black animate-pulse">SYNCHRONIZATION COMPLETE 🚀</div>;

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
            <div className="bg-black/20 border-2 border-white/10 rounded-[30px] p-4 min-h-[180px] flex flex-col items-center justify-center relative backdrop-blur-md overflow-hidden">
                {feedback === "ERROR" ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center">
                        <div className="text-[120px] mb-8">❌</div>
                        <h2 className="text-5xl font-black text-red-500 mb-6 uppercase tracking-tighter">Neural Desync</h2>
                        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 mb-10 w-full text-left">
                            <p className="text-2xl text-white/90 leading-relaxed italic font-medium">🧐 {level.explanation}</p>
                        </div>
                        <Button onClick={nextLevel} size="xl" className="rounded-full px-20 py-10 text-2xl font-black bg-white/10 hover:bg-white/20 border-2 border-white/10">Understood</Button>
                    </motion.div>
                ) : (
                    <div className="w-full text-center space-y-6">
                        <div className="inline-flex items-center gap-4 px-8 py-3 bg-primary/10 rounded-full border border-primary/20 text-primary font-mono text-xs uppercase tracking-[0.3em] font-bold">
                            Processing Phase: {currentIdx + 1} / {levels.length}
                        </div>
                        <h3 className="text-2xl font-bold text-white max-w-2xl mx-auto leading-tight">{level.question}</h3>
                        
                        <div className="grid grid-cols-2 gap-2 pt-2 px-2">
                            {level.options.map((opt, i) => (
                                <motion.button
                                    key={i} onClick={() => handleCheck(opt)}
                                    className={cn(
                                        "p-4 rounded-xl border-2 transition-all font-bold text-base",
                                        selected === opt 
                                            ? (opt === level.correctAnswer ? "border-green-500 bg-green-500/20 text-green-500" : "border-red-500 bg-red-500/20 text-red-500")
                                            : "border-white/10 bg-white/5 text-white/80 hover:border-primary/40 hover:bg-primary/5"
                                    )}
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {feedback === "SUCCESS" && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
                         <div className="text-[100px] leading-none mb-2 animate-bounce">✅</div>
                         <p className="text-2xl font-black text-green-500 tracking-[0.4em] uppercase">SYNC CRYSTALLIZED</p>
                         <Button onClick={nextLevel} size="xl" className="bg-primary hover:bg-primary/90 text-white px-32 py-12 rounded-full text-3xl font-black shadow-[0_30px_60px_rgba(var(--primary),0.3)] group">
                             NEXT QUESTION 🚀
                         </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}