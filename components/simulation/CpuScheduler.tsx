"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Process {
    id: string;
    name: string;
    arrival: number;
    burst: number;
    remaining: number;
    color: string;
    status: 'waiting' | 'running' | 'completed';
}

export default function CpuScheduler({ onComplete }: { onComplete: (score: number) => void }) {
    const [algorithm, setAlgorithm] = useState<'FCFS' | 'RR'>('FCFS');
    const [processes, setProcesses] = useState<Process[]>([]);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [currentProcess, setCurrentProcess] = useState<Process | null>(null);
    const [completed, setCompleted] = useState<Process[]>([]);
    const [log, setLog] = useState<string[]>([]);

    // Initial State
    const initialProcesses: Process[] = [
        { id: 'p1', name: 'P1', arrival: 0, burst: 4, remaining: 4, color: 'bg-blue-500', status: 'waiting' },
        { id: 'p2', name: 'P2', arrival: 1, burst: 3, remaining: 3, color: 'bg-green-500', status: 'waiting' },
        { id: 'p3', name: 'P3', arrival: 2, burst: 2, remaining: 2, color: 'bg-purple-500', status: 'waiting' },
        { id: 'p4', name: 'P4', arrival: 4, burst: 5, remaining: 5, color: 'bg-yellow-500', status: 'waiting' },
    ];

    useEffect(() => {
        reset();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(tick, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, time, processes, currentProcess]);

    const reset = () => {
        setIsRunning(false);
        setTime(0);
        setProcesses(initialProcesses.map(p => ({ ...p })));
        setCompleted([]);
        setCurrentProcess(null);
        setLog(['System Booted. Ready for scheduling.']);
    };

    const tick = () => {
        // Check processes arriving at this second
        const arriving = processes.filter(p => p.arrival === time && p.status === 'waiting');
        if (arriving.length > 0) {
            setLog(prev => [...prev, `T=${time}: ${arriving.map(p => p.name).join(', ')} arrived in Ready Queue.`]);
        }

        // Select Process Logic (FCFS)
        let nextProc = currentProcess;

        // If current completed or null, pick next
        if (!nextProc || nextProc.remaining === 0) {
            if (nextProc) {
                setCompleted(prev => [...prev, { ...nextProc!, status: 'completed' }]);
                setLog(prev => [...prev, `T=${time}: ${nextProc!.name} Completed.`]);
                nextProc = null; // Clear it to pick waitings
            }

            // FCFS: Pick earliest arrival that is not completed
            const available = processes
                .filter(p => p.arrival <= time && p.remaining > 0 && p.id !== currentProcess?.id)
                .sort((a, b) => a.arrival - b.arrival);

            if (available.length > 0) {
                nextProc = available[0];
                setLog(prev => [...prev, `T=${time}: Context Switch -> ${nextProc!.name}`]);
            }
        }

        // Execute
        if (nextProc) {
            const updated = { ...nextProc, remaining: nextProc.remaining - 1, status: 'running' as const };

            // Update master list
            setProcesses(prev => prev.map(p => p.id === updated.id ? updated : p));
            setCurrentProcess(updated);
        } else {
            setCurrentProcess(null);
            // Check if all done
            if (processes.every(p => p.remaining === 0)) {
                setIsRunning(false);
                setLog(prev => [...prev, `All Tasks Completed.`]);
                setTimeout(() => onComplete(100), 1000);
            } else {
                setLog(prev => [...prev, `T=${time}: CPU Idle`]);
            }
        }

        setTime(prev => prev + 1);
    };

    return (
        <div className="w-full max-w-3xl p-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Visualizer */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-black/40 border border-white/10 rounded-xl p-3 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold font-display text-white">CPU Visualizer <span className="text-muted-foreground text-sm ml-2">({algorithm})</span></h2>
                        <div className="font-mono text-primary text-xl">T = {time}s</div>
                    </div>

                    {/* CPU Core */}
                    <div className="flex justify-center mb-12">
                        <div className={cn(
                            "w-32 h-32 rounded-xl flex items-center justify-center border-4 transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]",
                            currentProcess ? "border-primary bg-primary/10" : "border-white/10 bg-black/20"
                        )}>
                            {currentProcess ? (
                                <motion.div
                                    layoutId={currentProcess.id}
                                    className={cn("w-20 h-20 rounded lg flex items-center justify-center font-bold text-white shadow-lg", currentProcess.color)}
                                >
                                    {currentProcess.name}
                                </motion.div>
                            ) : (
                                <span className="text-muted-foreground text-xs uppercase tracking-widest">Idle</span>
                            )}
                        </div>
                    </div>

                    {/* Ready Queue (Gantt-ish) */}
                    <div className="space-y-2">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">Process Pool</div>
                        <div className="flex gap-2 min-h-[40px] p-2 bg-white/5 rounded-lg border border-white/5 items-center overflow-x-auto">
                            <AnimatePresence>
                                {processes.filter(p => p.remaining > 0 && p.id !== currentProcess?.id).map((p) => (
                                    <motion.div
                                        key={p.id}
                                        layoutId={p.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        className={cn(
                                            "flex-shrink-0 w-16 h-20 rounded-lg flex flex-col items-center justify-center border border-white/10 relative",
                                            p.arrival > time ? "opacity-30 grayscale" : "bg-card"
                                        )}
                                    >
                                        <div className={cn("absolute inset-0 opacity-20", p.color)} />
                                        <span className="font-bold relative z-10">{p.name}</span>
                                        <span className="text-[10px] text-muted-foreground relative z-10">Bur: {p.burst}</span>
                                        {p.arrival > time && (
                                            <div className="absolute -top-2 bg-black text-[10px] px-1 rounded border border-white/10">
                                                Arr: {p.arrival}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                {processes.every(p => p.remaining === 0 || p.id === currentProcess?.id) && !currentProcess && (
                                    <div className="text-muted-foreground text-xs mx-auto">Empty Queue</div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    <Button onClick={() => setIsRunning(!isRunning)} variant={isRunning ? "secondary" : "cyber"} className="w-full">
                        {isRunning ? <><Pause className="w-4 h-4 mr-2" /> Pause Simulation</> : <><Play className="w-4 h-4 mr-2" /> Start Clock</>}
                    </Button>
                    <Button onClick={reset} variant="ghost" size="icon">
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Stats & Log */}
            <div className="space-y-3">
                <div className="bg-black/40 border border-white/10 rounded-xl p-3 backdrop-blur-md h-full flex flex-col">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Kernel Log</h3>
                    <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 max-h-[400px] pr-2">
                        {log.map((entry, i) => (
                            <div key={i} className="text-gray-400 border-b border-white/5 pb-1 last:border-0 hover:text-white transition-colors">
                                <span className="text-primary mr-2">➜</span> {entry}
                            </div>
                        ))}
                        <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
                    </div>
                </div>
            </div>
        </div>
    );
}
