import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@darksystem.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Blog CRUD", () => {
  it("admin can create a blog post", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.create({
      title: "Test Post",
      slug: "test-post",
      category: "noticia",
      description: "Test description",
      content: "Test content",
      published: 1,
    });

    expect(result).toBeDefined();
    expect(result?.title).toBe("Test Post");
  });

  it("public can list blog posts", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("public can get post by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.getBySlug({ slug: "test-post" });

    expect(result === undefined || result?.slug === "test-post").toBe(true);
  });
});

describe("Footer Config", () => {
  it("public can get footer config", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.footer.get();

    expect(result === null || typeof result === "object").toBe(true);
  });

  it("admin can update footer config", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.footer.update({
      phone: "(21) 99999-9999",
      email: "test@darksystem.com",
    });

    expect(result).toBeDefined();
  });
});

describe("Analytics", () => {
  it("public can track events", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.track({
      event: "page_view",
      metadata: { page: "/" },
    });

    expect(result).toBeDefined();
  });
});
