"use client";

import { useGameStore } from "@/store/gameStore";
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
        <div className="min-h-screen p-8 flex flex-col">
            <header className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={() => router.push(`/subject/${topic.subjectId}`)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-white">{topic.title}</h1>
                    <p className="text-muted-foreground text-sm">{topic.description}</p>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center">
                {topic.moduleId?.includes('apt-logic') && <AptitudeBridge onComplete={handleComplete} />}
                {topic.moduleId?.includes('apt-time') && <TimeWorkSimulator onComplete={handleComplete} />}
                {topic.moduleId?.includes('apt-prob') && <ProbabilitySimulator onComplete={handleComplete} />}
                {topic.moduleId?.includes('apt-clocks') && <ClockCalendarSimulator onComplete={handleComplete} />}
                {topic.moduleId?.includes('apt-blood') && <BloodRelationSimulator onComplete={handleComplete} />}

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
                    return <DBMSSimulator forcedType={type ? dbmsTypeMap[type] : undefined} onComplete={handleComplete} />;
                })()}

                {topic.moduleId?.startsWith('os-') && (() => {
                    const osTypeMap: Record<string, 'PROC' | 'SCHED' | 'DEAD' | 'FILES'> = {
                        'os-proc': 'PROC',
                        'os-sched': 'SCHED',
                        'os-dead': 'DEAD',
                        'os-files': 'FILES'
                    };
                    const type = Object.keys(osTypeMap).find(key => topic.moduleId?.includes(key));
                    return <OSSimulator forcedType={type ? osTypeMap[type] : undefined} onComplete={handleComplete} />;
                })()}

                {/* Use Generic Simulator for other unlocked modules */}
                {!topic.moduleId?.includes('apt-') && !topic.moduleId?.includes('dbms-') && !topic.moduleId?.includes('os-') && (
                    <GenericSimulator
                        topicId={topic.id}
                        topicTitle={topic.title}
                        onComplete={handleComplete}
                    />
                )}
            </main>
        </div>
    );
}
