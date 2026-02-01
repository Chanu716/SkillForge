"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AptitudeBridge from "@/components/simulation/AptitudeBridge";
import NormalizationBuilder from "@/components/simulation/NormalizationBuilder";
import PatternRecognition from "@/components/simulation/PatternRecognition";
import TimeWorkSimulator from "@/components/simulation/TimeWorkSimulator";
import ProbabilitySimulator from "@/components/simulation/ProbabilitySimulator";
import ClockCalendarSimulator from "@/components/simulation/ClockCalendarSimulator";
import BloodRelationSimulator from "@/components/simulation/BloodRelationSimulator";
import DBMSSimulator from "@/components/simulation/DBMSSimulator";
import OSSimulator from "@/components/simulation/OSSimulator";
import GenericSimulator from "@/components/simulation/GenericSimulator";
import { use } from "react";

export default function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
    const unwrappedParams = use(params);
    const { subjects, completeTopic } = useGameStore();
    const router = useRouter();

    // Flatten topics to find the one matching the moduleId
    const topic = subjects
        .flatMap(s => s.topics.map(t => ({ ...t, subjectId: s.id })))
        .find(t => t.moduleId === unwrappedParams.moduleId);

    if (!topic) {
        return <div className="p-12 text-center text-white">Module Not Found</div>;
    }

    const handleComplete = (score: number) => {
        completeTopic(topic.subjectId, topic.id, score);
        setTimeout(() => {
            router.push(`/subject/${topic.subjectId}`);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-black/95 relative overflow-x-hidden">
            {/* Animated background overlay */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="w-full h-full bg-linear-to-br from-black via-primary/10 to-black blur-2xl rounded-[60px]" />
            </div>
            <header className="flex items-center gap-4 mb-8 px-8 pt-8">
                <Button variant="ghost" size="icon" onClick={() => router.push(`/subject/${topic.subjectId}`)} className="hover:bg-primary/10 border border-white/10 text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="ml-2">
                    <h1 className="text-3xl font-black text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] tracking-tight animate-fade-in-up">
                        {topic.title}
                    </h1>
                    <div className="max-h-32 overflow-y-auto">
                        <p className="text-primary/70 text-sm font-mono tracking-widest animate-fade-in-up delay-100">{topic.description}</p>
                    </div>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center px-4 pb-8">
                {/* Framer-motion animated page transition */}
                <div className="w-full max-w-4xl mx-auto">
                    {/* Simulators with creative fade-in */}
                    {topic.moduleId?.includes('apt-logic') && (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                            <AptitudeBridge onComplete={handleComplete} />
                        </motion.div>
                    )}
                    {topic.moduleId?.includes('apt-seat') && (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                            <AptitudeBridge onComplete={handleComplete} category="SEATING" />
                        </motion.div>
                    )}
                    {topic.moduleId?.includes('apt-code') && (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                            <AptitudeBridge onComplete={handleComplete} category="CODING" />
                        </motion.div>
                    )}
                    {topic.moduleId?.includes('apt-syl') && (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                            <AptitudeBridge onComplete={handleComplete} category="SYLLOGISM" />
                        </motion.div>
                    )}
                    {topic.moduleId?.includes('apt-puzz') && (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                            <AptitudeBridge onComplete={handleComplete} category="PUZZLE" />
                        </motion.div>
                    )}
                    {topic.moduleId?.includes('apt-time') && (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                            <TimeWorkSimulator onComplete={handleComplete} />
                        </motion.div>
                    )}
                    {topic.moduleId?.includes('apt-prob') && (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                            <ProbabilitySimulator onComplete={handleComplete} />
                        </motion.div>
                    )}
                    {topic.moduleId?.includes('apt-clocks') && (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                            <ClockCalendarSimulator onComplete={handleComplete} />
                        </motion.div>
                    )}
                    {topic.moduleId?.includes('apt-blood') && (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                            <BloodRelationSimulator onComplete={handleComplete} />
                        </motion.div>
                    )}

                    {topic.moduleId?.startsWith('dbms-') && (() => {
                        const dbmsTypeMap: Record<string, 'SCHEMA' | 'ER' | 'SQL' | 'JOIN' | 'NORM' | 'INDEX'> = {
                            'dbms-rel': 'SCHEMA',
                            'dbms-er': 'ER',
                            'dbms-norm': 'NORM',
                            'dbms-sql': 'SQL',
                            'dbms-join': 'JOIN',
                            'dbms-idx': 'INDEX'
                        };
                        const type = Object.keys(dbmsTypeMap).find(key => topic.moduleId?.includes(key));
                        return (
                            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                                <DBMSSimulator forcedType={type ? dbmsTypeMap[type] : undefined} onComplete={handleComplete} />
                            </motion.div>
                        );
                    })()}

                    {topic.moduleId?.startsWith('os-') && (() => {
                        const osTypeMap: Record<string, 'PROC' | 'SCHED' | 'DEAD' | 'FILES'> = {
                            'os-proc': 'PROC',
                            'os-sched': 'SCHED',
                            'os-dead': 'DEAD',
                            'os-files': 'FILES'
                        };
                        const type = Object.keys(osTypeMap).find(key => topic.moduleId?.includes(key));
                        return (
                            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                                <OSSimulator forcedType={type ? osTypeMap[type] : undefined} onComplete={handleComplete} />
                            </motion.div>
                        );
                    })()}

                    {/* Use Generic Simulator for other unlocked modules */}
                    {!topic.moduleId?.includes('apt-') && !topic.moduleId?.includes('dbms-') && !topic.moduleId?.includes('os-') && (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
                            <GenericSimulator 
                                topicId={topic.id} 
                                topicTitle={topic.title} 
                                onComplete={handleComplete} 
                            />
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}