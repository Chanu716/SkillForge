"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Zap, Trophy, ArrowRight, RotateCcw, Box, Circle, Triangle } from "lucide-react";

interface PatternLevel {
    id: number;
    type: string;
    description: string;
    reward: string;
}

export default function PatternRecognition({ onComplete }: { onComplete: (score: number) => void }) {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [isFinished, setIsFinished] = useState(false);
    const [feedback, setFeedback] = useState<"SUCCESS" | "ERROR" | null>(null);

    // LEVEL 1 STATE: Color Echo
    const [l1SelectedColor, setL1SelectedColor] = useState<string | null>(null);
    const l1CorrectColor = "bg-blue-500";

    // LEVEL 2 STATE: Size Scaling
    const [l2Size, setL2Size] = useState(20);
    const l2TargetSize = 80; // 2x the previous step (10, 20, 40, target: 80)

    // LEVEL 3 STATE: Symmetry Swap
    const [l3Rotation, setL3Rotation] = useState(0);
    const l3TargetRotation = 180;

    const handleLevelComplete = () => {
        setFeedback("SUCCESS");
        setTimeout(() => {
            if (currentLevel < 3) {
                setCurrentLevel(prev => prev + 1);
                setFeedback(null);
            } else {
                setIsFinished(true);
                onComplete(100);
            }
        }, 1500);
    };

    const resetLevel = () => {
        setFeedback(null);
        if (currentLevel === 1) setL1SelectedColor(null);
        if (currentLevel === 2) setL2Size(20);
        if (currentLevel === 3) setL3Rotation(0);
    };

    const renderLevel1 = () => (
        <div className="space-y-12 py-8">
            <div className="flex justify-center items-end gap-6 h-32">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="w-16 h-16 bg-red-500 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3.5 }} className="w-16 h-16 bg-blue-500 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0.5 }} className="w-16 h-16 bg-red-500 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                <div className="relative">
                    <motion.div 
                        initial={false}
                        animate={{ 
                            backgroundColor: l1SelectedColor ? (l1SelectedColor === "bg-blue-500" ? "#3b82f6" : "#ef4444") : "transparent",
                            borderColor: l1SelectedColor ? "transparent" : "rgba(255,255,255,0.1)"
                        }}
                        className="w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center transition-all duration-500 overflow-hidden"
                    >
                        {!l1SelectedColor && <div className="text-[10px] font-mono opacity-20 uppercase tracking-tighter">SOCKET</div>}
                        {l1SelectedColor && <motion.div layoutId="l1-core" className={cn("w-full h-full", l1SelectedColor)} />}
                    </motion.div>
                    {feedback === "SUCCESS" && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5, opacity: 0 }} className="absolute inset-0 bg-blue-400 rounded-full blur-xl" />}
                </div>
            </div>

            <div className="bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                <p className="text-center text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">Available Cores</p>
                <div className="flex justify-center gap-8">
                    {["bg-red-500", "bg-blue-500", "bg-green-500"].map((color) => (
                        <motion.button
                            key={color}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                setL1SelectedColor(color);
                                if (color === l1CorrectColor) handleLevelComplete();
                                else setFeedback("ERROR");
                            }}
                            className={cn("w-12 h-12 rounded-lg shadow-lg relative cursor-pointer", color)}
                        >
                            {l1SelectedColor === color && <motion.div layoutId="l1-core" className="absolute inset-0 bg-white/20" />}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderLevel2 = () => (
        <div className="space-y-12 py-8">
            <div className="flex justify-center items-center gap-12 h-48">
                {[10, 20, 40].map((s, i) => (
                    <motion.div 
                        key={i}
                        animate={{ boxShadow: ["0 0 10px rgba(168,85,247,0.2)", "0 0 30px rgba(168,85,247,0.4)", "0 0 10px rgba(168,85,247,0.2)"] }}
                        transition={{ repeat: Infinity, duration: 4, delay: i * 0.5 }}
                        style={{ width: s, height: s }}
                        className="bg-purple-500 rounded-full border border-purple-400/50" 
                    />
                ))}
                <div className="relative flex items-center justify-center w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/10" />
                    <motion.div 
                        animate={{ 
                            width: l2Size, 
                            height: l2Size,
                            backgroundColor: feedback === "SUCCESS" ? "#a855f7" : "rgba(168,85,247,0.3)"
                        }}
                        className="rounded-full border border-purple-400/50"
                    />
                </div>
            </div>

            <div className="max-w-xs mx-auto space-y-4">
                <input 
                    type="range" 
                    min="10" 
                    max="120" 
                    value={l2Size}
                    onChange={(e) => setL2Size(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">Calibration: {l2Size} Units</span>
                    <Button 
                        size="sm" 
                        variant="cyber" 
                        onClick={() => {
                            if (Math.abs(l2Size - l2TargetSize) < 5) handleLevelComplete();
                            else setFeedback("ERROR");
                        }}
                    >
                        Sync
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderLevel3 = () => (
        <div className="space-y-12 py-8">
            <div className="flex justify-center items-center gap-16 h-48 relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
                
                {/* Left Side (Source) */}
                <div className="flex flex-col gap-4">
                    <Triangle className="w-16 h-16 text-primary fill-primary/20 rotate-90" />
                    <Box className="w-16 h-16 text-primary fill-primary/20" />
                </div>

                {/* Right Side (Target - Must be Mirrored) */}
                <div className="flex flex-col gap-4">
                    <motion.div
                        animate={{ rotate: l3Rotation }}
                        onClick={() => setL3Rotation(prev => (prev + 90) % 360)}
                        className="cursor-pointer group"
                    >
                        <Triangle className="w-16 h-16 text-primary fill-primary/20 rotate-[-90deg] group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] transition-all" />
                    </motion.div>
                    <Box className="w-16 h-16 text-primary fill-primary/20" />
                </div>
            </div>

            <div className="text-center">
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-4">Click shape to toggle spatial orientation</p>
                <Button 
                    variant="cyber"
                    onClick={() => {
                        if (l3Rotation === l3TargetRotation) handleLevelComplete();
                        else setFeedback("ERROR");
                    }}
                >
                    Confirm Symmetry
                </Button>
            </div>
        </div>
    );

    if (isFinished) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-12 bg-black/40 rounded-xl border border-primary/20 backdrop-blur-md"
            >
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">NEURAL SYNC COMPLETE</h2>
                <p className="text-muted-foreground mb-6">Pattern recognition pathways fully established.</p>
                <div className="text-sm font-mono text-primary animate-pulse">INITIATING NEXT PHASE...</div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-2 bg-black/40 rounded-xl border border-white/10 backdrop-blur-md relative overflow-hidden">
            {/* HUD Header */}
            <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-4">
                <div>
                    <h2 className="text-xs font-mono text-primary uppercase tracking-[0.3em]">Protocol: Pattern_Recognition</h2>
                    <div className="flex gap-1 mt-2">
                        {[1, 2, 3].map((lvl) => (
                            <div 
                                key={lvl} 
                                className={cn(
                                    "h-1 w-12 rounded-full transition-all duration-500",
                                    lvl < currentLevel ? "bg-primary" : lvl === currentLevel ? "bg-primary w-20 animate-pulse" : "bg-white/10"
                                )} 
                            />
                        ))}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-50">Signal Accuracy</span>
                    <div className="text-lg font-bold text-white">{(currentLevel - 1) * 33 + (feedback === "SUCCESS" ? 34 : 0)}%</div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentLevel}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="min-h-[180px] flex flex-col items-center justify-center"
                >
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white uppercase tracking-tighter mb-2">
                            {currentLevel === 1 && "Level 01: Chromatic Echo"}
                            {currentLevel === 2 && "Level 02: Scalar Modulation"}
                            {currentLevel === 3 && "Level 03: Symmetrical Flux"}
                        </h3>
                        <p className="text-muted-foreground text-sm font-mono opacity-60">
                            {currentLevel === 1 && "Identify the frequency recurrence."}
                            {currentLevel === 2 && "Calibrate output to match growth vector."}
                            {currentLevel === 3 && "Restore equilibrium through axial reflection."}
                        </p>
                    </div>

                    <div className="w-full">
                        {currentLevel === 1 && renderLevel1()}
                        {currentLevel === 2 && renderLevel2()}
                        {currentLevel === 3 && renderLevel3()}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* ERROR FEEDBACK Overlay */}
            <AnimatePresence>
                {feedback === "ERROR" && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-red-500/10 flex flex-col items-center justify-center backdrop-blur-[2px] z-50 pointer-events-none"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-red-500 text-white px-4 py-2 rounded text-xs font-mono uppercase tracking-widest shadow-2xl"
                        >
                            Pattern Mismatch Detected
                        </motion.div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={resetLevel} 
                            className="mt-4 pointer-events-auto bg-black/40 text-red-500 hover:text-red-400"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" /> Recalibrate
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SUCCESS Feedback */}
            <AnimatePresence>
                {feedback === "SUCCESS" && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-primary/5 flex items-center justify-center pointer-events-none z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.5, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="bg-primary/20 p-4 rounded-full mb-4">
                                <Zap className="w-12 h-12 text-primary" />
                            </div>
                            <div className="text-primary font-mono text-xl uppercase tracking-[0.5em] animate-pulse">Synced</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}