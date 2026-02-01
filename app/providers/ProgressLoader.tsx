"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGameStore } from "@/store/gameStore";

export function ProgressLoader() {
  const { data: session, status } = useSession();
  const loadProgressFromBackend = useGameStore((state) => state.loadProgressFromBackend);
  const setUsername = useGameStore((state) => state.setUsername);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Load progress from backend first
      loadProgressFromBackend().then(() => {
        // Then set username from session (this ensures it doesn't get overwritten)
        if (session.user) {
          const userName = session.user.name || session.user.email?.split('@')[0] || 'User';
          setUsername(userName);
        }
      });
    }
  }, [status, session, loadProgressFromBackend, setUsername]);

  return null; // This component only manages side effects
}
