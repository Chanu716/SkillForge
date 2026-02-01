import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, ArrowRight, Brain, Sparkles, Hash, Zap, Shield, Flame, Activity, Info, XCircle, Users, MessageSquare, Key, Puzzle, Play, RotateCcw, ChevronRight } from "lucide-react";
import SeatingVisualizer, { SeatingStep } from "./visualizers/SeatingVisualizer";
import CodingVisualizer, { CodingStep } from "./visualizers/CodingVisualizer";
import SyllogismVisualizer, { SyllogismStep } from "./visualizers/SyllogismVisualizer";
import PuzzleVisualizer, { PuzzleStep } from "./visualizers/PuzzleVisualizer";

type LevelType = "GRID_SEQUENCE" | "TRIANGLE_MATH" | "SQUARE_LOGIC" | "CROSS_LOGIC" | "LINE_SEQUENCE" | "NUMBER_GRID" |
    "SEATING_ARRANGEMENT" | "CODING_DECODING" | "SYLLOGISM" | "LOGIC_PUZZLE";
type Difficulty = "EASY" | "MEDIUM" | "HARD" | null;

export type AptitudeCategory = 'SEATING' | 'CODING' | 'SYLLOGISM' | 'PUZZLE' | undefined;

interface Level {
    id: number;
    type: LevelType;
    title: string;
    // Visual Props
    gridSteps?: number[];
    nodes?: number[];
    centerValue?: number;
    sequence?: number[];
    gridData?: number[][];
    // Text/Logic Props
    scenario?: string;
    question?: string;

    // VISUALIZER DATA
    seatingData?: { type: "LINEAR" | "CIRCULAR"; total: number; steps: SeatingStep[] };
    codingData?: { source: string; target: string; steps: CodingStep[] };
    syllogismData?: { steps: SyllogismStep[] };
    puzzleData?: { rows: string[]; cols: string[]; steps: PuzzleStep[] };

    options: (number | string)[];
    correctAnswer: number | string;
    explanation: string;
}

