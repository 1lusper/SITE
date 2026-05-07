import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

function createAdminContext(): TrpcContext {
  const admin: User = {
    id: 1,
    openId: "admin-user",
    email: "admin@test.com",
    name: "Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: admin,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("config router", () => {
  it("should get site config", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const config = await caller.config.get();
    expect(config).toBeDefined();
  });

  it("should update site title", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.config.updateTitle({ title: "Dark System 2026" });
    expect(result?.title).toBe("Dark System 2026");
  });

  it("should update video banner image", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.config.updateVideoBannerImage({
      url: "https://example.com/new-banner.png",
    });
    expect(result?.videoBannerImageUrl).toBe("https://example.com/new-banner.png");
  });

  it("should update favicon", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.config.updateFavicon({
      url: "https://example.com/favicon.ico",
    });
    expect(result?.faviconUrl).toBe("https://example.com/favicon.ico");
  });

  it("should update progzaco image", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.config.updateProgzacoImage({
      url: "https://example.com/progzaco.gif",
    });
    expect(result?.progzacoImageUrl).toBe("https://example.com/progzaco.gif");
  });
});
