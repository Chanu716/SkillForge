import { motion } from "framer-motion";

export interface CodingStep {
    text: string;
    focusIndices?: number[]; // Which indices are currently being processed
    shiftAmount?: number; // Show +1, -1 etc explicitly
}

interface CodingVisualizerProps {
    sourceWord: string;
    targetWord: string; // The "coded" version or the transformation target
    steps: CodingStep[];
    currentStep: number;
}

export default function CodingVisualizer({ sourceWord, targetWord, steps, currentStep }: CodingVisualizerProps) {
    const activeStep = steps[currentStep];
    const sourceChars = sourceWord.split('');
    const targetChars = targetWord.split('');

    return (
        <div className="w-full flex flex-col items-center justify-center py-10 gap-16">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg text-secondary font-mono text-sm"
            >
                {activeStep.text}
            </motion.div>

            <div className="flex gap-4">
                {sourceChars.map((char, i) => {
                    const isFocused = activeStep.focusIndices?.includes(i);
                    // Determine if we should show the transformed letter yet
                    // If we are past the step where this index was focused?
                    // Simplified: Show target letter if this index is focused OR if we are past a step that focused it.
                    // For this visualizer, let's just show mapped pairs active.

                    return (
                        <div key={i} className="flex flex-col items-center gap-4">
                            {/* Source Letter */}
                            <motion.div
                                animate={{
                                    scale: isFocused ? 1.2 : 1,
                                    borderColor: isFocused ? "#3b82f6" : "rgba(255,255,255,0.1)",
                                    backgroundColor: isFocused ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.05)"
                                }}
                                className="w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl font-black text-white"
                            >
                                {char}
                            </motion.div>

                            {/* Arrow / Shift Indicator */}
                            <motion.div
                                animate={{ opacity: isFocused ? 1 : 0.1, y: isFocused ? 0 : -5 }}
                                className="h-12 flex flex-col items-center justify-center text-primary font-mono font-bold"
                            >
                                {isFocused && (
                                    <>
                                        <span className="text-xs mb-1">+{activeStep.shiftAmount}</span>
                                        <div className="w-0.5 h-full bg-gradient-to-b from-blue-500 to-green-500" />
                                        <div className="w-2 h-2 rotate-45 border-r-2 border-b-2 border-green-500 -mt-1" />
                                    </>
                                )}
                            </motion.div>

                            {/* Target Letter */}
                            <motion.div
                                animate={{
                                    scale: isFocused ? 1.2 : 1,
                                    opacity: isFocused ? 1 : 0.3,
                                    color: isFocused ? "#22c55e" : "#ffffff",
                                    borderColor: isFocused ? "#22c55e" : "rgba(255,255,255,0.1)"
                                }}
                                className="w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl font-black"
                            >
                                {activeStep.focusIndices?.includes(i) || currentStep >= steps.length - 1 ? targetChars[i] : "?"}
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
