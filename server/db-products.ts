import { eq } from "drizzle-orm";
import { products, InsertProduct, Product } from "../drizzle/schema";
import { getDb } from "./db";

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(products).orderBy(products.createdAt);
  } catch (error) {
    console.error("[DB] Failed to get products:", error);
    return [];
  }
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  try {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  } catch (error) {
    console.error("[DB] Failed to get product:", error);
    return undefined;
  }
}

export async function createProduct(data: InsertProduct): Promise<Product | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    await db.insert(products).values(data);
    const result = await db.select().from(products).where(eq(products.name, data.name)).limit(1);
    return result[0] ?? null;
  } catch (error) {
    console.error("[DB] Failed to create product:", error);
    return null;
  }
}

export async function updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    await db.update(products).set(data).where(eq(products.id, id));
    return (await getProductById(id)) ?? null;
  } catch (error) {
    console.error("[DB] Failed to update product:", error);
    return null;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.delete(products).where(eq(products.id, id));
    return true;
  } catch (error) {
    console.error("[DB] Failed to delete product:", error);
    return false;
  }
}
