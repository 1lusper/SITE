import { eq, desc } from "drizzle-orm";
import { blogPosts, analytics, footerConfig, InsertBlogPost, BlogPost, InsertAnalytics, Analytics, InsertFooterConfig, FooterConfig } from "../drizzle/schema";
import { getDb } from "./db";

// ─── BLOG POSTS ──────────────────────────────────────────────────────────────
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(blogPosts).where(eq(blogPosts.published, 1)).orderBy(desc(blogPosts.createdAt));
  } catch (error) {
    console.error("[DB] Failed to get blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  try {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  } catch (error) {
    console.error("[DB] Failed to get blog post:", error);
    return undefined;
  }
}

export async function createBlogPost(data: InsertBlogPost): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    await db.insert(blogPosts).values(data);
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, data.slug)).limit(1);
    return result[0] ?? null;
  } catch (error) {
    console.error("[DB] Failed to create blog post:", error);
    return null;
  }
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0] ?? null;
  } catch (error) {
    console.error("[DB] Failed to update blog post:", error);
    return null;
  }
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  } catch (error) {
    console.error("[DB] Failed to delete blog post:", error);
    return false;
  }
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
export async function trackEvent(event: string, userId?: number, metadata?: any): Promise<Analytics | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(analytics).values({
      event,
      userId,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
    });
    return result[0] as any;
  } catch (error) {
    console.error("[DB] Failed to track event:", error);
    return null;
  }
}

export async function getAnalyticsByEvent(event: string, days: number = 30): Promise<Analytics[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return await db.select().from(analytics).where(eq(analytics.event, event));
  } catch (error) {
    console.error("[DB] Failed to get analytics:", error);
    return [];
  }
}

// ─── FOOTER CONFIG ───────────────────────────────────────────────────────────
export async function getFooterConfig(): Promise<FooterConfig | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(footerConfig).limit(1);
    return result[0] ?? null;
  } catch (error) {
    console.error("[DB] Failed to get footer config:", error);
    return null;
  }
}

export async function updateFooterConfig(data: Partial<InsertFooterConfig>): Promise<FooterConfig | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const existing = await getFooterConfig();
    if (existing) {
      await db.update(footerConfig).set(data).where(eq(footerConfig.id, existing.id));
      const result = await db.select().from(footerConfig).where(eq(footerConfig.id, existing.id)).limit(1);
      return result[0] ?? null;
    } else {
      await db.insert(footerConfig).values(data);
      const result = await db.select().from(footerConfig).limit(1);
      return result[0] ?? null;
    }
  } catch (error) {
    console.error("[DB] Failed to update footer config:", error);
    return null;
  }
}