const GENERATE_LEVELS = (diff: Difficulty, category?: AptitudeCategory): Level[] => {
    if (!diff) return [];

    return Array.from({ length: 15 }, (_, i) => {
        const id = i + 1;

        // Determine the effective type for this level
        // If specific category is set, use it. Otherwise, cycle through the 4 new types.
        let effectiveCategory: AptitudeCategory = category;
        if (!effectiveCategory) {
            const types: AptitudeCategory[] = ['SEATING', 'CODING', 'SYLLOGISM', 'PUZZLE'];
            effectiveCategory = types[i % types.length];
        }

        // --- SEATING ARRANGEMENT ---
        if (effectiveCategory === 'SEATING') {
            const variant = id % 4;
            if (variant === 0 || variant === 2) {
                // LINEAR SCENARIOS
                const isSix = variant === 2;
                return {
                    id, type: "SEATING_ARRANGEMENT", title: `Linear Arrangement ${id}`,
                    scenario: isSix
                        ? "Six people P, Q, R, S, T, U are sitting in a row facing North."
                        : "Five friends A, B, C, D, E are in a row facing North.",
                    question: isSix ? "Who is sitting at the right end?" : "Who is in the middle?",
                    seatingData: {
                        type: "LINEAR",
                        total: isSix ? 6 : 5,
                        steps: isSix
                            ? [
                                { text: "P is 4th to the left of U.", placements: [{ id: "U", pos: 5, label: "U" }, { id: "P", pos: 1, label: "P" }] },
                                { text: "Q is not at the ends.", placements: [], highlight: ["Q"] },
                                { text: "R is adjacent to S and T.", placements: [{ id: "R", pos: 3, label: "R" }, { id: "S", pos: 2, label: "S" }, { id: "T", pos: 4, label: "T" }] },
                                { text: "Q fits in the remaining spot.", placements: [{ id: "Q", pos: 0, label: "Q" }] } // Logic simplified for visual demo
                            ]
                            : [
                                { text: "B is on the extreme left.", placements: [{ id: "B", pos: 0, label: "B", facing: "NORTH" }] },
                                { text: "D is not sitting with E.", placements: [], highlight: ["D"] },
                                { text: "C is sitting next to A and E.", placements: [{ id: "C", pos: 3, label: "C" }, { id: "A", pos: 2, label: "A" }, { id: "E", pos: 4, label: "E" }] },
                                { text: "D takes the spot between B and A.", placements: [{ id: "D", pos: 1, label: "D" }] }
                            ]
                    },
                    options: isSix ? ["U", "T", "S", "P"] : ["A", "B", "C", "D"],
                    correctAnswer: isSix ? "U" : "A",
                    explanation: isSix ? "U is at the far right." : "A is in the middle."
                };
            } else {
                // CIRCULAR SCENARIOS
                return {
                    id, type: "SEATING_ARRANGEMENT", title: `Circular Arrangement ${id}`,
                    scenario: "Friends sitting around a circular table facing center.",
                    question: "Who is immediately left of R?",
                    seatingData: {
                        type: "CIRCULAR",
                        total: 4,
                        steps: [
                            { text: "P is facing R.", placements: [{ id: "P", pos: 0, label: "P" }, { id: "R", pos: 2, label: "R" }] },
                            { text: "Q is to the right of P.", placements: [{ id: "Q", pos: 1, label: "Q", facing: "IN" }] },
                            { text: "S sits in the remaining chair.", placements: [{ id: "S", pos: 3, label: "S" }] }
                        ]
                    },
                    options: ["Q", "S", "P", "None"],
                    correctAnswer: "Q",
                    explanation: "Left of R (at bottom) is Q (at right)."
                };
            }
        }

        // --- CODING DECODING ---
        if (effectiveCategory === 'CODING') {
            const scenarios = [
                { word: "GAME", target: "HBNF", shift: 1, explanation: "+1 Shift" },
                { word: "MIND", target: "OLPF", shift: 2, explanation: "+2 Shift" },
                { word: "CODE", target: "ERFG", shift: 2, explanation: "+2 Shift" },
                { word: "ZERO", target: "AFSP", shift: 1, explanation: "+1 Shift" }
            ];
            const sc = scenarios[i % scenarios.length];

            // Build steps dynamically
            const steps = [
                { text: "Analyze the first letter pattern...", shiftAmount: 0 },
                ...sc.word.split('').map((char, idx) => ({
                    text: `${char} shifted by +${sc.shift} becomes ${sc.target[idx]}`,
                    focusIndices: [idx],
                    shiftAmount: sc.shift
                }))
            ];

            return {
                id, type: "CODING_DECODING", title: `Cipher Challenge ${id}`,
                scenario: `Crack the pattern: ${sc.word} -> ${sc.target}`,
                question: `What is the rule?`,
                codingData: {
                    source: sc.word,
                    target: sc.target,
                    steps: steps
                },
                options: ["+1 Shift", "+2 Shift", "Reverse", "Swap"],
                correctAnswer: sc.explanation,
                explanation: `Each letter moves forward by ${sc.shift}.`
            };
        }

        // --- SYLLOGISMS ---
        if (effectiveCategory === 'SYLLOGISM') {
            const variant = id % 3;
            if (variant === 0) {
                return {
                    id, type: "SYLLOGISM", title: `Syllogism ${id}`,
                    question: "Conclusion?",
                    syllogismData: {
                        steps: [
                            { text: "All A are B.", circles: [{ id: "B", label: "B", x: 250, y: 175, r: 100, color: "#3b82f6" }, { id: "A", label: "A", x: 250, y: 175, r: 50, color: "#ef4444" }] },
                            { text: "All B are C.", circles: [{ id: "C", label: "C", x: 250, y: 175, r: 140, color: "#22c55e" }, { id: "B", label: "B", x: 250, y: 175, r: 100, color: "#3b82f6" }, { id: "A", label: "A", x: 250, y: 175, r: 50, color: "#ef4444" }], highlightRelation: { from: "A", to: "C", type: "ALL" } }
                        ]
                    },
                    options: ["All A are C", "Some A are not C", "No A is C", "None"],
                    correctAnswer: "All A are C",
                    explanation: "A is inside B, B is inside C, so A is inside C."
                };
            } else {
                return {
                    id, type: "SYLLOGISM", title: `Syllogism ${id}`,
                    question: "Conclusion?",
                    syllogismData: {
                        steps: [
                            { text: "Some Pens are Ink.", circles: [{ id: "P", label: "Pens", x: 200, y: 175, r: 80, color: "#ef4444" }, { id: "I", label: "Ink", x: 300, y: 175, r: 80, color: "#3b82f6" }], highlightRelation: { from: "Pens", to: "Ink", type: "SOME" } },
                            { text: "No Ink is Red.", circles: [{ id: "P", label: "Pens", x: 200, y: 175, r: 80, color: "#ef4444" }, { id: "I", label: "Ink", x: 300, y: 175, r: 80, color: "#3b82f6" }, { id: "R", label: "Red", x: 450, y: 175, r: 60, color: "#22c55e" }], highlightRelation: { from: "Ink", to: "Red", type: "NO" } }
                        ]
                    },
                    options: ["Some Pens are not Red", "All Pens are Red", "All Red are Pens", "None"],
                    correctAnswer: "Some Pens are not Red",
                    explanation: "Pens overlapping Ink cannot be Red."
                };
            }
        }

        // --- PUZZLES ---
        if (effectiveCategory === 'PUZZLE') {
            const variant = id % 2;
            return {
                id, type: "LOGIC_PUZZLE", title: `Logic Matrix ${id}`,
                question: variant === 0 ? "Who is Tallest?" : "Who is Fastest?",
                puzzleData: {
                    rows: ["A", "B", "C"],
                    cols: variant === 0 ? ["Tall", "Med", "Short"] : ["Fast", "Avg", "Slow"],
                    steps: [
                        { text: "A is not the extreme.", updates: [{ row: 0, col: 0, status: "NO" }, { row: 0, col: 2, status: "NO" }] },
                        { text: variant === 0 ? "B is taller than A." : "B is faster than A.", updates: [{ row: 1, col: 0, status: "YES" }] },
                        { text: "C fills the rest.", updates: [{ row: 2, col: 2, status: "YES" }] }
                    ]
                },
                options: ["A", "B", "C", "Indeterminable"],
                correctAnswer: "B",
                explanation: variant === 0 ? "B is Tallest." : "B is Fastest."
            };
        }

        // --- FALLBACK (Should rarely hit if cycled correctly, but good safety) ---
        return {
            id, type: "CODING_DECODING", title: `Bonus Pattern ${id}`,
            question: "Find the missing number",
            codingData: { source: "123", target: "234", steps: [{ text: "+1 to all", shiftAmount: 1 }] },
            options: ["234", "345", "456", "567"],
            correctAnswer: "234",
            explanation: "Basic pattern."
        };
    });
};

