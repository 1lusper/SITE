import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { siteConfig, SiteConfig, InsertSiteConfig } from "../drizzle/schema";

export async function getSiteConfig(): Promise<SiteConfig | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(siteConfig).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSiteConfig(data: Partial<InsertSiteConfig>): Promise<SiteConfig | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await getSiteConfig();
  
  if (!existing) {
    // Criar novo registro
    const result = await db.insert(siteConfig).values(data as InsertSiteConfig);
    return await getSiteConfig();
  } else {
    // Atualizar registro existente
    await db.update(siteConfig).set(data).where(eq(siteConfig.id, existing.id));
    return await getSiteConfig();
  }
}

export async function updateSiteTitle(title: string): Promise<SiteConfig | undefined> {
  return updateSiteConfig({ title });
}

export async function updateSiteBannerImage(url: string): Promise<SiteConfig | undefined> {
  return updateSiteConfig({ bannerImageUrl: url });
}

export async function updateVideoBannerImage(url: string): Promise<SiteConfig | undefined> {
  return updateSiteConfig({ videoBannerImageUrl: url });
}

export async function updateFavicon(url: string): Promise<SiteConfig | undefined> {
  return updateSiteConfig({ faviconUrl: url });
}

export async function updateProgzacoImage(url: string): Promise<SiteConfig | undefined> {
  return updateSiteConfig({ progzacoImageUrl: url });
}

export async function toggleCupons(show: boolean): Promise<SiteConfig | undefined> {
  return updateSiteConfig({ showCupons: show ? 1 : 0 });
}

export async function toggleVideoBanner(show: boolean): Promise<SiteConfig | undefined> {
  return updateSiteConfig({ showVideoBanner: show ? 1 : 0 });
}
