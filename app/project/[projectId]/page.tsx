"use client";

import { useGameStore, ProjectLevel, SubjectType } from "@/store/gameStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, CheckCircle2, Play, Code, Database, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { use } from "react";

export default function ProjectOverviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { projects, subjects } = useGameStore();

  const project = projects.find(p => p.id === unwrappedParams.projectId);

  if (!project) return <div>Project Not Found</div>;

  // Helper to get topic names for requirements
  const getRequirementNames = (topicIds: string[]) => {
    const allTopics = subjects.flatMap(s => s.topics);
    return topicIds.map(id => allTopics.find(t => t.id === id)?.title || id);
  };

  return (
    <div className="min-h-screen p-8 md:p-12">
      <header className="flex items-start gap-6 mb-12">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-secondary/10 text-secondary">
              {project.id.includes('db') ? <Database className="w-6 h-6" /> :
                project.id.includes('fe') ? <Globe className="w-6 h-6" /> : <Code className="w-6 h-6" />}
            </div>
            <div>
              <h1 className="text-4xl font-bold font-display text-white">{project.title}</h1>
              <div className="max-h-32 overflow-y-auto">
                <p className="text-muted-foreground text-lg">{project.description}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="px-3 py-1 rounded bg-white/5 border border-white/5 text-xs uppercase tracking-widest text-muted-foreground">
              {project.levels.length} Levels
            </div>
            <div className="px-3 py-1 rounded bg-white/5 border border-white/5 text-xs uppercase tracking-widest text-muted-foreground">
              Est. Time: 2h
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8 relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-8 bottom-8 w-px bg-white/10 -z-10" />

        {project.levels.map((level, index) => (
          <LevelNode
            key={level.id}
            level={level}
            index={index}
            requirements={getRequirementNames(level.requiredTopicIds)}
            onStart={() => router.push(`/project/${project.id}/workspace?level=${level.id}`)}
          />
        ))}
      </main>
    </div>
  );
}

function LevelNode({ level, index, requirements, onStart }: { level: ProjectLevel, index: number, requirements: string[], onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "ml-16 relative bg-card border rounded-xl p-6 transition-all duration-300",
        level.isLocked ? "border-white/5 opacity-60" : "border-secondary/20 hover:border-secondary shadow-[0_0_30px_rgba(0,0,0,0.3)]"
      )}
    >
      <div className="absolute -left-16 top-6 w-16 h-px bg-white/10" />
      <div className={cn(
        "absolute -left-[68px] top-[21px] w-3 h-3 rounded-full border-2 bg-background z-10",
        level.isCompleted ? "border-green-500 bg-green-500" :
          level.isLocked ? "border-white/20" : "border-secondary bg-secondary"
      )} />

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            Phase {index + 1}: {level.title}
            {level.isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          </h3>
          <div className="max-h-24 overflow-y-auto mb-2">
            <p className="text-sm text-muted-foreground mb-4">{level.description}</p>
          </div>

          {level.isLocked && requirements.length > 0 && (
            <div className="flex gap-2 text-xs items-center p-2 bg-red-500/10 text-red-400 rounded w-fit">
              <Lock className="w-3 h-3" />
              Requires: {requirements.join(", ")}
            </div>
          )}
        </div>

        {!level.isLocked && (
          <Button onClick={onStart} variant={level.isCompleted ? "outline" : "default"} className={cn(!level.isCompleted && "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
            {level.isCompleted ? "Review" : "Initialize"} <Play className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
