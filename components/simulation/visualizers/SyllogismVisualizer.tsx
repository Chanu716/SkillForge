import { motion } from "framer-motion";

export interface SyllogismStep {
    text: string;
    circles: { id: string; label: string; x: number; y: number; r: number; color: string }[];
    // Defines which overlap regions are highlighted/valid
    highlightRelation?: { from: string; to: string; type: "ALL" | "SOME" | "NO" };
}

interface SyllogismVisualizerProps {
    steps: SyllogismStep[];
    currentStep: number;
}

export default function SyllogismVisualizer({ steps, currentStep }: SyllogismVisualizerProps) {
    const activeStep = steps[currentStep];

    return (
        <div className="w-full flex flex-col items-center justify-center h-full">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mb-8 font-mono text-primary text-sm bg-primary/10 px-4 py-2 rounded-lg border border-primary/20"
            >
                {activeStep.text}
            </motion.div>

            <div className="relative w-[500px] h-[350px] bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                <svg className="w-full h-full">
                    {activeStep.circles.map((circle, i) => (
                        <motion.g
                            key={circle.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: circle.x,
                                y: circle.y
                            }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                        >
                            <circle
                                r={circle.r}
                                fill={circle.color}
                                fillOpacity={0.2}
                                stroke={circle.color}
                                strokeWidth={2}
                            />
                            <text
                                y={-circle.r + 20}
                                textAnchor="middle"
                                fill="white"
                                fontSize="14"
                                fontWeight="bold"
                                style={{ pointerEvents: 'none' }}
                            >
                                {circle.label}
                            </text>
                        </motion.g>
                    ))}

                    {/* Dynamic Overlap Highlight (Conceptual - hard to do generalizing SVG paths in React without complex libs, simple circle overlay for now) */}
                    {activeStep.highlightRelation && (
                        <motion.text
                            x="50%" y="90%"
                            textAnchor="middle"
                            fill="white"
                            className="text-xs uppercase tracking-widest opacity-50"
                        >
                            Relation: {activeStep.highlightRelation.type} ({activeStep.highlightRelation.from} ↔ {activeStep.highlightRelation.to})
                        </motion.text>
                    )}
                </svg>
            </div>
        </div>
    );
}
