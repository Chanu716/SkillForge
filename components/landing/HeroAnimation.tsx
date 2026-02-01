"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";

export default function HeroAnimation() {
    const router = useRouter();
    const setMode = useGameStore((state) => state.setMode);
    const [animationComplete, setAnimationComplete] = useState(false);

    const handleStart = () => {
        setMode("LEARNING_HOME");
        router.push("/dashboard");
    };

    // Animation Variants
    const containerVariants: any = {
        hidden: { x: "-100vw" },
        visible: {
            x: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 40,
                duration: 3,
                delay: 0.5
            }
        }
    };

    const robotVariants: any = {
        walk: {
            y: [0, -5, 0],
            transition: {
                repeat: Infinity,
                duration: 0.4
            }
        },
        stand: {
            y: 0
        }
    };

    const legVariants: any = {
        walkLeft: {
            rotate: [15, -15, 15],
            transition: { repeat: Infinity, duration: 0.4 }
        },
        walkRight: {
            rotate: [-15, 15, -15],
            transition: { repeat: Infinity, duration: 0.4 }
        }
    };

    return (
        <div className="relative w-full max-w-6xl mx-auto h-[400px] flex items-center justify-center overflow-visible">

            {/* The Draggable Container (Logo + Robot) */}
            <motion.div
                className="relative flex items-center gap-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                onAnimationComplete={() => setAnimationComplete(true)}
            >
                {/* The Heavy Object (Logo) */}
                <div className="z-10 relative bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform -rotate-1 origin-bottom-right">
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 font-display">
                        SKILL<span className="text-primary">FORGE</span>
                    </h1>
                    <p className="text-xl text-muted-foreground tracking-wide mt-2 text-right">
                        Where Code Becomes Reality.
                    </p>
                </div>

                {/* Rope Component */}
                <svg className="w-32 h-12 absolute left-full top-1/2 -translate-y-1/2 z-0" style={{ overflow: 'visible' }}>
                    <motion.path
                        d="M 0 24 Q 60 48 120 24" // Catenary curve simulation
                        fill="transparent"
                        stroke="#888"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 1 }}
                        animate={animationComplete ? { d: "M 0 24 Q 60 40 120 24" } : { d: "M 0 24 Q 60 10 120 24" }} // Slacken when stopped
                        transition={{ duration: 0.5 }}
                    />
                </svg>

                {/* The Character (Robot) */}
                <motion.div
                    className="relative w-24 h-32 ml-32 z-20"
                    variants={robotVariants}
                    animate={animationComplete ? "stand" : "walk"}
                >
                    {/* Head */}
                    <div className="w-16 h-12 bg-gray-200 rounded-lg absolute top-0 left-4 border-2 border-white/50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <motion.div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" /> {/* Eye L */}
                        <motion.div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" /> {/* Eye R */}
                        {/* Antenna */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-gray-400">
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        </div>
                    </div>

                    {/* Body */}
                    <div className="w-12 h-14 bg-gray-300 rounded-xl absolute top-13 left-6 border-b-4 border-gray-400 shadow-inner flex flex-col items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-spin" style={{ borderRadius: '4px' }} />
                        </div>
                    </div>

                    {/* Arms (Pulling back) */}
                    <motion.div className="absolute top-14 left-0 w-8 h-3 bg-gray-400 rounded-full origin-right -rotate-12" /> {/* Right Arm */}
                    <motion.div className="absolute top-14 right-4 w-8 h-3 bg-gray-400 rounded-full origin-left rotate-[160deg]" /> {/* Left Arm holding rope */}

                    {/* Legs */}
                    <motion.div
                        className="w-4 h-10 bg-gray-400 rounded-full absolute top-24 left-6 origin-top"
                        variants={legVariants}
                        animate={animationComplete ? { rotate: 0 } : "walkLeft"}
                    />
                    <motion.div
                        className="w-4 h-10 bg-gray-400 rounded-full absolute top-24 right-8 origin-top"
                        variants={legVariants}
                        animate={animationComplete ? { rotate: 0 } : "walkRight"}
                    />
                </motion.div>

            </motion.div>

            {/* Start Button (Appears after drag) */}
            {animationComplete && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-32"
                >
                    <Button
                        size="xl"
                        variant="cyber"
                        onClick={handleStart}
                        className="px-12 py-8 text-xl"
                    >
                        START JOURNEY
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
