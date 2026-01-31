import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameMode = 'START' | 'LEARNING_HOME' | 'PROJECT_HOME' | 'SIMULATION' | 'PROJECT_WORKSPACE' | 'SUBJECT_OVERVIEW';

export type SubjectType = 'APTITUDE' | 'DBMS' | 'OS';

export interface Topic {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  moduleId: string | null; // ID to link to a simulation, if any
}

export interface SubjectModule {
  id: SubjectType;
  title: string;
  description: string;
  topics: Topic[];
  progress: number; // 0-100
}

export interface ProjectLevel {
  id: string;
  title: string;
  description: string;
  requiredTopicIds: string[];
  isLocked: boolean;
  isCompleted: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  levels: ProjectLevel[];
  currentPhase?: 'ANALYSIS' | 'DESIGN' | 'IMPLEMENTATION' | 'OPTIMIZATION' | 'VALIDATION' | 'COMPLETED'; // Optional for backward compatibility, default to ANALYSIS
  isUnlocked: boolean; // Generally true now, levels are locked
}

interface GameState {
  // User Profile
  username: string;
  xp: number;
  level: number;

  // Navigation
  currentMode: GameMode;

  // Content
  subjects: SubjectModule[];
  projects: Project[];

  // Actions
  setUsername: (name: string) => void;
  setMode: (mode: GameMode) => void;
  completeTopic: (subjectId: SubjectType, topicId: string, score: number) => void;
  unlockProjectLevel: (projectId: string, levelId: string) => void;
  updateProjectPhase: (projectId: string, phase: string) => void;
  addXP: (amount: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      username: 'Guest',
      xp: 0,
      level: 1,
      currentMode: 'START',

      subjects: [
        {
          id: 'APTITUDE',
          title: 'Aptitude & Logic',
          description: 'Hone the engine of your mind.',
          progress: 0,
          topics: [
            { id: 'apt-logic', title: 'Logical Reasoning', description: 'The Bridge Pattern', isUnlocked: true, isCompleted: false, moduleId: 'apt-logic-1' },
            { id: 'apt-prob', title: 'Probability', description: 'Risk Assessment', isUnlocked: true, isCompleted: false, moduleId: 'apt-prob-1' },
            { id: 'apt-clocks', title: 'Clocks & Calendars', description: 'Temporal Logic', isUnlocked: true, isCompleted: false, moduleId: 'apt-clocks-1' },
            { id: 'apt-blood', title: 'Blood Relations', description: 'Lineage Mapping', isUnlocked: true, isCompleted: false, moduleId: 'apt-blood-1' },
            { id: 'apt-seat', title: 'Seating Arrangement', description: 'Spatial Organization', isUnlocked: true, isCompleted: false, moduleId: 'apt-seat-1' },
            { id: 'apt-code', title: 'Coding-Decoding', description: 'Pattern Decryption', isUnlocked: true, isCompleted: false, moduleId: 'apt-code-1' },
            { id: 'apt-syl', title: 'Syllogisms', description: 'Deductive Logic', isUnlocked: true, isCompleted: false, moduleId: 'apt-syl-1' },
            { id: 'apt-puzz', title: 'Logic Puzzles', description: 'Complex Reasoning', isUnlocked: true, isCompleted: false, moduleId: 'apt-puzz-1' },
          ]
        },
        {
          id: 'DBMS',
          title: 'Database Systems',
          description: 'Architecting persistent memory.',
          progress: 0,
          topics: [
            { id: 'dbms-rel', title: 'Relational Model', description: 'Tables and Tuples', isUnlocked: true, isCompleted: false, moduleId: 'dbms-rel-1' },
            { id: 'dbms-er', title: 'ER Diagrams', description: 'Visualizing Entities', isUnlocked: true, isCompleted: false, moduleId: 'dbms-er-1' },
            { id: 'dbms-norm', title: 'Normalization', description: 'Removing Redundancy', isUnlocked: true, isCompleted: false, moduleId: 'dbms-norm-1' },
            { id: 'dbms-sql', title: 'SQL Basics', description: 'The Query Language', isUnlocked: true, isCompleted: false, moduleId: 'dbms-sql-1' },
            { id: 'dbms-join', title: 'Advanced Joins', description: 'Connecting Data', isUnlocked: true, isCompleted: false, moduleId: 'dbms-join-1' },
            { id: 'dbms-idx', title: 'Indexing', description: 'Performance Optimization', isUnlocked: true, isCompleted: false, moduleId: 'dbms-idx-1' },
          ]
        },
        {
          id: 'OS',
          title: 'Operating Systems',
          description: 'The Ghost in the Machine.',
          progress: 0,
          topics: [
            { id: 'os-proc', title: 'Process Management', description: 'Lifecycle of Code', isUnlocked: true, isCompleted: false, moduleId: 'os-proc-1' },
            { id: 'os-sched', title: 'CPU Scheduling', description: 'The Conductor', isUnlocked: true, isCompleted: false, moduleId: 'os-sched-1' },
            { id: 'os-dead', title: 'Deadlocks', description: 'Resource Contention', isUnlocked: true, isCompleted: false, moduleId: 'os-dead-1' },
            { id: 'os-files', title: 'File Systems', description: 'Persistent Storage Hierarchy', isUnlocked: true, isCompleted: false, moduleId: 'os-files-1' },
          ]
        }
      ],

      projects: [
        {
          id: 'proj-blog',
          title: 'Blog Database Architecture',
          description: 'Design a scalable schema for a high-traffic content platform.',
          isUnlocked: true,
          currentPhase: 'ANALYSIS',
          levels: [
            { id: 'lvl-1', title: 'Schema Design', description: 'Draft the ER Diagram', requiredTopicIds: ['dbms-er'], isLocked: true, isCompleted: false },
            { id: 'lvl-2', title: 'Normalization', description: 'Optimize to 3NF', requiredTopicIds: ['dbms-norm'], isLocked: true, isCompleted: false },
            { id: 'lvl-3', title: 'Query Optimization', description: 'Write efficient SQL', requiredTopicIds: ['dbms-sql', 'dbms-idx'], isLocked: true, isCompleted: false },
          ]
        },
        {
          id: 'proj-fe',
          title: 'Analytics Dashboard',
          description: 'Build a responsive frontend for data visualization.',
          isUnlocked: true,
          currentPhase: 'ANALYSIS',
          levels: [
            { id: 'lvl-1', title: 'Layout Structures', description: 'Grid & Flexbox', requiredTopicIds: [], isLocked: false, isCompleted: false }, // Open
            { id: 'lvl-2', title: 'Data Binding', description: 'State & Props', requiredTopicIds: ['apt-logic'], isLocked: true, isCompleted: false },
          ]
        }
      ],

      setUsername: (name) => set({ username: name }),
      setMode: (mode) => set({ currentMode: mode }),

      updateProjectPhase: (projectId, phase) => {
        set((state) => ({
          projects: state.projects.map(p =>
            p.id === projectId ? { ...p, currentPhase: phase as any } : p
          )
        }));
      },

      addXP: (amount) => {
        const currentXP = get().xp;
        const newXP = currentXP + amount;
        set({ xp: newXP, level: Math.floor(Math.sqrt(newXP / 100)) + 1 });
      },

      completeTopic: (subjectId, topicId, score) => {
        set((state) => {
          // 1. Mark topic completed
          const updatedSubjects = state.subjects.map(sub => {
            if (sub.id !== subjectId) return sub;
            const updatedTopics = sub.topics.map(t => {
              if (t.id === topicId) return { ...t, isCompleted: true };
              // Unlock next topic logic (simple sequential for now)
              return t;
            });
            // Unlock next topic if current is done
            const currentIdx = updatedTopics.findIndex(t => t.id === topicId);
            if (currentIdx !== -1 && currentIdx < updatedTopics.length - 1) {
              updatedTopics[currentIdx + 1].isUnlocked = true;
            }
            return { ...sub, topics: updatedTopics };
          });

          // 2. Check Project Unlocks
          // Gather all completed topic IDs
          const allCompletedTopicIds = updatedSubjects.flatMap(s => s.topics).filter(t => t.isCompleted).map(t => t.id);

          const updatedProjects = state.projects.map(p => ({
            ...p,
            levels: p.levels.map(lvl => ({
              ...lvl,
              isLocked: !lvl.requiredTopicIds.every(req => allCompletedTopicIds.includes(req)) && lvl.requiredTopicIds.length > 0
            }))
          }));

          return { subjects: updatedSubjects, projects: updatedProjects };
        });
        get().addXP(100);
      },

      unlockProjectLevel: (projectId, levelId) => {
        // Manual unlock override if needed
      }
    }),
    {
      name: 'skillforge-storage-v5', // Reset to unlock all interactive modules
    }
  )
);
