"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, ArrowRight, Zap, Shield, Flame, Target, Share2, Disc, Layers, Info, XCircle, Brain, Network } from "lucide-react";
import Image from "next/image";

type Difficulty = "EASY" | "MEDIUM" | "HARD" | null;

interface Level {
    id: number;
    title: string;
    question: string;
    bits: { type: 'GREEN' | 'RED' | 'BLUE', count: number }[];
    options: string[];
    correctAnswer: string;
    explanation: string;
    visualType?: 'BITS' | 'DICE' | 'COINS' | 'CARDS';
    visualData?: any;
}

const GENERATE_LEVELS = (diff: Difficulty): Level[] => {
    if (!diff) return [];

    return Array.from({ length: 15 }, (_, i) => {
        const id = i + 1;
        const seed = i + 1;
        const typeSelector = i % 4; // 0: Bits, 1: Dice, 2: Coins, 3: Cards

        if (typeSelector === 0) {
            // BIT CHAMBER
            const green = 3 + (seed % 6);
            const red = 2 + ((seed * 3) % 7);
            const blue = 1 + (seed % 4);
            const total = green + red + blue;
            return {
                id, title: `Risk Layer ${id}`,
                visualType: 'BITS',
                question: `Chamber: ${green}G, ${red}R, ${blue}B. Chance of picking a GREEN bit?`,
                bits: [{ type: 'GREEN', count: green }, { type: 'RED', count: red }, { type: 'BLUE', count: blue }],
                correctAnswer: `${green}/${total}`,
                options: [`${green}/${total}`, `${red}/${total}`, `${blue}/${total}`, `1/${total}`].sort(() => Math.random() - 0.5),
                explanation: `P(G) = Green(${green}) / Total(${total}) = ${green}/${total}.`
            };
        }

        if (typeSelector === 1) {
            // DICE PHYSICS
            const diceCount = diff === "EASY" ? 1 : 2;
            const target = 2 + (seed % 5);
            if (diceCount === 1) {
                return {
                    id, title: `Chrono Roll ${id}`,
                    visualType: 'DICE',
                    visualData: { count: 1, target },
                    question: `Roll a standard 6-sided die. Chance of getting exactly a ${target}?`,
                    bits: [],
                    correctAnswer: `1/6`,
                    options: [`1/6`, `1/2`, `${target}/6`, `None`].sort(() => Math.random() - 0.5),
                    explanation: `A die has 6 sides. Only one side is ${target}. Probability is 1/6.`
                };
            } else {
                const sum = target + 4;
                let ways = 0;
                for (let d1 = 1; d1 <= 6; d1++) {
                    for (let d2 = 1; d2 <= 6; d2++) {
                        if (d1 + d2 === sum) ways++;
                    }
                }
                return {
                    id, title: `Dual Vector Roll ${id}`,
                    visualType: 'DICE',
                    visualData: { count: 2, target: sum },
                    question: `Roll 2 dice. Chance the total sum equals ${sum}?`,
                    bits: [],
                    correctAnswer: `${ways}/36`,
                    options: [`${ways}/36`, `${ways + 1}/36`, `1/6`, `1/12`].sort(() => Math.random() - 0.5),
                    explanation: `Rolling 2 dice has 36 outcomes. There are ${ways} ways to get a sum of ${sum}.`
                };
            }
        }

        if (typeSelector === 2) {
            // COIN TOSS
            const flips = diff === "EASY" ? 2 : 3;
            const targetHeads = diff === "EASY" ? 1 : 2;
            const totalOutcomes = Math.pow(2, flips);
            const ans = flips === 2 ? (targetHeads === 1 ? "2/4" : "1/4") : (targetHeads === 2 ? "3/8" : "1/8");
            return {
                id, title: `Binary Toss ${id}`,
                visualType: 'COINS',
                visualData: { count: flips, target: targetHeads },
                question: `Toss ${flips} coins. Chance of getting exactly ${targetHeads} Heads?`,
                bits: [],
                correctAnswer: ans,
                options: ["1/2", "2/4", "3/8", "1/4", "1/8"].filter(o => o !== ans).slice(0, 3).concat(ans).sort(() => Math.random() - 0.5),
                explanation: `Flips: ${flips}. Total outcomes: ${totalOutcomes}. Count the combinations for ${targetHeads} heads.`
            };
        }

        // CARDS
        const isFace = seed % 2 === 0;
        return {
            id, title: `Deck Scan ${id}`,
            visualType: 'CARDS',
            question: isFace ? "Pick a card from a 52-card deck. Chance it's a Face Card (J, Q, K)?" : "Pick a card. Chance it's a Heart?",
            bits: [],
            correctAnswer: isFace ? "12/52" : "13/52",
            options: ["12/52", "13/52", "4/52", "1/52", "26/52"].sort(() => Math.random() - 0.5),
            explanation: isFace ? "There are 4 Jacks, 4 Queens, and 4 Kings = 12 total face cards." : "There are 4 suits, so 13 cards are Hearts."
        };
    });
};

