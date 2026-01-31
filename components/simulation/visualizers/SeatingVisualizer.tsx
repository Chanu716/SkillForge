import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { User, ArrowRight, Circle } from "lucide-react";

export interface SeatingStep {
    text: string;
    placements: { id: string; pos: number; label: string; facing?: "IN" | "OUT" | "NORTH" | "SOUTH" }[];
    highlight?: string[]; // IDs to highlight
}

interface SeatingVisualizerProps {
    type: "LINEAR" | "CIRCULAR";
    steps: SeatingStep[];
    currentStep: number;
    totalSeats: number;
}

export default function SeatingVisualizer({ type, steps, currentStep, totalSeats }: SeatingVisualizerProps) {
    // Accumulate placements up to the current step
    const activePlacements = steps.slice(0, currentStep + 1).flatMap(s => s.placements);

    // Deduplicate: take the latest placement for each ID
    const placementMap = new Map();
    activePlacements.forEach(p => placementMap.set(p.id, p));
    const uniquePlacements = Array.from(placementMap.values());

    const latestStep = steps[currentStep];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary font-mono text-sm text-center max-w-lg"
            >
                {latestStep.text}
            </motion.div>

            <div className="relative flex items-center justify-center w-[400px] h-[400px]">
                {/* TABLE / ROW BASE */}
                {type === "CIRCULAR" && (
                    <div className="absolute inset-0 rounded-full border-4 border-white/10 bg-white/5 shadow-[0_0_50px_rgba(255,255,255,0.05)] transform scale-75" />
                )}
                {type === "LINEAR" && (
                    <div className="absolute bottom-1/2 w-full h-2 bg-white/10 rounded-full" />
                )}

                {/* SEATS */}
                {Array.from({ length: totalSeats }).map((_, i) => {
                    const occupant = uniquePlacements.find(p => p.pos === i);
                    const isNew = latestStep.placements.some(p => p.id === occupant?.id && p.pos === i);
                    const isHighlighted = latestStep.highlight?.includes(occupant?.id || "");

                    // Positioning Logic
                    let x = 0, y = 0, rot = 0;
                    if (type === "CIRCULAR") {
                        const angle = (i * 360) / totalSeats - 90; // Start top
                        const radius = 140;
                        x = radius * Math.cos((angle * Math.PI) / 180);
                        y = radius * Math.sin((angle * Math.PI) / 180);
                        rot = angle + 90; // Face inward
                    } else {
                        // Linear spacing
                        const spacing = 350 / (totalSeats - 1);
                        x = -175 + i * spacing;
                        y = 0;
                    }

                    return (
                        <div
                            key={i}
                            className="absolute"
                            style={{
                                transform: `translate(${x}px, ${y}px)`
                            }}
                        >
                            {/* Empty Seat Marker */}
                            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/5" />

                            {/* Occupant */}
                            <AnimatePresence>
                                {occupant && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: isHighlighted ? 1.2 : 1,
                                            opacity: 1,
                                            boxShadow: isHighlighted ? "0 0 20px rgba(var(--primary), 0.6)" : "none"
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className={cn(
                                            "relative -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center border-2 z-10 bg-black",
                                            isNew ? "border-primary text-primary" : "border-white/20 text-white/50",
                                            isHighlighted && "border-yellow-400 text-yellow-400 bg-yellow-400/10"
                                        )}
                                    >
                                        <span className="text-2xl font-black">{occupant.label}</span>
                                        {/* Facing Arrow (Simplified) */}
                                        {occupant.facing && (
                                            <div className="absolute -bottom-6 text-[10px] font-mono opacity-50">{occupant.facing}</div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
