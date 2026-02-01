"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AnimatedBackground({ imageSrc = "/backgrounds/bg.png" }: { imageSrc?: string }) {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Background Image with Glow/Dim Effect */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    opacity: [0.3, 0.6, 0.3], // Reduced opacity for darker bg
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <Image
                    src={imageSrc}
                    alt="Background"
                    fill
                    className="object-cover brightness-50" // Added brightness reduction
                    priority
                    quality={90}
                    unoptimized
                />
            </motion.div>

            {/* Subtle Floating Light Particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-white/40 rounded-full blur-sm"
                    style={{
                        left: `${20 + i * 12}%`,
                        top: `${30 + (i % 3) * 20}%`,
                    }}
                    animate={{
                        y: [-20, -40, -20],
                        opacity: [0.1, 0.4, 0.1],
                        scale: [0.5, 1.2, 0.5],
                    }}
                    transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/20 to-background/80" />
            
            {/* Bottom Fade */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
        </div>
    );
}