const CardShuffleDeck = () => {
    const [order, setOrder] = useState([0, 1, 2, 3, 4]);
    const [isDealt, setIsDealt] = useState(true);

    useMemo(() => {
        const interval = setInterval(() => {
            // 1. Gather cards (Undeal)
            setIsDealt(false);

            // 2. Wait for gather -> Shuffle -> Deal
            setTimeout(() => {
                setOrder(prev => [...prev].sort(() => Math.random() - 0.5));
                setIsDealt(true);
            }, 800);

        }, 4000); // Loop every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence>
                {order.map((cardIndex, visualIndex) => (
                    <motion.div
                        key={`card-${cardIndex}`}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            x: isDealt ? (visualIndex - 2) * 60 : 0,
                            y: isDealt ? Math.abs(visualIndex - 2) * 10 : 0,
                            rotate: isDealt ? (visualIndex - 2) * 10 : Math.random() * 10 - 5,
                            zIndex: isDealt ? visualIndex : 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                            mass: 1,
                            delay: isDealt ? visualIndex * 0.1 : 0 // Stagger deal, sync gather
                        }}
                        className="w-32 h-48 rounded-xl shadow-2xl absolute bg-slate-50 overflow-hidden border border-slate-200"
                        style={{
                            boxShadow: "0 10px 30px -5px rgba(0,0,0,0.3)"
                        }}
                    >
                        <Image
                            src={cardIndex % 2 === 0 ? "/cards/ace_spades.png" : "/cards/queen_hearts.png"}
                            alt="Playing Card"
                            fill
                            className="object-contain p-2"
                        />
                        {/* Card Back for polish (simulated by border/bg if needed, but keeping simple for now) */}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default function ProbabilitySimulator({ onComplete }: { onComplete: (score: number) => void }) {
    const [difficulty, setDifficulty] = useState<Difficulty>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<"SUCCESS" | "ERROR" | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const levels = useMemo(() => GENERATE_LEVELS(difficulty), [difficulty]);
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
                    <Target className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">RISK ASSESSMENT</h1>
                    <p className="text-primary/60 font-mono tracking-widest uppercase">Analyze neural bit variances and calculate probability vectors.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {["EASY", "MEDIUM", "HARD"].map((d, i) => (
                        <motion.button
                            key={d}
                            whileHover={{ y: -10 }}
                            onClick={() => setDifficulty(d as Difficulty)}
                            className="p-10 rounded-[40px] border-2 border-white/5 bg-white/5 hover:border-primary/50 transition-all font-black text-2xl text-white"
                        >
                            <Network className="w-12 h-12 mx-auto mb-6 text-primary" />
                            {d === "EASY" ? "NOVICE" : d === "MEDIUM" ? "EXPERT" : "MASTER"}
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    if (isFinished) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-12 bg-black/40 rounded-xl border border-primary/20 backdrop-blur-md"
            >
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">CALCULATION COMPLETE</h2>
                <p className="text-muted-foreground mb-6">Probability assessment pathways fully established.</p>
                <div className="text-sm font-mono text-primary animate-pulse">INITIATING NEXT PHASE...</div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-2 bg-black/40 rounded-xl border border-white/10 backdrop-blur-md relative overflow-hidden">
            {/* HUD Header */}
            <div className="flex justify-between items-end px-4 mb-12 border-b border-white/5 pb-4">
                <div className="space-y-2">
                    <p className="text-xs font-mono text-primary uppercase tracking-[0.4em]">Protocol: Probability_Assessment</p>
                    <div className="flex gap-1.5">
                        {levels.map((_, i) => (
                            <div key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i < currentIdx ? "bg-primary w-4" : i === currentIdx ? "bg-primary w-12 shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "bg-white/5 w-4")} />
                        ))}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-50">Accuracy</span>
                    <div className="text-lg font-bold text-white">{Math.round((currentIdx / levels.length) * 100)}%</div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="min-h-[450px] flex flex-col items-center justify-center"
                >
                    {feedback === "ERROR" ? (
                        <div className="flex flex-col items-center text-center max-w-2xl py-10">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="bg-red-500/10 p-4 rounded-full mb-4 border border-red-500/20"
                            >
                                <XCircle className="w-16 h-16 text-red-500" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Variance Detected</h2>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 w-full text-left">
                                <p className="text-lg text-white/80 mb-6 font-medium">💡 {level.explanation}</p>
                                <div className="flex justify-between items-center p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                                    <span className="text-xs font-mono text-green-500/60 uppercase">Correct Answer</span>
                                    <span className="text-3xl font-black text-green-500 font-mono">{level.correctAnswer}</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={() => setFeedback(null)} size="lg" variant="outline" className="rounded-full px-10">
                                    Retry
                                </Button>
                                <Button onClick={nextLevel} size="lg" className="rounded-full px-10 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                                    Next Question
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-8"
                            >
                                <motion.h3 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl font-bold text-white uppercase tracking-tighter mb-2"
                                >
                                    {level.title}
                                </motion.h3>
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-muted-foreground text-sm font-mono opacity-60"
                                >
                                    Analyze the scenario and calculate the probability.
                                </motion.p>
                            </motion.div>

                            <div className="w-full">
                                <div className="flex flex-col items-center gap-6">
                                    {/* Dynamic Visualization Chamber */}
                                    <div className="flex gap-8 p-12 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-md relative min-h-[200px] items-center justify-center w-full max-w-2xl mx-auto">
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary/20 border border-primary/40 rounded-full text-[10px] font-mono text-primary uppercase tracking-widest font-black">
                                            {level.visualType || 'BIT'} CHAMBER
                                        </div>

                                        {(!level.visualType || level.visualType === 'BITS') && (
                                            <div className="flex gap-4 flex-wrap justify-center">
                                                {level.bits.map((bit, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        {Array.from({ length: bit.count }).map((_, bIdx) => (
                                                            <motion.div
                                                                key={bIdx}
                                                                initial={{ scale: 0, rotate: -45 }}
                                                                animate={{ scale: 1, rotate: 0 }}
                                                                transition={{ type: "spring", stiffness: 200, delay: bIdx * 0.05 }}
                                                                className={cn(
                                                                    "w-12 h-12 rounded-full border-4 shadow-xl",
                                                                    bit.type === 'GREEN' ? "bg-green-500/20 border-green-500 shadow-green-500/20" :
                                                                        bit.type === 'RED' ? "bg-red-500/20 border-red-500 shadow-red-500/20" :
                                                                            "bg-blue-500/20 border-blue-500 shadow-blue-500/20"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {level.visualType === 'DICE' && (
                                            <div className="flex gap-12">
                                                {Array.from({ length: level.visualData?.count || 1 }).map((_, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        animate={{ rotate: [0, 90, 180, 270, 360], y: [0, -20, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                        className="w-24 h-24 bg-white/10 border-4 border-white/20 rounded-3xl flex items-center justify-center text-5xl shadow-2xl"
                                                    >
                                                        🎲
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {level.visualType === 'COINS' && (
                                            <div className="flex gap-12">
                                                {Array.from({ length: level.visualData?.count || 1 }).map((_, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        animate={{ rotateY: [0, 180, 360] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                        className="w-24 h-24 bg-yellow-500/20 border-4 border-yellow-500 rounded-full flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(234,179,8,0.3)]"
                                                    >
                                                        🪙
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {level.visualType === 'CARDS' && (
                                            <div className="flex gap-4 relative pl-8 min-h-[220px]">
                                                <CardShuffleDeck />
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center max-w-3xl mt-8">
                                        <div className="flex items-center justify-center">
                                            <h3 className="text-2xl font-black text-white leading-tight mb-8 tracking-tight">{level.question}</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-6 pt-6">
                                    {level.options.map((opt, i) => (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                                            whileHover={{ y: -4, scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleCheck(opt)}
                                            className={cn(
                                                "px-10 py-6 rounded-3xl border-2 transition-all font-mono text-2xl font-black min-w-[140px]",
                                                selected === opt
                                                    ? (opt === level.correctAnswer ? "border-green-500 bg-green-500/20 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]" : "border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]")
                                                    : "border-white/10 bg-white/5 text-white/80 hover:border-primary/50 hover:text-primary shadow-lg"
                                            )}
                                        >
                                            {opt}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {feedback === "SUCCESS" && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="flex flex-col items-center gap-6 mt-8"
                    >
                        <div className="flex flex-col items-center">
                            <div className="bg-primary/20 p-4 rounded-full mb-4">
                                <Zap className="w-12 h-12 text-primary" />
                            </div>
                            <p className="text-primary font-mono text-sm tracking-[0.4em] uppercase font-bold animate-pulse">Assessment Complete ✅</p>
                        </div>
                        <Button onClick={nextLevel} size="lg" className="rounded-full px-16 py-8 text-xl font-black bg-primary hover:bg-primary/90 shadow-[0_20px_60px_rgba(var(--primary),0.3)] group">
                            NEXT QUESTION <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-3 transition-transform" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}