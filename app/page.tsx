"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

export default function Home() {
    const router = useRouter();
    const setMode = useGameStore((state) => state.setMode);

    const handleStart = () => {
        setMode("LEARNING_HOME");
        router.push("/auth");
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center relative overflow-hidden pb-32">
            {/* Animated Background */}
            <AnimatedBackground />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white font-display">
                        SKILL<span className="text-primary">FORGE</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-[600px] mx-auto tracking-wide"
                >
                    Where abstract concepts become concrete structures.
                </motion.p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-16 mb-12"
            >
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        size="xl"
                        variant="cyber"
                        onClick={handleStart}
                        className="group relative overflow-hidden"
                    >
                        <span className="relative z-10">Initiate Protocol</span>
                        <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                </motion.div>
            </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-6 left-0 right-0 text-center text-xs text-muted-foreground/30 uppercase tracking-[0.2em]"
            >
                System Status: Online | Version 0.1.0
            </motion.div>
        </main>
    );
}
