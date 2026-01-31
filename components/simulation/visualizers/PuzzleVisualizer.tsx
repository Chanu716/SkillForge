import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export interface PuzzleStep {
    text: string;
    updates: { row: number; col: number; status: "YES" | "NO" }[];
}

interface PuzzleVisualizerProps {
    rows: string[];
    cols: string[];
    steps: PuzzleStep[];
    currentStep: number;
}

export default function PuzzleVisualizer({ rows, cols, steps, currentStep }: PuzzleVisualizerProps) {
    const activeStep = steps[currentStep];

    // Compute grid state based on all steps up to current
    const gridState: Record<string, "YES" | "NO" | null> = {};

    steps.slice(0, currentStep + 1).forEach(step => {
        step.updates.forEach(u => {
            const key = `${u.row}-${u.col}`;
            gridState[key] = u.status;
        });
    });

    return (
        <div className="w-full flex flex-col items-center">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mb-8 font-mono text-purple-400 text-sm bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/20"
            >
                {activeStep.text}
            </motion.div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <div className="grid" style={{ gridTemplateColumns: `auto repeat(${cols.length}, minmax(60px, 1fr))` }}>
                    {/* Header Row */}
                    <div className="p-2" /> {/* Top Left Empty */}
                    {cols.map((c, i) => (
                        <div key={i} className="p-2 text-center font-bold text-white/70 border-b border-white/10 text-sm rotate-0">{c}</div>
                    ))}

                    {/* Data Rows */}
                    {rows.map((r, rIdx) => (
                        <>
                            <div key={`row-head-${rIdx}`} className="p-2 font-bold text-white/70 border-r border-white/10 text-sm flex items-center justify-end pr-4">
                                {r}
                            </div>
                            {cols.map((c, cIdx) => {
                                const status = gridState[`${rIdx}-${cIdx}`];
                                const isJustUpdated = activeStep.updates.some(u => u.row === rIdx && u.col === cIdx);

                                return (
                                    <motion.div
                                        key={`cell-${rIdx}-${cIdx}`}
                                        className="border border-white/5 h-16 flex items-center justify-center relative bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        {status === "YES" && (
                                            <motion.div
                                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center"
                                            >
                                                <Check className="w-5 h-5" />
                                            </motion.div>
                                        )}
                                        {status === "NO" && (
                                            <motion.div
                                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                className="w-full h-full flex items-center justify-center text-white/10"
                                            >
                                                <X className="w-6 h-6" />
                                            </motion.div>
                                        )}
                                        {isJustUpdated && (
                                            <motion.div
                                                className="absolute inset-0 border-2 border-primary/50"
                                                initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1 }}
                                            />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}
