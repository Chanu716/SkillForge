import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    // Hash password
    const hashed = await hash(password, 10);
    // Create user
    await prisma.user.create({
      data: { name, email, password: hashed, progress: JSON.stringify({}) },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
