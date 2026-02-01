"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, ArrowRight, Zap, Shield, Flame, Clock, Calendar, Timer, Info, XCircle, Sun, Moon, Activity } from "lucide-react";

type Difficulty = "EASY" | "MEDIUM" | "HARD" | null;

interface Level {
    id: number;
    type: 'CLOCK' | 'CALENDAR';
    title: string;
    question: string;
    visualData?: any;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

const GENERATE_LEVELS = (diff: Difficulty): Level[] => {
    if (!diff) return [];
    
    return Array.from({ length: 15 }, (_, i) => {
        const id = i + 1;
        const seed = i;
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        if (i % 2 === 0) {
            // CLOCK DYNAMICS
            const type = seed % 3; // 0: Angle, 1: Mirror, 2: Overlap/Opposite
            
            if (type === 0) {
                const hour = (seed + 2) % 12 || 12;
                const min = (seed * 7) % 60;
                const angle = Math.abs(30 * hour - 5.5 * min);
                const normalizedAngle = angle > 180 ? 360 - angle : angle;
                return {
                    id, type: 'CLOCK' as const, title: `Angle Analysis ${id}`,
                    question: `Time is exactly ${hour}:${min.toString().padStart(2, '0')}. Calculate the reflex angle between the hands.`,
                    options: [`${360 - normalizedAngle}°`, `${normalizedAngle}°`, `${normalizedAngle + 5}°`, `90°`],
                    correctAnswer: `${360 - normalizedAngle}°`,
                    explanation: `Reflex angle is the larger angle. Interior angle = |30H - 5.5M| = ${normalizedAngle}°. Reflex = 360 - ${normalizedAngle} = ${360 - normalizedAngle}°.`
                };
            } else if (type === 1) {
                const hour = (seed + 1) % 12 || 12;
                const min = (seed * 4) % 60;
                // Mirror image of H:M is 11:60 - H:M
                let mirrorH = 11 - hour;
                let mirrorM = 60 - min;
                if (mirrorM === 60) { mirrorM = 0; mirrorH += 1; }
                if (mirrorH <= 0) mirrorH += 12;
                const mirrorTime = `${mirrorH}:${mirrorM.toString().padStart(2, '0')}`;
                return {
                    id, type: 'CLOCK' as const, title: `Mirror Protocol ${id}`,
                    question: `A clock shows ${hour}:${min.toString().padStart(2, '0')}. What time is seen in a neural reflecting surface?`,
                    options: [mirrorTime, `${hour}:${min}`, `${12-hour}:${min}`, `00:00`],
                    correctAnswer: mirrorTime,
                    explanation: `Neural reflection (mirror) is calculated as (11:60 - Real Time). 11:60 - ${hour}:${min} = ${mirrorTime}.`
                };
            } else {
                const hour = (seed % 5) + 3;
                const minSpace = hour >= 6 ? (hour - 6) * 5 : (hour + 6) * 5;
                const resultMin = Math.round(minSpace * 12 / 11);
                const correctTime = `${hour}:${resultMin.toString().padStart(2, '0')} past ${hour}`;
                return {
                    id, title: `Alignment Seek ${id}`, type: 'CLOCK' as const,
                    question: `Between ${hour} and ${hour + 1} o'clock, at what time will the hands be in a straight line but opposite?`,
                    options: [correctTime, `${hour}:00 past ${hour}`, `${hour}:30 past ${hour}`, `${hour}:45 past ${hour}`].sort(() => Math.random() - 0.5),
                    correctAnswer: correctTime,
                    explanation: `For hands to be opposite, there must be a 30-minute space. Using the formula (min space * 12/11), we get approximately ${resultMin} minutes.`
                };
            }
        } else {
            // CALENDAR SHIFTS
            const calendarType = seed % 3;
            if (calendarType === 0) {
                const baseDayIdx = (seed) % 7;
                const skipDays = diff === "EASY" ? 15 + seed : diff === "MEDIUM" ? 100 + seed : 500 + seed;
                const targetDayIdx = (baseDayIdx + skipDays) % 7;
                return {
                    id, type: 'CALENDAR' as const, title: `Cycle Shift ${id}`,
                    question: `Today: ${days[baseDayIdx]}. Neural prediction for ${skipDays} rotations from now?`,
                    options: [days[targetDayIdx], days[(targetDayIdx+1)%7], days[(targetDayIdx+2)%7], "None"],
                    correctAnswer: days[targetDayIdx],
                    explanation: `${skipDays} / 7 has ${skipDays % 7} odd days. ${days[baseDayIdx]} + ${skipDays % 7} = ${days[targetDayIdx]}.`
                };
            } else if (calendarType === 1) {
                const startYear = 1900 + (seed * 10);
                const endYear = startYear + (diff === "HARD" ? 100 : 20);
                const leapYears = Array.from({ length: endYear - startYear + 1 }, (_, k) => startYear + k)
                                     .filter(y => (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)).length;
                return {
                    id, type: 'CALENDAR' as const, title: `Leap Analysis ${id}`,
                    question: `How many leap year cycles occur between ${startYear} and ${endYear} inclusive?`,
                    options: [leapYears.toString(), (leapYears+1).toString(), (leapYears-1).toString(), "0"],
                    correctAnswer: leapYears.toString(),
                    explanation: `A year is a leap year if divisible by 4 (and not 100, unless 400). Count from ${startYear} to ${endYear} = ${leapYears}.`
                };
            } else {
                const testYear = 2000 + (seed * 4);
                const isLeap = (testYear % 4 === 0 && testYear % 100 !== 0) || (testYear % 400 === 0);
                return {
                    id, type: 'CALENDAR' as const, title: `Century Node ${id}`,
                    question: `Analyze Year ${testYear}. Is this a high-leap synchronization cycle?`,
                    options: ["Leap Year", "Ordinary Year", "Quantum Year", "None"],
                    correctAnswer: isLeap ? "Leap Year" : "Ordinary Year",
                    explanation: `Year ${testYear} ${isLeap ? "is" : "is not"} divisible by 4/400 logic.`
                };
            }
        }
    });
};

export default function ClockCalendarSimulator({ onComplete }: { onComplete: (score: number) => void }) {
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
                    <Activity className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">TEMPORAL ANALYSIS</h1>
                    <p className="text-primary/60 font-mono tracking-widest uppercase">Master time calculations and calendar logic.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {["EASY", "MEDIUM", "HARD"].map((d, i) => (
                        <motion.button
                            key={d}
                            whileHover={{ y: -10 }}
                            onClick={() => setDifficulty(d as Difficulty)}
                            className="p-10 rounded-[40px] border-2 border-white/5 bg-white/5 hover:border-primary/50 transition-all font-black text-2xl text-white"
                        >
                            {d === "EASY" ? <Clock className="w-12 h-12 mx-auto mb-6 text-primary" /> : 
                             d === "MEDIUM" ? <Calendar className="w-12 h-12 mx-auto mb-6 text-primary" /> :
                             <Timer className="w-12 h-12 mx-auto mb-6 text-primary" />}
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
                <h2 className="text-3xl font-bold text-white mb-2">TEMPORAL SYNC COMPLETE</h2>
                <p className="text-muted-foreground mb-6">Time mastery pathways fully established.</p>
                <div className="text-sm font-mono text-primary animate-pulse">INITIATING NEXT PHASE...</div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
            <div className="flex justify-between items-start px-4 mb-4">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl border-2 border-primary/30 bg-primary/10 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                        <Activity className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-3">
                            <span className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.3em]">Protocol:</span>
                            <span className="text-xl font-black text-white uppercase tracking-[0.2em]">{difficulty}</span>
                        </div>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">Active Neural Link</p>
                        
                        <div className="flex gap-2 pt-4">
                            {levels.map((_, i) => (
                                <motion.div 
                                    key={i}
                                    initial={false}
                                    animate={{ 
                                        backgroundColor: i <= currentIdx ? "rgba(34, 197, 94, 1)" : "rgba(255, 255, 255, 0.1)",
                                        width: i === currentIdx ? 48 : 24
                                    }}
                                    className={cn(
                                        "h-2 rounded-full transition-all duration-500",
                                        i === currentIdx && "shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black/20 border-2 border-white/10 rounded-[30px] p-3 min-h-45 flex flex-col items-center justify-center relative backdrop-blur-sm">
                {feedback === "ERROR" ? (
                    <div className="flex flex-col items-center text-center p-10">
                        <h2 className="text-4xl font-black text-red-500 mb-6 uppercase tracking-tighter">Temporal Desync ❌</h2>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 w-full">
                            <p className="text-xl text-white font-medium italic">🧐 {level.explanation}</p>
                        </div>
                        <Button onClick={nextLevel} className="rounded-full px-12">Next Sequence</Button>
                    </div>
                ) : (
                    <div className="w-full text-center space-y-6">
                        <div className="inline-flex items-center gap-4 px-6 py-2 bg-primary/20 rounded-full border border-primary/40 text-primary font-mono text-xs uppercase tracking-widest">
                            {level.type === 'CLOCK' ? <Clock className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                            {level.type} PROTOCOL active
                        </div>

                        {/* Animated Visual Area */}
                        <div className="flex justify-center py-4">
                            {level.type === 'CLOCK' ? (
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="relative w-72 h-72 rounded-full border-8 border-white/20 bg-gradient-to-br from-black/60 to-black/40 shadow-[0_0_60px_rgba(var(--primary),0.3)]"
                                >
                                    {/* Clock Face Markings */}
                                    {[...Array(12)].map((_, i) => (
                                        <div key={i} className="absolute inset-0 flex justify-center py-3" style={{ transform: `rotate(${i * 30}deg)` }}>
                                            <motion.div 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className={cn("rounded-full", i % 3 === 0 ? "w-2 h-4 bg-primary/60" : "w-1 h-3 bg-white/30")} 
                                            />
                                        </div>
                                    ))}
                                    
                                    {/* Hour Hand */}
                                    <motion.div 
                                        initial={{ rotate: -180 }}
                                        animate={{ rotate: (parseInt(level.question.match(/\d+/g)?.[0] || "0") % 12) * 30 + (parseInt(level.question.match(/\d+/g)?.[1] || "0") * 0.5) }}
                                        transition={{ duration: 2, type: "spring", stiffness: 50, damping: 10 }}
                                        className="absolute top-1/2 left-1/2 w-2 h-20 bg-gradient-to-t from-white to-white/60 rounded-full origin-bottom -translate-x-1/2 -translate-y-full shadow-lg"
                                    />
                                    
                                    {/* Minute Hand */}
                                    <motion.div 
                                        initial={{ rotate: -180 }}
                                        animate={{ rotate: parseInt(level.question.match(/\d+/g)?.[1] || "0") * 6 }}
                                        transition={{ duration: 2.5, type: "spring", stiffness: 40, damping: 8 }}
                                        className="absolute top-1/2 left-1/2 w-1.5 h-28 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.6)] rounded-full origin-bottom -translate-x-1/2 -translate-y-full"
                                    />
                                    
                                    {/* Center Node with pulse */}
                                    <motion.div 
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute top-1/2 left-1/2 w-5 h-5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 border-3 border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                    />
                                </motion.div>
                            ) : (
                                <motion.div 
                                    initial={{ y: 30, opacity: 0, rotateX: 20 }}
                                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="relative w-80 h-80 bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden shadow-2xl"
                                    style={{ perspective: "1000px" }}
                                >
                                    {/* Calendar Header */}
                                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-between px-6 shadow-lg">
                                        <motion.div 
                                            animate={{ rotate: [0, 10, 0] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="w-4 h-8 bg-black/20 rounded-full" 
                                        />
                                        <Calendar className="w-8 h-8 text-white/80" />
                                        <motion.div 
                                            animate={{ rotate: [0, -10, 0] }}
                                            transition={{ duration: 3, delay: 0.5, repeat: Infinity }}
                                            className="w-4 h-8 bg-black/20 rounded-full" 
                                        />
                                    </div>
                                    
                                    {/* Calendar Grid */}
                                    <div className="absolute top-24 left-0 right-0 bottom-0 p-4">
                                        <div className="grid grid-cols-7 gap-1 mb-2">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                                <div key={i} className="text-xs font-bold text-gray-400 text-center">{day}</div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-1">
                                            {[...Array(35)].map((_, i) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: i * 0.02 }}
                                                    className={cn(
                                                        "aspect-square flex items-center justify-center rounded-lg text-xs font-semibold",
                                                        i === 15 ? "bg-red-500 text-white shadow-lg" : "bg-gray-100 text-gray-700"
                                                    )}
                                                >
                                                    {i + 1}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Animated Indicator */}
                                    <motion.div 
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500 text-white text-xs font-mono rounded-full shadow-lg"
                                    >
                                        {level.question.match(/[A-Z][a-z]+/)?.[0] || "DAY"}
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>

                        <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold text-white max-w-2xl mx-auto leading-tight px-4"
                        >
                            {level.question}
                        </motion.h3>
                        <div className="grid grid-cols-2 gap-4 pt-6 px-4">
                            {level.options.map((opt, i) => (
                                <motion.button
                                    key={i} 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCheck(opt)}
                                    className={cn(
                                        "p-8 rounded-3xl border-2 transition-all font-mono text-xl font-bold shadow-lg", 
                                        selected === opt 
                                            ? (opt === level.correctAnswer ? "border-green-500 bg-green-500/20 text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.4)]" : "border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]")
                                            : "border-white/10 bg-white/5 text-white/80 hover:border-primary/50 hover:bg-primary/5"
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
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        className="flex flex-col items-center gap-6"
                    >
                        <p className="text-primary font-mono text-sm tracking-[0.4em] uppercase font-bold animate-pulse">Chrono Sync Active ✅</p>
                        <Button 
                            onClick={nextLevel} 
                            size="xl" 
                            className="bg-primary hover:bg-primary/90 text-white px-20 py-8 rounded-[25px] text-xl font-black shadow-[0_20px_50px_rgba(var(--primary),0.3)] group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-4">
                                NEXT QUESTION 🚀 <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                            </span>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
