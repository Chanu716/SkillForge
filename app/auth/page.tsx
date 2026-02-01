"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { User, UserPlus, Ghost } from "lucide-react";
import AnimatedBackground from "@/components/landing/AnimatedBackground";

export default function AuthSelectionPage() {
    const router = useRouter();
    const setUsername = useGameStore((state) => state.setUsername);

    const handleGuest = () => {
        setUsername("Guest Operator");
        router.push("/dashboard");
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <AnimatedBackground imageSrc="/backgrounds/bg.png" />
            
            <div className="relative z-10 w-full max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white mb-4">
                        Secure Connection Required
                    </h1>
                    <p className="text-xl text-muted-foreground">Select your entry protocol.</p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
                >
                    {/* Login */}
                    <motion.div variants={item}>
                        <div
                            onClick={() => router.push('/login')}
                            className="group bg-black/40 border border-white/10 hover:border-primary/50 p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 backdrop-blur-sm h-full flex flex-col items-center gap-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Operator Login</h3>
                                <p className="text-sm text-muted-foreground">Access existing neural profile and progress.</p>
                            </div>
                            <Button variant="ghost" className="w-full mt-auto group-hover:text-primary">Proceed &rarr;</Button>
                        </div>
                    </motion.div>

                    {/* Signup */}
                    <motion.div variants={item}>
                        <div
                            onClick={() => router.push('/signup')}
                            className="group bg-black/40 border border-white/10 hover:border-secondary/50 p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 backdrop-blur-sm h-full flex flex-col items-center gap-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                                <UserPlus className="w-8 h-8 text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Initialize Node</h3>
                                <p className="text-sm text-muted-foreground">Create a new identity and begin tracking.</p>
                            </div>
                            <Button variant="ghost" className="w-full mt-auto group-hover:text-secondary">Register &rarr;</Button>
                        </div>
                    </motion.div>

                    {/* Guest */}
                    <motion.div variants={item}>
                        <div
                            onClick={handleGuest}
                            className="group bg-black/40 border border-white/10 hover:border-white/30 p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 backdrop-blur-sm h-full flex flex-col items-center gap-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <Ghost className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Guest Access</h3>
                                <p className="text-sm text-muted-foreground">Temporary clearance. Progress is volatile.</p>
                            </div>
                            <Button variant="ghost" className="w-full mt-auto">Enter &rarr;</Button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
