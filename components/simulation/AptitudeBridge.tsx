"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, RotateCcw } from "lucide-react";

interface Item {
    id: string;
    weight: number;
    label: string;
}

export default function AptitudeBridge({ onComplete }: { onComplete: (score: number) => void }) {
    const [targetWeight] = useState(15);
    const [currentWeight, setCurrentWeight] = useState(0);
    const [items] = useState<Item[]>([
        { id: "1", weight: 5, label: "Data Packet A" },
        { id: "2", weight: 7, label: "Data Packet B" },
        { id: "3", weight: 3, label: "Data Packet C" },
        { id: "4", weight: 2, label: "Data Packet D" },
        { id: "5", weight: 8, label: "Data Packet E" },
    ]);

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string | null>(null);

    const toggleItem = (id: string, weight: number) => {
        setFeedback(null);
        if (selectedItems.includes(id)) {
            setSelectedItems(prev => prev.filter(i => i !== id));
            setCurrentWeight(prev => prev - weight);
        } else {
            setSelectedItems(prev => [...prev, id]);
            setCurrentWeight(prev => prev + weight);
        }
    };

    const checkSolution = () => {
        if (currentWeight === targetWeight) {
            setFeedback("SUCCESS");
            onComplete(100);
        } else if (currentWeight > targetWeight) {
            setFeedback("OVERLOAD");
        } else {
            setFeedback("UNDERLOAD");
        }
    };

    const reset = () => {
        setSelectedItems([]);
        setCurrentWeight(0);
        setFeedback(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-black/40 rounded-xl border border-white/10 backdrop-blur-md">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Protocol: Load Balancer</h2>
                <p className="text-muted-foreground">
                    Optimize the payload. Target Load: <span className="text-primary font-bold">{targetWeight} TB</span>
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="flex flex-wrap gap-4 w-full md:w-1/2 justify-center content-start min-h-[200px] p-4 bg-white/5 rounded-lg border border-white/5 border-dashed">
                    {items.map((item) => {
                        const isSelected = selectedItems.includes(item.id);
                        if (isSelected) return null;
                        return (
                            <motion.div
                                layoutId={item.id}
                                key={item.id}
                                onClick={() => toggleItem(item.id, item.weight)}
                                whileHover={{ scale: 1.05 }}
                                className="bg-card border border-white/10 p-4 rounded-lg cursor-pointer hover:border-primary/50"
                            >
                                <div className="font-mono text-xs text-muted-foreground">ID: {item.id}</div>
                                <div className="font-bold text-lg">{item.weight} TB</div>
                            </motion.div>
                        )
                    })}
                </div>

                <div className="w-full md:w-1/2 relative">
                    <div className="absolute inset-0 bg-primary/5 blur-xl -z-10" />
                    <div className={cn(
                        "min-h-[200px] p-4 rounded-lg border-2 transition-colors duration-500 relative flex flex-wrap gap-4 content-start items-start",
                        feedback === 'SUCCESS' ? "border-green-500 bg-green-500/10" :
                            feedback === 'OVERLOAD' ? "border-red-500 bg-red-500/10" :
                                "border-primary/30 bg-black/20"
                    )}>
                        <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs font-mono">
                            <span>CURRENT: {currentWeight} TB</span>
                            <span>MAX: {targetWeight} TB</span>
                        </div>
                        <div className="absolute top-0 left-0 h-1 bg-white/10 w-full overflow-hidden rounded-t-lg">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((currentWeight / targetWeight) * 100, 100)}%` }}
                                className={cn("h-full transition-colors",
                                    currentWeight > targetWeight ? "bg-red-500" :
                                        currentWeight === targetWeight ? "bg-green-500" : "bg-primary"
                                )}
                            />
                        </div>

                        {items.map((item) => {
                            const isSelected = selectedItems.includes(item.id);
                            if (!isSelected) return null;
                            return (
                                <motion.div
                                    layoutId={item.id}
                                    key={item.id}
                                    onClick={() => toggleItem(item.id, item.weight)}
                                    className="bg-primary/20 border border-primary text-primary-foreground p-4 rounded-lg cursor-pointer"
                                >
                                    <div className="font-mono text-xs opacity-70">ID: {item.id}</div>
                                    <div className="font-bold text-lg">{item.weight} TB</div>
                                </motion.div>
                            )
                        })}

                        {selectedItems.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-sm uppercase tracking-widest pointer-events-none">
                                Drop Zone
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex gap-4 justify-center">
                        <Button onClick={reset} variant="ghost" size="sm">
                            <RotateCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button onClick={checkSolution} disabled={feedback === 'SUCCESS'} variant={feedback === 'SUCCESS' ? 'default' : 'secondary'}>
                            {feedback === 'SUCCESS' ? <><Check className="w-4 h-4 mr-2" /> Optimized</> : "Execute Check"}
                        </Button>
                    </div>

                    {feedback && feedback !== 'SUCCESS' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-center text-red-500 text-sm font-mono bg-red-500/10 p-2 rounded"
                        >
                            STATUS: {feedback} DETECTED. ADJUST PARAMETERS.
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
