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

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@darksystem.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
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

describe("Artists CRUD", () => {
  it("admin can create an artist", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.artists.create({
      name: "Test Artist",
      genre: "HI-TECH",
      description: "Test description",
      imageUrl: "https://example.com/image.jpg",
      soundcloudUrl: "https://soundcloud.com/test",
      duration: "3H",
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Test Artist");
    expect(result?.genre).toBe("HI-TECH");
  });

  it("regular user cannot create an artist", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.artists.create({
        name: "Test Artist",
        genre: "HI-TECH",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("can list all artists", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.artists.list();

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Products CRUD", () => {
  it("admin can create a product", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.create({
      name: "Test Product",
      price: 15000, // R$ 150.00
      description: "Test product description",
      quantity: 100,
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Test Product");
    expect(result?.price).toBe(15000);
  });

  it("regular user cannot create a product", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.products.create({
        name: "Test Product",
        price: 15000,
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("can list all products", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.list();

    expect(Array.isArray(result)).toBe(true);
  });
});
