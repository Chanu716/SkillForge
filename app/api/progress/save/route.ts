import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { saveProgress } from "@/lib/progress";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const progress = await req.json();
    const userId = session.user.id as string;
    const result = await saveProgress(userId, progress);
    if (result.success) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
