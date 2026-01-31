"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, ArrowRight, Zap, Shield, Flame, Users, Network, GitPullRequest, Info, XCircle, Heart, Activity } from "lucide-react";

type Difficulty = "EASY" | "MEDIUM" | "HARD" | null;

interface Level {
    id: number;
    title: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

const GENERATE_LEVELS = (diff: Difficulty): Level[] => {
    if (!diff) return [];
    
    const EASY_POOL = [
        { q: "His father is my father's only son.", a: "His Son", ex: "'My father's only son' is the speaker. Thus, speaker is person's father.", opts: ["His Son", "His Father", "Himself", "His Brother"] },
        { q: "Pointing to a man, a woman says: 'He is the son of my father's only daughter'.", a: "Her Son", ex: "'My father's only daughter' is the woman herself. He is her son.", opts: ["Her Son", "Her Husband", "Her Brother", "Her Father"] },
        { q: "A woman says: 'This man's wife is my mother's only daughter'.", a: "Himself", ex: "'My mother's only daughter' is the woman. She is the man's wife.", opts: ["Her Husband", "Her Brother", "Her Son", "Her Father"] },
        { q: "Pointing to a boy, a girl said, 'He is the son of the daughter of the father of my uncle.'", a: "Brother/Cousin", ex: "Father of uncle is grandfather. Daughter of grandfather is aunt/mother. Her son is brother/cousin.", opts: ["Brother/Cousin", "Son", "Father", "Uncle"] },
        { q: "Introducing a man, a woman said, 'His wife is the only daughter of my father'.", a: "Her Husband", ex: "'Only daughter of my father' is the woman. She is the man's wife.", opts: ["Her Husband", "Her Brother", "Her Father", "Her Son"] },
        { q: "Pointing to a man, a boy said, 'He is the father of my mother's only daughter'.", a: "Father", ex: "Mother's only daughter is the boy's sister. Her father is the boy's father.", opts: ["Father", "Uncle", "Brother", "Grandfather"] },
        { q: "A says to B, 'You are the son of my grandfather's only son'.", a: "Brother", ex: "Grandfather's only son is A's father. His son is A's brother.", opts: ["Brother", "Cousin", "Uncle", "Nephew"] },
        { q: "Pointing to a woman, a man says, 'She is the mother-in-law of my only son's wife'.", a: "His Wife", ex: "Son's wife's mother-in-law is the man's wife.", opts: ["His Wife", "His Mother", "His Sister", "His Daughter"] },
        { q: "How is my mother's sister's only sibling related to me?", a: "Mother", ex: "Mother's sister's only sibling is the mother herself.", opts: ["Mother", "Aunt", "Grandmother", "Cousin"] },
        { q: "A man pointing to a lady says, 'She is my nephew's maternal grandmother'.", a: "His Mother", ex: "Nephew's maternal grandmother is the sister's/wife's mother. Usually implies His Mother in this context.", opts: ["His Mother", "His Sister", "His Aunt", "His Wife"] },
        { q: "Looking at a portrait, a man said, 'I have no brother/sister but that man's father is my father's son'.", a: "His Son", ex: "My father's son (me) is the portrait man's father.", opts: ["His Son", "His Father", "Himself", "His Uncle"] },
        { q: "Pointing to a lady, Meera said, 'Her father's only son's wife is my mother-in-law'.", a: "Husband's Sister", ex: "Mother-in-law's husband is the lady's father. Lady is the husband's sister.", opts: ["Husband's Sister", "Sister", "Aunt", "Mother"] },
        { q: "Deepak told Nitin, 'That boy playing is the younger of the two brothers of the daughter of my father's wife'.", a: "Brother", ex: "Father's wife's daughter is sister. Her brother is Deepak's brother.", opts: ["Brother", "Son", "Cousin", "Nephew"] },
        { q: "Pointing to a photograph, Vipul said, 'She is the daughter of my grandfather's only son'.", a: "Sister", ex: "Grandfather's only son is father. His daughter is sister.", opts: ["Sister", "Cousin", "Aunt", "Niece"] },
        { q: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother'.", a: "Her Mother", ex: "Only daughter of my mother is the woman herself. She is the man's mother.", opts: ["Her Son", "Her Brother", "Her Husband", "Her Father"] }
    ];

    const MEDIUM_POOL = [
        { q: "M is the sister of N. O is the father of M. P is the son of N. Relationship O to P?", a: "Grandfather", ex: "O is father of N. P is son of N. O is grandfather.", opts: ["Grandfather", "Father", "Uncle", "Great Grandfather"] },
        { q: "Pointing to K, M says, 'He is the son of the only son of my grandfather'.", a: "Brother", ex: "Only son of grandfather is usually father. His son is brother.", opts: ["Brother", "Uncle", "Father", "Son"] },
        { q: "A + B means A is sister of B. A - B means A is father of B. What does X + Y - Z mean?", a: "X is aunt of Z", ex: "Y is father of Z. X is sister of Y. X is Z's aunt.", opts: ["X is aunt of Z", "X is mother of Z", "X is sister of Z", "X is daughter of Z"] },
        { q: "If P is the husband of Q and R is the mother of S and Q, what is R to P?", a: "Mother-in-law", ex: "R is mother of P's wife Q. So R is mother-in-law.", opts: ["Mother-in-law", "Aunt", "Mother", "Sister-in-law"] },
        { q: "Pointing to a lady, a man said, 'The son of her only brother is the brother of my wife'.", a: "Aunt", ex: "Brother of wife is brother-in-law. His father is the lady's brother. Lady is aunt.", opts: ["Aunt", "Sister", "Mother", "Grandmother"] },
        { q: "A and B are married couple. X and Y are brothers. X is the brother of A. How is Y related to B?", a: "Brother-in-law", ex: "X is A's brother, Y is X's brother. So Y is A's brother and B's brother-in-law.", opts: ["Brother-in-law", "Brother", "Cousin", "Uncle"] },
        { q: "A is the brother of B; B is the sister of C; and C is the father of D. How is A related to D?", a: "Uncle", ex: "A is brother of C (D's father). A is uncle.", opts: ["Uncle", "Grandfather", "Father", "Brother"] },
        { q: "A is B's brother, C is A's mother, D is C's father. How is D related to A?", a: "Grandfather", ex: "D is mother's father. So D is grandfather.", opts: ["Grandfather", "Father", "Uncle", "Son"] },
        { q: "A is the father of B and C. B is the son of A. But C is not the son of A. What is C to A?", a: "Daughter", ex: "If C is A's child but not a son, C must be a daughter.", opts: ["Daughter", "Sister", "Niece", "Mother"] },
        { q: "If 'A $ B' is brother, 'A @ B' is wife, 'A # B' is daughter. What is P # R $ S?", a: "P is niece of S", ex: "R is brother of S. P is daughter of R. P is S's niece.", opts: ["P is niece of S", "P is sister of S", "P is daughter of S", "P is wife of S"] },
        { q: "A is C's son; C and Q are sisters; Z is the mother of Q. How is Z related to A?", a: "Grandmother", ex: "Z is mother of A's mother C. So Z is grandmother.", opts: ["Grandmother", "Mother", "Aunt", "Sister"] },
        { q: "Pointing to a man, a woman said, 'His brother's father is the only son of my grandfather'.", a: "Sister", ex: "Grandfather's only son is the woman's father. He is also the man's father. She is his sister.", opts: ["Sister", "Daughter", "Mother", "Aunt"] },
        { q: "If 'A + B' means A is son, 'A - B' means A is wife. What does P + R - Q mean?", a: "Q is father of P", ex: "R is wife of Q. P is son of R. So Q is father of P.", opts: ["Q is father of P", "Q is son of P", "Q is uncle of P", "Q is brother of P"] },
        { q: "A is the uncle of B, who is the daughter of C and C is the daughter-in-law of P. Relationship A to P?", a: "Son", ex: "C is daughter-in-law of P. A is brother of C. A is son of P.", opts: ["Son", "Brother", "Grandson", "Nephew"] },
        { q: "K is brother of N. X is sister of N. Y is mother of N. Z is father of K. How is Y to Z?", a: "Wife", ex: "Y is mother and Z is father of the same siblings. They are husband and wife.", opts: ["Wife", "Sister", "Mother", "Daughter"] }
    ];

    const HARD_POOL = [
        { q: "Pointing to a woman, a man said, 'Her mother is the only daughter of my mother-in-law.'", a: "Father", ex: "'Only daughter of my mother-in-law' is the man's wife. He is the woman's father.", opts: ["Father", "Uncle", "Brother", "Husband"] },
        { q: "A family has a man, wife, 3 sons with wives, and 3 children each. Total members?", a: "17", ex: "2(Parents) + 3(Sons) + 3(Wives) + 9(Grandchildren) = 17.", opts: ["17", "15", "12", "19"] },
        { q: "P is brother of Q and R. S is R's mother. T is P's father. Which is NOT true?", a: "Q is T's son", ex: "Q's gender is unknown. Cannot confirm 'son' without gender data.", opts: ["Q is T's son", "T is Q's father", "S is P's mother", "T is S's husband"] },
        { q: "A, B and C are sisters. D is the brother of E and E is the daughter of B. Relation A to D?", a: "Aunt", ex: "D and E are kids of B. A is B's sister. A is the aunt.", opts: ["Aunt", "Mother", "Sister", "Cousin"] },
        { q: "M is the son of P. Q is the granddaughter of O who is the husband of P. Relationship M to O?", a: "Son", ex: "O is husband of P. M is son of P. M is son of O.", opts: ["Son", "Grandson", "Father", "Nephew"] },
        { q: "Seven members: A-G. A is mother of B. B is sister of C. D is son of C. E is brother of D. F is mother of E. G is granddaughter of A. How is C related to F?", a: "Husband", ex: "C and F are parents of D and E. C is F's husband.", opts: ["Husband", "Brother", "Son", "Father"] },
        { q: "Family of 6: A-F. B is son of C (C is not mother). A, C married. E is brother of C. D is daughter of A. F is brother of B. Count males?", a: "4", ex: "C, B, E, F are males. A, D are females.", opts: ["4", "3", "2", "5"] },
        { q: "Q's mother is sister of P and daughter of M. S is daughter of P and sister of T. Relationship M to T?", a: "Grandparent", ex: "M is parent of P. T is child of P. M is grandparent.", opts: ["Grandparent", "Parent", "Aunt/Uncle", "Cousin"] },
        { q: "A is brother of B. C is father of D. E is mother of B. A and D are brothers. Relation B to E?", a: "Son/Daughter", ex: "B's mother is E. A, B, D are siblings. Level of relationship is child.", opts: ["Son/Daughter", "Nephew/Niece", "Brother/Sister", "Cousin"] },
        { q: "6 members P-U. 2 married couples. Q is father of T. U is grandfather of R. S is grandmother of T. P is mother of R. What is P's profession if there is one Nurse?", a: "Nurse", ex: "Logic dictates P (mother of R) fits the nurse profile in this balanced tree.", opts: ["Nurse", "Doctor", "Teacher", "Engineer"] },
        { q: "A is brother of B. C is father of A. D is brother of E. E is daughter of B. Uncle of D?", a: "A", ex: "B is parent of D and E. A is B's brother. So A is uncle.", opts: ["A", "C", "B", "E"] },
        { q: "Grandmother, father, mother, 4 sons + wives, and 1 son + 2 daughters each. Total females?", a: "14", ex: "1(GM) + 1(M) + 4(Wives) + 8(Grand-daughters) = 14.", opts: ["14", "12", "16", "18"] },
        { q: "Pointing to a man, Rohit said, 'His son is my son's uncle.' Relationship man to Rohit?", a: "Father", ex: "Son's uncle is Rohit's brother. The man is father of that brother.", opts: ["Father", "Father-in-law", "Brother", "Uncle"] },
        { q: "8 members A-H. A is G's father. B is C's mother. C is D's brother. E is D's wife. F is H's sister. G is F's daughter. H is A's son. Relation B to G?", a: "Grandmother", ex: "Tracing the tree reveals B is at the top tier grandparent level.", opts: ["Grandmother", "Mother", "Aunt", "Sister"] },
        { q: "A-F family. B is son of C. C is not mother. A and C married. E is brother of C. D is daughter of A. F is brother of B. Relation E to D?", a: "Uncle", ex: "E is brother of D's father C. E is uncle.", opts: ["Uncle", "Nephew", "Father", "Brother"] }
    ];

    const pool = diff === "EASY" ? EASY_POOL : diff === "MEDIUM" ? MEDIUM_POOL : HARD_POOL;
    
    return Array.from({ length: 15 }, (_, i) => {
        const data = pool[i];
        return {
            id: i + 1,
            title: `Neural Link ${i + 1}`,
            question: data.q,
            options: data.opts,
            correctAnswer: data.a,
            explanation: data.ex
        };
    });
};

export default function BloodRelationSimulator({ onComplete }: { onComplete: (score: number) => void }) {
    const [difficulty, setDifficulty] = useState<Difficulty>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<"SUCCESS" | "ERROR" | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const levels = useMemo(() => GENERATE_LEVELS(difficulty), [difficulty]);
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
                    <Users className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">LINEAGE MAPPING</h1>
                    <p className="text-primary/60 font-mono tracking-widest uppercase">Analyze complex neural connections and resolve lineage paradoxes.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {["EASY", "MEDIUM", "HARD"].map((d, i) => (
                        <motion.button
                            key={d}
                            whileHover={{ y: -10 }}
                            onClick={() => setDifficulty(d as Difficulty)}
                            className="p-10 rounded-[40px] border-2 border-white/5 bg-white/5 hover:border-primary/50 transition-all font-black text-2xl text-white"
                        >
                            <Network className="w-12 h-12 mx-auto mb-6 text-primary" />
                            {d}
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    if (isFinished) return <div className="text-center p-20 text-white">LINEAGE RESOLVED</div>;

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 text-red-500">
            <div className="flex justify-between items-start px-4 mb-4">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl border-2 border-red-500/30 bg-red-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <Activity className="w-8 h-8 text-red-500 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-3">
                            <span className="text-[10px] font-mono text-red-500/60 uppercase tracking-[0.3em]">Protocol:</span>
                            <span className="text-xl font-black text-white uppercase tracking-[0.2em]">{difficulty}</span>
                        </div>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">Active Neural Link</p>
                        
                        <div className="flex gap-2 pt-4">
                            {levels.map((_, i) => (
                                <motion.div 
                                    key={i}
                                    initial={false}
                                    animate={{ 
                                        backgroundColor: i <= currentIdx ? "rgba(34, 197, 94, 1)" : "rgba(255, 255, 255, 0.1)",
                                        width: i === currentIdx ? 48 : 24
                                    }}
                                    className={cn(
                                        "h-2 rounded-full transition-all duration-500",
                                        i === currentIdx && "shadow-[0_0_15px_rgba(34, 197, 94, 0.6)]"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    onClick={() => setDifficulty(null)} 
                    className="text-[10px] font-mono text-red-500 opacity-40 hover:opacity-100 mt-2 tracking-widest hover:bg-red-500/10"
                >
                    ABORT_TASK
                </Button>
            </div>
            <div className="bg-white/[0.02] border-2 border-white/10 rounded-[50px] p-16 min-h-[500px] flex flex-col items-center justify-center relative backdrop-blur-md">
                {feedback === "ERROR" ? (
                    <div className="flex flex-col items-center text-center py-10">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-8">❌</motion.div>
                        <h2 className="text-5xl font-black text-red-500 mb-6 uppercase tracking-tighter">Neural Desync</h2>
                        <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 mb-10 w-full text-left backdrop-blur-xl">
                            <p className="text-3xl text-white/90 leading-relaxed">
                                <span className="text-4xl mr-4">🧐</span> {level.explanation}
                            </p>
                        </div>
                        <Button onClick={nextLevel} size="xl" className="rounded-full px-16 h-20 text-xl">Understood</Button>
                    </div>
                ) : (
                    <div className="w-full text-center space-y-12">
                        <div className="inline-flex items-center gap-4 px-8 py-3 bg-red-500/10 rounded-full border border-red-500/20 text-red-500 font-mono text-xs uppercase tracking-[0.3em]">
                            <GitPullRequest className="w-4 h-4" />
                            Kinship Protocol: Processing
                        </div>

                        {/* Animated Kinship Network */}
                        <div className="relative h-64 w-full flex items-center justify-center overflow-hidden">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 opacity-10"
                            >
                                <div className="absolute inset-0 border-[1px] border-dashed border-red-500 rounded-full scale-50" />
                                <div className="absolute inset-0 border-[1px] border-dashed border-red-500 rounded-full scale-75" />
                                <div className="absolute inset-0 border-[1px] border-dashed border-red-500 rounded-full scale-110" />
                            </motion.div>

                            <div className="relative flex items-center gap-16">
                                {/* Subject A */}
                                <motion.div 
                                    animate={{ 
                                        y: [0, -15, 0],
                                        boxShadow: ["0 0 20px rgba(239, 68, 68, 0.2)", "0 0 50px rgba(239, 68, 68, 0.5)", "0 0 20px rgba(239, 68, 68, 0.2)"]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center backdrop-blur-md"
                                >
                                    <Users className="w-10 h-10 text-red-500" />
                                </motion.div>

                                {/* Connecting Line */}
                                <div className="w-32 h-1 bg-gradient-to-r from-red-500 via-transparent to-red-500 relative">
                                    <motion.div 
                                        animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-400 rounded-full blur-md"
                                    />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-black text-[8px] font-mono text-red-500 border border-red-500/30 rounded-full uppercase">
                                        LINKING
                                    </div>
                                </div>

                                {/* Subject B */}
                                <motion.div 
                                    animate={{ 
                                        y: [0, 15, 0],
                                        boxShadow: ["0 0 20px rgba(239, 68, 68, 0.2)", "0 0 50px rgba(239, 68, 68, 0.5)", "0 0 20px rgba(239, 68, 68, 0.2)"]
                                    }}
                                    transition={{ duration: 4, delay: 1, repeat: Infinity }}
                                    className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center backdrop-blur-md"
                                >
                                    <Heart className="w-10 h-10 text-red-500/60" />
                                </motion.div>
                            </div>
                        </div>

                        <h3 className="text-3xl font-bold text-white max-w-4xl mx-auto leading-relaxed">{level.question}</h3>
                        <div className="grid grid-cols-2 gap-8 pt-6 px-20">
                            {level.options.map((opt, i) => (
                                <motion.button
                                    key={i} onClick={() => handleCheck(opt)}
                                    className={cn(
                                        "p-10 rounded-[35px] border-2 transition-all font-black text-2xl", 
                                        selected === opt 
                                            ? (opt === level.correctAnswer ? "border-green-500 bg-green-500/20 text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.4)]" : "border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]")
                                            : "border-white/10 bg-white/5 text-white/80 hover:border-red-500/30"
                                    )}
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <AnimatePresence>
                {feedback === "SUCCESS" && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="flex flex-col items-center gap-8 py-10"
                    >
                        <motion.div 
                            animate={{ y: [0, -20, 0] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-[120px] leading-none mb-4"
                        >
                            ✅
                        </motion.div>
                        <p className="text-4xl font-black text-green-500 uppercase tracking-[0.5em] animate-pulse">
                            LINK CRYSTALLIZED
                        </p>
                        <Button 
                            onClick={nextLevel} 
                            size="xl" 
                            className="bg-red-600 hover:bg-red-500 text-white px-32 py-12 rounded-full text-3xl font-black shadow-[0_30px_80px_rgba(220,38,38,0.4)] group transition-all"
                        >
                            NEXT QUESTION 🚀
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
