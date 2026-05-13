import { eq } from "drizzle-orm";
import { emailAuth, InsertEmailAuth, EmailAuth } from "../drizzle/schema";
import { getDb } from "./db";
import { createHash } from "crypto";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function createEmailUser(data: InsertEmailAuth): Promise<EmailAuth | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const hashedPassword = hashPassword(data.passwordHash);
    await db.insert(emailAuth).values({
      ...data,
      passwordHash: hashedPassword,
    });
    const result = await db.select().from(emailAuth).where(eq(emailAuth.email, data.email)).limit(1);
    return result[0] ?? null;
  } catch (error) {
    console.error("[DB] Failed to create email user:", error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<EmailAuth | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  try {
    const result = await db.select().from(emailAuth).where(eq(emailAuth.email, email)).limit(1);
    return result[0];
  } catch (error) {
    console.error("[DB] Failed to get user by email:", error);
    return undefined;
  }
}

export async function verifyPassword(email: string, password: string): Promise<EmailAuth | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const hashedPassword = hashPassword(password);
  if (hashedPassword === user.passwordHash) {
    return user;
  }
  return null;
}

export async function updateEmailUser(id: number, data: Partial<InsertEmailAuth>): Promise<EmailAuth | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const updateData: any = { ...data };
    if (data.passwordHash) {
      updateData.passwordHash = hashPassword(data.passwordHash);
    }
    await db.update(emailAuth).set(updateData).where(eq(emailAuth.id, id));
    const result = await db.select().from(emailAuth).where(eq(emailAuth.id, id)).limit(1);
    return result[0] ?? null;
  } catch (error) {
    console.error("[DB] Failed to update email user:", error);
    return null;
  }
}
