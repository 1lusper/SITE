import { eq } from "drizzle-orm";
import { artists, InsertArtist, Artist } from "../drizzle/schema";
import { getDb } from "./db";

export async function getAllArtists(): Promise<Artist[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(artists).orderBy(artists.createdAt);
  } catch (error) {
    console.error("[DB] Failed to get artists:", error);
    return [];
  }
}

export async function getArtistById(id: number): Promise<Artist | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  try {
    const result = await db.select().from(artists).where(eq(artists.id, id)).limit(1);
    return result[0];
  } catch (error) {
    console.error("[DB] Failed to get artist:", error);
    return undefined;
  }
}

export async function createArtist(data: InsertArtist): Promise<Artist | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    await db.insert(artists).values(data);
    const result = await db.select().from(artists).where(eq(artists.name, data.name)).limit(1);
    return result[0] ?? null;
  } catch (error) {
    console.error("[DB] Failed to create artist:", error);
    return null;
  }
}

export async function updateArtist(id: number, data: Partial<InsertArtist>): Promise<Artist | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    await db.update(artists).set(data).where(eq(artists.id, id));
    return (await getArtistById(id)) ?? null;
  } catch (error) {
    console.error("[DB] Failed to update artist:", error);
    return null;
  }
}

export async function deleteArtist(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.delete(artists).where(eq(artists.id, id));
    return true;
  } catch (error) {
    console.error("[DB] Failed to delete artist:", error);
    return false;
  }
}
