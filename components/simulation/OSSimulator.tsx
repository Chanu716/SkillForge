"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
    Cpu, 
    Activity, 
    Zap, 
    Shield, 
    FolderTree, 
    Workflow,
    ArrowRight,
    Trophy,
    XCircle,
    CheckCircle2,
    Lock,
    Files,
    Terminal,
    ChevronRight,
    Clock,
    Layout
} from "lucide-react";

type Difficulty = "EASY" | "MEDIUM" | "HARD" | null;
export type OSType = 'PROC' | 'SCHED' | 'DEAD' | 'FILES';

interface Level {
    id: number;
    title: string;
    type: OSType;
    question: string;
    visualData: any;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

const GENERATE_LEVELS = (diff: Difficulty, fixedType?: OSType): Level[] => {
    if (!diff) return [];
    
    return Array.from({ length: 15 }, (_, i) => {
        const id = i + 1;
        const seed = i;
        const types: OSType[] = ['PROC', 'SCHED', 'DEAD', 'FILES'];
        const type = fixedType || types[i % types.length];

        const PROC_POOL = [
            { q: "A process is in 'Ready' state. Where is it located?", a: "Main Memory", visual: { state: "READY", context: "RAM" }, opts: ["Main Memory", "Secondary Storage", "CPU Registers", "I/O Queue"] },
            { q: "Movement from 'Running' to 'Waiting' is usually due to:", a: "I/O Request", visual: { state: "BLOCKING", context: "DISK_IO" }, opts: ["I/O Request", "Time Slice Expired", "Process Terminated", "Interrupt Handling"] },
            { q: "What stores the metadata of a process?", a: "PCB", visual: { state: "PCB_READ", context: "STRUCT" }, opts: ["PCB", "TLB", "Page Table", "Segment Table"] },
            { q: "A process that has finished but still has an entry in the table?", a: "Zombie", visual: { state: "TERMINATED", context: "ZOMBIE_ENTRY" }, opts: ["Zombie", "Orphan", "Daemon", "Daemon"] },
            { q: "Which state comes after 'Running' if time slice expires?", a: "Ready", visual: { state: "PREEMPTED", context: "TIMEOUT" }, opts: ["Ready", "Waiting", "Terminated", "Suspended"] },
            { q: "Child processes are created using which system call?", a: "fork()", visual: { state: "SPAWNING", context: "PARENT_CHILD" }, opts: ["fork()", "exec()", "pwrite()", "wait()"] },
            { q: "A process that continues despite its parent terminating?", a: "Orphan", visual: { state: "ACTIVE", context: "INIT_ADOPTED" }, opts: ["Orphan", "Zombie", "Ghost", "Root"] },
            { q: "The 'Context Switch' is handled by the:", a: "Dispatcher", visual: { state: "SWITCHING", context: "KERNEL" }, opts: ["Dispatcher", "Scheduler", "System Clock", "Interrupt Handler"] },
            { q: "Loading a executable into memory is done by:", a: "Loader", visual: { state: "LOADING", context: "HDD_TO_RAM" }, opts: ["Loader", "Compiler", "Assembler", "Linker"] },
            { q: "Total number of processes in memory is called degree of:", a: "Multiprogramming", visual: { state: "DENSITY", context: "CAPACITY" }, opts: ["Multiprogramming", "Multitasking", "Concurrency", "Throughput"] },
            { q: "Which segment stores local variables?", a: "Stack", visual: { state: "STACK_GROW", context: "MEMORY" }, opts: ["Stack", "Heap", "Data", "Code"] },
            { q: "Which segment stores global variables?", a: "Data", visual: { state: "DATA_READ", context: "MEMORY" }, opts: ["Data", "Stack", "Heap", "BSS"] },
            { q: "Program in execution is called:", a: "Process", visual: { state: "DYANMIC", context: "CPU" }, opts: ["Process", "Program", "Thread", "Task"] },
            { q: "Wait time is minimized in which OS type?", a: "Real-time", visual: { state: "DETERMINISTIC", context: "RTOS" }, opts: ["Real-time", "Batch", "Time-sharing", "Distributed"] },
            { q: "Preemptive scheduling occurs when:", a: "Interrupt occurs", visual: { state: "INTERRUPT", context: "ASYNC" }, opts: ["Interrupt occurs", "I/O starts", "Process yields", "Mutex locks"] }
        ];

        const SCHED_POOL = [
            { q: "Which algorithm uses Time Quantum?", a: "Round Robin", visual: { algo: "RR", slice: 20 }, opts: ["Round Robin", "FCFS", "SJF", "Priority"] },
            { q: "Shortest Job First (SJF) is optimal for minimizing:", a: "Average Wait Time", visual: { algo: "SJF", bars: [10, 30, 50] }, opts: ["Average Wait Time", "Throughput", "CPU Utilization", "Response Time"] },
            { q: "A process is given CPU just because it arrived first. Algorithm?", a: "FCFS", visual: { algo: "FCFS", order: [1, 2, 3] }, opts: ["FCFS", "SJF", "Priority", "LIFO"] },
            { q: "High priority process prevents low priority ones from running?", a: "Starvation", visual: { algo: "PRIORITY", block: true }, opts: ["Starvation", "Deadlock", "Livelock", "Race Condition"] },
            { q: "Solution to starvation where priority increases over time?", a: "Aging", visual: { algo: "AGING", delta: "+1" }, opts: ["Aging", "Throttling", "Scheduling", "Clustering"] },
            { q: "Algorithm where process with shortest remaining time is picked?", a: "SRTF", visual: { algo: "SRTF", check: "MIN" }, opts: ["SRTF", "SJF", "FCFS", "Round Robin"] },
            { q: "Which scheduling is most suitable for time-sharing systems?", a: "Round Robin", visual: { algo: "RR", user_count: 5 }, opts: ["Round Robin", "FCFS", "Priority", "Batch"] },
            { q: "Convoy effect is a major drawback of:", a: "FCFS", visual: { algo: "FCFS", bottle_neck: "LONG_JOB" }, opts: ["FCFS", "SJF", "Round Robin", "Multilevel Queue"] },
            { q: "In MLQ, processes are categorized into different:", a: "Queues", visual: { algo: "MLQ", layers: 3 }, opts: ["Queues", "Stacks", "Heaps", "Segments"] },
            { q: "Which algorithm can be both preemptive and non-preemptive?", a: "Priority", visual: { algo: "VAR", modes: 2 }, opts: ["Priority", "FCFS", "Round Robin", "Shortest Job First"] },
            { q: "CPU utilization is highest in which environment?", a: "Multiprogramming", visual: { algo: "LOAD", pct: 99 }, opts: ["Multiprogramming", "Single Tasking", "Batch Processing", "Serial execution"] },
            { q: "Turnaround time = Exit Time - ______", a: "Arrival Time", visual: { algo: "MATH", formula: "E - A" }, opts: ["Arrival Time", "Burst Time", "Wait Time", "Start Time"] },
            { q: "Wait Time = Turnaround Time - ______", a: "Burst Time", visual: { algo: "MATH", formula: "TAT - BT" }, opts: ["Burst Time", "Arrival Time", "Turnaround Time", "Exit Time"] },
            { q: "Real-time systems prioritize which factor?", a: "Deadlines", visual: { algo: "HARD_TASK", clock: "CRITICAL" }, opts: ["Deadlines", "Fairness", "Throughput", "Efficiency"] },
            { q: "Which scheduler selects which process should be brought into Ready queue?", a: "Long-term", visual: { algo: "LTS", scope: "POOL" }, opts: ["Long-term", "Short-term", "Medium-term", "Dispatch"] }
        ];

        const DEAD_POOL = [
            { q: "Four conditions: Mutex, Hold&Wait, No Preemption, and:", a: "Circular Wait", visual: { nodes: 4, cycle: true }, opts: ["Circular Wait", "Linear Wait", "Mutual Inclusion", "Starvation"] },
            { q: "Banker's Algorithm is used for deadlock:", a: "Avoidance", visual: { matrix: "ALLOC", safe: true }, opts: ["Avoidance", "Prevention", "Detection", "Recovery"] },
            { q: "Resource Allocation Graph with a cycle always means deadlock in?", a: "Single Instance", visual: { graph: "RAG", instances: 1 }, opts: ["Single Instance", "Multi Instance", "Symmetric", "Hierarchical"] },
            { q: "Strategy of ignoring deadlocks is called?", a: "Ostrich", visual: { mode: "IGNORE", status: "HIDDEN" }, opts: ["Ostrich", "Elephant", "Phoenix", "Osprey"] },
            { q: "Dining Philosophers problem illustrates:", a: "Resource Contention", visual: { table: 5, seats: 5 }, opts: ["Resource Contention", "Memory Leak", "Cache Miss", "Page Fault"] },
            { q: "To recover from deadlock, one can ______ a process.", a: "Terminate", visual: { target: "P1", kill: true }, opts: ["Terminate", "Duplicate", "Resume", "Prioritize"] },
            { q: "Requesting multiple resources and holding them leads to:", a: "Hold and Wait", visual: { p1: ["R1", "R2"] }, opts: ["Hold and Wait", "Mutual Exclusion", "Circular Wait", "Preemption"] },
            { q: "A safe state is one where a ______ exists.", a: "Safe Sequence", visual: { seq: ["P2", "P1", "P3"] }, opts: ["Safe Sequence", "Critical Path", "Priority Queue", "Mutex Lock"] },
            { q: "Semaphores with value 0 or 1 are called:", a: "Binary", visual: { val: 1, type: "MUTEX" }, opts: ["Binary", "Counting", "Mutex", "Atomic"] },
            { q: "Wait() and Signal() are operations on:", a: "Semaphores", visual: { op: "P/V", atomic: true }, opts: ["Semaphores", "Buses", "Registers", "Sockets"] },
            { q: "Condition where low priority owns resource needed by high priority?", a: "Priority Inversion", visual: { p_low: "LOCK", p_high: "WAIT" }, opts: ["Priority Inversion", "Priority Aging", "Priority Scaling", "Priority Preemption"] },
            { q: "Deadlock prevention ensures at least one condition is:", a: "Negated", visual: { check: "FAIL", logic: "NOT" }, opts: ["Negated", "Fulfilled", "Duplicated", "Ignored"] },
            { q: "Circular wait can be prevented by numbering resources and:", a: "Ordering Requests", visual: { r_id: [1, 2, 3], rule: "ASC" }, opts: ["Ordering Requests", "Random Access", "Static Allocation", "Preemption"] },
            { q: "Deadlock detection uses which algorithm for multiple instances?", a: "Safety Algo", visual: { matrix: "WORK", step: "ALLOC" }, opts: ["Safety Algo", "LRU Algo", "Round Robin", "Dijkstra's"] },
            { q: "Starvation vs Deadlock: which involves a cycle?", a: "Deadlock", visual: { shape: "CIRCLE", loop: true }, opts: ["Deadlock", "Starvation", "Both", "Neither"] }
        ];

        const FILES_POOL = [
            { q: "Common structure for directory implementation?", a: "Tree", visual: { root: "/", children: 3 }, opts: ["Tree", "Stack", "Queue", "Heap"] },
            { q: "Inode stores everything about a file EXCEPT:", a: "Filename", visual: { inode: 128, metadata: ["SIZE", "UID"] }, opts: ["Filename", "Permissions", "Owner ID", "File Size"] },
            { q: "File allocation where blocks are contiguous?", a: "Contiguous", visual: { disk: [1, 1, 1, 0, 0] }, opts: ["Contiguous", "Linked", "Indexed", "Hashed"] },
            { q: "Pointer to the next block is used in:", a: "Linked Allocation", visual: { b1: "->", b2: "->", b3: "END" }, opts: ["Linked Allocation", "Direct Allocation", "Indexed Allocation", "Static Allocation"] },
            { q: "A central table for all block pointers is:", a: "FAT", visual: { table: "INDEXED", map: "BLOCKS" }, opts: ["FAT", "NTFS", "EXT4", "VFS"] },
            { q: "Which allocation method suffers from external fragmentation?", a: "Contiguous", visual: { fragments: [2, 1, 3] }, opts: ["Contiguous", "Linked", "Indexed", "Clustered"] },
            { q: "Indexed allocation uses an ______ block.", a: "Index", visual: { root: "BLOCK", ptrs: 10 }, opts: ["Index", "Header", "Footer", "Buffer"] },
            { q: "Soft link (Symlink) points to a:", a: "Path name", visual: { s: "->", target: "/usr/bin" }, opts: ["Path name", "Inode number", "Memory address", "CPU register"] },
            { q: "Hard link shares the same:", a: "Inode", visual: { f1: "I-20", f2: "I-20" }, opts: ["Inode", "File handle", "Path", "Cluster"] },
            { q: "The '/' in Linux represents the:", a: "Root Directory", visual: { pos: "TOP", char: "/" }, opts: ["Root Directory", "Home Directory", "Current Directory", "Boot Sector"] },
            { q: "NTFS and FAT32 are examples of:", a: "File Systems", visual: { type: "EXT4", os: "OS" }, opts: ["File Systems", "Network Protocols", "Memory Types", "Drivers"] },
            { q: "Mounting is the process of attaching a ______ to a directory.", a: "File System", visual: { dev: "/dev/sdb", path: "/mnt" }, opts: ["File System", "Device Driver", "Process", "Thread"] },
            { q: "Which bit ensures only the owner can delete a file in a shared dir?", a: "Sticky Bit", visual: { perm: "T", flag: "AUTH" }, opts: ["Sticky Bit", "Execution Bit", "Dirty Bit", "Valid Bit"] },
            { q: "Journaling file systems keep a ______ of changes.", a: "Log", visual: { write: "JOURNAL", commit: "DISK" }, opts: ["Log", "Cache", "Backup", "Mirror"] },
            { q: "Virtual File System (VFS) provides a uniform ______ for apps.", a: "Interface", visual: { apps: "VFS", fs: ["EXT4", "NTFS"] }, opts: ["Interface", "Storage", "Network", "Buffer"] }
        ];

        const getPool = (t: OSType) => {
            switch(t) {
                case 'PROC': return PROC_POOL;
                case 'SCHED': return SCHED_POOL;
                case 'DEAD': return DEAD_POOL;
                case 'FILES': return FILES_POOL;
            }
        };

        const pool = getPool(type);
        const data = pool[seed % pool.length] as any;

        return {
            id,
            type,
            title: `${type} Segment ${id}`,
            question: data.q,
            visualData: data,
            options: [...data.opts].sort(() => Math.random() - 0.5),
            correctAnswer: data.a,
            explanation: `System interrupt trace confirms ${data.a} as the valid state transition for this ${type} predicate.`
        };
    });
};

export default function OSSimulator({ forcedType, onComplete }: { forcedType?: OSType, onComplete: (score: number) => void }) {
    const [difficulty, setDifficulty] = useState<Difficulty>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<"SUCCESS" | "ERROR" | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const levels = useMemo(() => GENERATE_LEVELS(difficulty, forcedType), [difficulty, forcedType]);
    const level = levels[currentIdx];

    const handleCheck = (val: string) => {
        if (feedback) return;
        setSelected(val);
        if (val === level.correctAnswer) setFeedback("SUCCESS");
        else setFeedback("ERROR");
    };

    const nextLevel = () => {
        if (currentIdx < levels.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelected(null);
            setFeedback(null);
        } else {
            setIsFinished(true);
            onComplete(100);
        }
    };

    if (!difficulty) {
        return (
            <div className="w-full max-w-4xl mx-auto py-20 px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <Cpu className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tighter uppercase italic">Kernel Interface</h1>
                    <p className="text-primary/60 font-mono tracking-widest uppercase italic font-bold">Bridging the gap between silicon and software.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {["EASY", "MEDIUM", "HARD"].map((d, i) => (
                        <motion.button
                            key={d}
                            whileHover={{ y: -10, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setDifficulty(d as Difficulty)}
                            className="p-10 rounded-[40px] border-2 border-white/5 bg-white/5 hover:border-primary/50 transition-all flex flex-col items-center group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {i === 0 ? <Zap className="w-12 h-12 mb-6 text-primary" /> : 
                             i === 1 ? <Activity className="w-12 h-12 mb-6 text-primary" /> : 
                             <Trophy className="w-12 h-12 mb-6 text-primary" />}
                            <h3 className="text-2xl font-black text-white uppercase italic">{d}</h3>
                            <p className="text-xs text-white/40 mt-2 font-mono tracking-[0.2em]">KERNEL_LEVEL_{i + 1}</p>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="text-center p-20 flex flex-col items-center gap-8">
                <Trophy className="w-32 h-32 text-primary animate-bounce shadow-[0_0_50px_rgba(var(--primary),0.3)]" />
                <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter">System Synchronized</h1>
                <p className="text-primary/60 font-mono tracking-widest italic uppercase">All kernel segments validated and optimized.</p>
                <Button onClick={() => window.location.reload()} size="xl" className="rounded-full px-16 h-20 text-xl font-black uppercase tracking-tighter">Return to Mainframe</Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
            {/* Header / Stats */}
            <div className="flex justify-between items-start px-4 mb-4">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl border-2 border-primary/30 bg-primary/10 flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                        <Terminal className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-3">
                            <span className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.3em]">Module:</span>
                            <span className="text-xl font-black text-white uppercase tracking-[0.2em] italic">{difficulty}</span>
                        </div>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">Host OS Intelligence</p>
                        
                        <div className="flex gap-2 pt-4">
                            {levels.map((_, i) => (
                                <motion.div 
                                    key={i}
                                    initial={false}
                                    animate={{ 
                                        backgroundColor: i <= currentIdx ? "rgba(var(--primary), 1)" : "rgba(255, 255, 255, 0.05)",
                                        width: i === currentIdx ? 48 : 20
                                    }}
                                    className={cn(
                                        "h-2 rounded-full transition-all duration-500",
                                        i === currentIdx && "shadow-[0_0_20px_rgba(var(--primary),0.5)]"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    onClick={() => setDifficulty(null)} 
                    className="text-[10px] font-mono opacity-40 hover:opacity-100 mt-2 tracking-widest uppercase"
                >
                    EXIT_KERNEL
                </Button>
            </div>

            {/* Main Stage */}
            <div className="bg-black/40 border-2 border-white/5 rounded-[60px] p-12 min-h-[580px] flex flex-col items-center justify-center relative backdrop-blur-3xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                    {feedback === "ERROR" ? (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center text-center p-10 max-w-2xl"
                        >
                            <XCircle className="w-24 h-24 text-red-500 mb-8 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.3)]" />
                            <h2 className="text-5xl font-black text-red-500 mb-6 uppercase tracking-tighter italic">Instruction Trap</h2>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-[40px] p-10 mb-10 backdrop-blur-xl">
                                <p className="text-2xl text-white/90 font-medium italic leading-relaxed">🧐 {level.explanation}</p>
                            </div>
                            <Button onClick={nextLevel} size="xl" className="rounded-full px-20 h-20 text-xl font-black bg-red-600 hover:bg-red-500 shadow-[0_20px_40px_rgba(239,68,68,0.3)] transition-all uppercase italic">Reset State</Button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="question"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full flex flex-col items-center gap-14"
                        >
                            {/* Visual Feedback Engine */}
                            <div className="relative w-full max-w-3xl aspect-video bg-black/60 rounded-[50px] border-4 border-white/5 flex items-center justify-center p-12 overflow-hidden shadow-inner">
                                <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                                    <Cpu className="w-96 h-96 text-primary" />
                                </div>

                                {level.type === 'PROC' && (
                                    <div className="flex flex-col items-center gap-10 w-full">
                                        <div className="flex items-center gap-8">
                                            <div className={cn(
                                                "w-32 h-32 rounded-3xl border-4 flex flex-col items-center justify-center transition-all duration-700",
                                                level.visualData.state === "READY" ? "border-primary bg-primary/20 shadow-[0_0_40px_rgba(var(--primary),0.3)]" : "border-white/10 opacity-40"
                                            )}>
                                                <Activity className="w-10 h-10 mb-2" />
                                                <span className="text-xs font-black uppercase italic">READY</span>
                                            </div>
                                            <ArrowRight className="w-8 h-8 opacity-20" />
                                            <div className={cn(
                                                "w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700 animate-pulse",
                                                level.visualData.state === "RUNNING" ? "border-primary bg-primary/20 shadow-[0_0_60px_rgba(var(--primary),0.4)] scale-110" : "border-white/10 opacity-20"
                                            )}>
                                                <Cpu className="w-14 h-14 mb-2" />
                                                <span className="text-sm font-black uppercase italic">RUNNING</span>
                                            </div>
                                            <ArrowRight className="w-8 h-8 opacity-20" />
                                            <div className={cn(
                                                "w-32 h-32 rounded-3xl border-4 flex flex-col items-center justify-center transition-all duration-700",
                                                level.visualData.state === "BLOCKING" ? "border-red-500 bg-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.3)]" : "border-white/10 opacity-40"
                                            )}>
                                                <Lock className="w-10 h-10 mb-2" />
                                                <span className="text-xs font-black uppercase italic">WAITING</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest italic text-primary">
                                            PCB_POINTER: 0x{Math.floor(Math.random() * 10000).toString(16)}
                                        </div>
                                    </div>
                                )}

                                {level.type === 'SCHED' && (
                                    <div className="w-full h-full flex flex-col justify-center items-center gap-10">
                                        <div className="w-full flex justify-between px-10 relative">
                                            {[...Array(3)].map((_, i) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ height: 40 }}
                                                    animate={{ height: [40, 80, 40] }}
                                                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                                                    className="w-16 bg-primary/40 rounded-t-2xl border-x-2 border-t-2 border-primary/60 flex items-center justify-center font-black text-xl italic"
                                                >
                                                    P{i+1}
                                                </motion.div>
                                            ))}
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20" />
                                        </div>
                                        <div className="flex items-center gap-6 p-8 bg-white/5 border border-white/10 rounded-3xl">
                                            <Clock className="w-8 h-8 text-primary animate-spin-slow" />
                                            <div>
                                                <p className="text-[10px] font-mono text-white/40 uppercase">Scheduling Metric</p>
                                                <p className="text-2xl font-black italic uppercase tracking-tighter">{level.visualData.algo} Strategy active</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {level.type === 'DEAD' && (
                                    <div className="relative w-72 h-72">
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                            className="absolute inset-0 border-4 border-dashed border-red-500/20 rounded-full"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="grid grid-cols-2 gap-12">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="w-16 h-16 rounded-xl border-2 border-red-500/40 bg-red-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                                        <Shield className="w-6 h-6 text-red-500" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <motion.div 
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <XCircle className="w-24 h-24 text-red-500 opacity-20" />
                                        </motion.div>
                                    </div>
                                )}

                                {level.type === 'FILES' && (
                                    <div className="w-full flex flex-col items-center gap-8">
                                        <div className="flex gap-4">
                                            {[...Array(4)].map((_, i) => (
                                                <motion.div 
                                                    key={i}
                                                    whileHover={{ y: -5, scale: 1.1 }}
                                                    className="w-16 h-20 bg-primary/10 border-2 border-primary/30 rounded-lg flex items-center justify-center shadow-lg group pointer-events-auto"
                                                >
                                                    <Files className="w-6 h-6 text-primary group-hover:scale-125 transition-transform" />
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="p-8 bg-black/40 border border-white/10 rounded-3xl w-80 text-center">
                                            <div className="flex items-center justify-center gap-3 mb-4">
                                                <FolderTree className="w-5 h-5 text-primary" />
                                                <span className="text-[10px] font-mono tracking-widest uppercase opacity-40 italic font-bold">Filesystem Hierarchy</span>
                                            </div>
                                            <p className="text-xl font-black italic tracking-tight uppercase">inode: {level.visualData.inode || "Root_Link"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-8 w-full max-w-2xl px-6">
                                <h3 className="text-4xl font-black text-white text-center leading-tight italic tracking-tighter">
                                    {level.question}
                                </h3>
                                <div className="grid grid-cols-2 gap-6 pt-6">
                                    {level.options.map((opt, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.05, y: -5, x: i % 2 === 0 ? -5 : 5 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleCheck(opt)}
                                            className={cn(
                                                "p-10 rounded-[40px] border-2 transition-all font-black text-xl uppercase tracking-tighter italic min-h-[110px] flex items-center justify-center text-center", 
                                                selected === opt 
                                                    ? (opt === level.correctAnswer ? "border-primary bg-primary/20 text-primary shadow-[0_0_50px_rgba(var(--primary),0.4)]" : "border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]")
                                                    : "border-white/5 bg-white/5 text-white/70 hover:border-primary/40 hover:bg-primary/5 hover:text-white"
                                            )}
                                        >
                                            {opt}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Success Overlay Animation */}
            <AnimatePresence>
                {feedback === "SUCCESS" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 100 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -100 }}
                        className="flex flex-col items-center gap-10 py-12"
                    >
                        <motion.div 
                            animate={{ rotateY: 360 }} 
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="bg-primary/20 p-10 rounded-full border-4 border-primary shadow-[0_0_120px_rgba(var(--primary),0.4)]"
                        >
                            <CheckCircle2 className="w-24 h-24 text-primary" />
                        </motion.div>
                        <div className="text-center space-y-2">
                             <p className="text-5xl font-black text-primary uppercase tracking-[0.5em] italic animate-pulse">Segment Verified</p>
                             <p className="text-xs font-mono text-white/30 uppercase tracking-[0.8em]">Kernel State: Optimized</p>
                        </div>
                        <Button 
                            onClick={nextLevel} 
                            size="xl" 
                            className="bg-primary hover:bg-primary/80 text-white px-36 py-14 rounded-full text-4xl font-black shadow-[0_40px_100px_rgba(var(--primary),0.5)] transition-all uppercase italic tracking-tighter group overflow-hidden"
                        >
                            <span className="relative z-10">CONTINUE_EXEC 🚀</span>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
