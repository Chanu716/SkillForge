import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function saveUserProgress(userId: string, progress: any) {
  return prisma.user.update({
    where: { id: userId },
    data: { progress: JSON.stringify(progress) },
  });
}

export async function getUserProgress(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.progress ? JSON.parse(user.progress) : null;
}
