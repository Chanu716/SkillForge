import { PrismaClient } from "@prisma/client";
import { GameState } from "@/store/gameStore";

const prisma = new PrismaClient();

/**
 * Save user progress to database
 */
export async function saveProgress(userId: string, progress: Partial<GameState>) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { progress: JSON.stringify(progress) },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to save progress:", error);
    return { success: false, error };
  }
}

/**
 * Load user progress from database
 */
export async function loadProgress(userId: string): Promise<Partial<GameState> | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { progress: true },
    });
    if (!user || !user.progress) return null;
    return JSON.parse(user.progress) as Partial<GameState>;
  } catch (error) {
    console.error("Failed to load progress:", error);
    return null;
  }
}
