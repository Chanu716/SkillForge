"use client";

import { useGameStore } from "@/store/gameStore";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AptitudeBridge from "@/components/simulation/AptitudeBridge";
import NormalizationBuilder from "@/components/simulation/NormalizationBuilder";
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
        // Determine subjectId from the flattened search or store structure
        // Since we flattened it above, we have subjectId
        completeTopic(topic.subjectId, topic.id, score);
        setTimeout(() => {
            // Go back to the subject page instead of dashboard
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
                {topic.moduleId?.includes('apt-logic') && (
                    <AptitudeBridge onComplete={handleComplete} />
                )}
                {topic.moduleId?.includes('dbms-norm') && (
                    <NormalizationBuilder onComplete={handleComplete} />
                )}
                {/* Fallback */}
                {!topic.moduleId?.includes('apt-logic') && !topic.moduleId?.includes('dbms-norm') && (
                    <div className="text-center p-12 border border-dashed border-white/10 rounded-xl">
                        <p className="text-muted-foreground">Simulation for {topic.title} under construction.</p>
                        <Button onClick={() => handleComplete(100)} variant="secondary" className="mt-4">
                            Debug: Auto Complete
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