export default function AptitudeBridge({ onComplete, category }: { onComplete: (score: number) => void, category?: AptitudeCategory }) {
    const [difficulty, setDifficulty] = useState<Difficulty>(null);
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
    const [feedback, setFeedback] = useState<"SUCCESS" | "ERROR" | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    // VISUALIZER STATE
    const [visualStep, setVisualStep] = useState(0);

    const levels = useMemo(() => GENERATE_LEVELS(difficulty, category), [difficulty, category]);
    const level = levels[currentLevelIdx];

    // Reset visual step when level changes
    useEffect(() => {
        setVisualStep(0);
    }, [currentLevelIdx]);

    const handleCheck = (val: number | string) => {
        if (feedback) return;
        setSelectedOption(val);
        if (val === level.correctAnswer) setFeedback("SUCCESS");
        else setFeedback("ERROR");
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

    // VISUALIZER HELPERS
    const getMaxSteps = () => {
        if (!level) return 0;
        if (level.seatingData) return level.seatingData.steps.length;
        if (level.codingData) return level.codingData.steps.length;
        if (level.syllogismData) return level.syllogismData.steps.length;
        if (level.puzzleData) return level.puzzleData.steps.length;
        return 0;
    };

    const maxVisualSteps = getMaxSteps();

    const handleStep = (delta: number) => {
        setVisualStep(prev => Math.max(0, Math.min(prev + delta, maxVisualSteps - 1)));
    };

    if (!difficulty) {
        return (
            <div className="w-full max-w-4xl mx-auto py-20 px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <Brain className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">APTITUDE BRIDGE</h1>
                    <p className="text-primary/60 font-mono tracking-widest uppercase">Select neural difficulty protocol for logical reasoning assessment.</p>
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

    if (isFinished) {
        return <div className="text-center text-white text-4xl font-bold mt-20">MODULE COMPLETE</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
            <div className="flex justify-between items-center text-sm font-mono text-white/50 uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                        {difficulty}
                    </span>
                    <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        LOGICAL REASONING PROTOCOL
                    </span>
                </div>
                <span>Level {currentLevelIdx + 1} / {levels.length}</span>
            </div>

            <motion.div
                key={currentLevelIdx + (feedback === "ERROR" ? "-err" : "")}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="bg-black/40 border-2 border-white/10 rounded-[40px] p-8 min-h-[600px] flex flex-col justify-between backdrop-blur-xl relative overflow-hidden shadow-2xl"
            >
                {/* Background Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary/5 blur-[120px] pointer-events-none" />

                {/* VISUALIZER CONTAINER */}
                <div className="flex-1 flex flex-col relative">
                    {/* Header Question */}
                    <div className="text-center mb-8 relative">
                        {/* Topic Indicator Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={level.type}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-primary/80 mb-4 tracking-[0.2em] uppercase"
                        >
                            {level.type === 'SEATING_ARRANGEMENT' && <Users className="w-3.5 h-3.5" />}
                            {level.type === 'CODING_DECODING' && <Key className="w-3.5 h-3.5" />}
                            {level.type === 'SYLLOGISM' && <MessageSquare className="w-3.5 h-3.5" />}
                            {level.type === 'LOGIC_PUZZLE' && <Puzzle className="w-3.5 h-3.5" />}
                            {level.type.replace('_', ' ')}
                        </motion.div>

                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{level.title}</h2>
                        {level.question && (
                            <motion.p
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-primary text-xl font-semibold bg-primary/10 inline-block px-6 py-2 rounded-2xl border border-primary/20"
                            >
                                {level.question}
                            </motion.p>
                        )}
                        {level.scenario && (
                            <p className="mt-4 text-white/40 text-sm max-w-2xl mx-auto italic font-medium">
                                " {level.scenario} "
                            </p>
                        )}
                    </div>

                    {/* ANIMATED AREA */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 rounded-[32px] bg-gradient-to-b from-white/5 to-transparent border border-white/10 relative overflow-hidden flex items-center justify-center p-8 shadow-inner"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${level.id}-${visualStep}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full h-full flex items-center justify-center"
                            >
                                {level.seatingData && <SeatingVisualizer key={`seat-${level.id}`} type={level.seatingData.type} totalSeats={level.seatingData.total} steps={level.seatingData.steps} currentStep={visualStep} />}
                                {level.codingData && <CodingVisualizer key={`code-${level.id}`} sourceWord={level.codingData.source} targetWord={level.codingData.target} steps={level.codingData.steps} currentStep={visualStep} />}
                                {level.syllogismData && <SyllogismVisualizer key={`syl-${level.id}`} steps={level.syllogismData.steps} currentStep={visualStep} />}
                                {level.puzzleData && <PuzzleVisualizer key={`puz-${level.id}`} rows={level.puzzleData.rows} cols={level.puzzleData.cols} steps={level.puzzleData.steps} currentStep={visualStep} />}
                            </motion.div>
                        </AnimatePresence>

                        {/* Fallback for old visuals */}
                        {!level.seatingData && !level.codingData && !level.syllogismData && !level.puzzleData && (
                            <div className="text-white/30 font-mono">Standard Visual Pattern</div>
                        )}
                    </motion.div>

                    {/* ANIMATION CONTROLS (Only for animated types) */}
                    {maxVisualSteps > 0 && (
                        <div className="mt-6 flex items-center justify-between px-8 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                            <Button
                                variant="ghost"
                                disabled={visualStep === 0}
                                onClick={() => handleStep(-1)}
                                className="text-white/50 hover:text-white hover:bg-white/5"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" /> BACK
                            </Button>

                            <div className="flex gap-2.5">
                                {Array.from({ length: maxVisualSteps }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: i === visualStep ? 1.2 : 1,
                                            backgroundColor: i <= visualStep ? "var(--primary)" : "rgba(255,255,255,0.1)"
                                        }}
                                        className="h-1.5 w-8 rounded-full transition-all"
                                    />
                                ))}
                            </div>

                            <Button
                                disabled={visualStep === maxVisualSteps - 1}
                                onClick={() => handleStep(1)}
                                className={cn(
                                    "rounded-full px-8 font-bold transition-all",
                                    visualStep === maxVisualSteps - 1
                                        ? "bg-white/5 text-white/20"
                                        : "bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                                )}
                            >
                                {visualStep === maxVisualSteps - 1 ? "ANALYSIS COMPLETE" : "NEXT STEP"} <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Options Area */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {level.options.map((opt, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.02, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCheck(opt)}
                            className={cn(
                                "p-6 rounded-2xl border-2 font-bold transition-all text-lg shadow-lg relative overflow-hidden group",
                                selectedOption === opt
                                    ? (feedback === "SUCCESS" ? "border-green-500 bg-green-500/20 text-green-400" : "border-primary bg-primary/20 text-white")
                                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10"
                            )}
                        >
                            <span className="relative z-10">{opt}</span>
                            {selectedOption === opt && feedback === "SUCCESS" && (
                                <motion.div layoutId="success-glow" className="absolute inset-0 bg-green-500/10 blur-xl" />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Feedback Overlays */}
                <AnimatePresence>
                    {feedback === "SUCCESS" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-12"
                        >
                            <motion.div
                                initial={{ scale: 0.5, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="relative mb-8"
                            >
                                <div className="absolute inset-0 bg-green-500/20 blur-[60px] rounded-full animate-pulse" />
                                <Trophy className="w-32 h-32 text-yellow-400 relative z-10" />
                                <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-primary animate-bounce" />
                            </motion.div>

                            <h3 className="text-5xl font-black text-white mb-4 tracking-tighter">NEURAL MATCH</h3>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 max-w-xl text-center mb-10">
                                <p className="text-white/80 text-lg leading-relaxed">{level.explanation}</p>
                            </div>

                            <Button
                                onClick={nextLevel}
                                size="lg"
                                className="rounded-full px-16 py-8 text-2xl font-black bg-primary text-black hover:bg-primary/90 shadow-[0_0_40px_rgba(var(--primary-rgb),0.5)] flex items-center gap-3"
                            >
                                PROCEED <ArrowRight className="w-6 h-6" />
                            </Button>
                        </motion.div>
                    )}

                    {feedback === "ERROR" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-12"
                        >
                            <motion.div
                                initial={{ x: -10 }}
                                animate={{ x: [10, -10, 10, -10, 0] }}
                                className="mb-8"
                            >
                                <XCircle className="w-32 h-32 text-red-500" />
                            </motion.div>

                            <h3 className="text-5xl font-black text-white mb-4 tracking-tighter">LOGIC BREACH</h3>
                            <p className="text-white/60 mb-10 max-w-md text-center text-lg">{level.explanation}</p>

                            <Button
                                onClick={() => setFeedback(null)}
                                size="lg"
                                className="rounded-full px-16 py-8 text-2xl font-black bg-red-500 text-white hover:bg-red-400 flex items-center gap-3"
                            >
                                <RotateCcw className="w-6 h-6" /> RECALIBRATE
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

