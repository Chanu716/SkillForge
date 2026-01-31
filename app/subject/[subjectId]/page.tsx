"use client";

import { useGameStore, Topic } from "@/store/gameStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { use } from "react";

export default function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
    const unwrappedParams = use(params);
    const router = useRouter();
    const { subjects } = useGameStore();

    // Find the subject based on the dynamic route parameter
    // Note: subjectId in store is 'DBMS', but param might be 'DBMS' (case sensitive check needed)
    const subject = subjects.find(s => s.id === unwrappedParams.subjectId);

    if (!subject) {
        return <div className="p-12 text-center text-red-400">Subject Protocol Not Found</div>;
    }

    return (
        <div className="min-h-screen p-8 md:p-12">
            <header className="flex items-center gap-4 mb-12">
                <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-display text-white">{subject.title}</h1>
                    <p className="text-muted-foreground">{subject.description}</p>
                </div>
            </header>

            <div className="grid gap-6 max-w-4xl mx-auto">
                {subject.topics.map((topic, index) => (
                    <TopicCard key={topic.id} topic={topic} index={index} />
                ))}
            </div>
        </div>
    );
}

function TopicCard({ topic, index }: { topic: Topic, index: number }) {
    const router = useRouter();

    const handleEnter = () => {
        if (topic.isUnlocked && topic.moduleId) {
            router.push(`/learn/${topic.moduleId}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "relative p-6 rounded-xl border transition-all duration-300 backdrop-blur-sm bg-card/40 flex items-center justify-between group",
                topic.isUnlocked ? "border-white/10 hover:border-primary/50" : "border-white/5 opacity-50 cursor-not-allowed"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                    topic.isCompleted ? "bg-green-500/20 text-green-400" :
                        topic.isUnlocked ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                )}>
                    {topic.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>

                <div>
                    <h3 className={cn("text-lg font-bold transition-colors", topic.isUnlocked ? "text-white" : "text-muted-foreground")}>
                        {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {topic.isUnlocked ? (
                    topic.moduleId ? (
                        <Button onClick={handleEnter} variant="cyber" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-4 h-4 mr-2" /> Start
                        </Button>
                    ) : (
                        <span className="text-xs text-muted-foreground uppercase tracking-wider px-3 py-1 border border-white/5 rounded">Reading Only</span>
                    )
                ) : (
                    <Lock className="w-5 h-5 text-muted-foreground/30" />
                )}
            </div>

            {/* Connector Line (except last) */}
            <div className="absolute left-11 top-16 bottom-[-24px] w-px bg-white/10 -z-10 group-last:hidden" />
        </motion.div>
    );
}
