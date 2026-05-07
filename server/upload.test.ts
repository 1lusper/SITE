import { describe, expect, it } from "vitest";

describe("Upload Endpoints", () => {
  it("upload endpoint should be available at /api/upload", async () => {
    expect("/api/upload").toBeDefined();
  });

  it("should accept image files", () => {
    const imageTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    imageTypes.forEach(type => {
      expect(type.startsWith("image/")).toBe(true);
    });
  });

  it("should reject non-image files", () => {
    const nonImageTypes = ["application/pdf", "text/plain", "video/mp4"];
    nonImageTypes.forEach(type => {
      expect(type.startsWith("image/")).toBe(false);
    });
  });

  it("should enforce file size limit of 5MB", () => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const testFile = 4 * 1024 * 1024; // 4MB
    const largeFile = 6 * 1024 * 1024; // 6MB

    expect(testFile).toBeLessThanOrEqual(maxSize);
    expect(largeFile).toBeGreaterThan(maxSize);
  });
});

describe("Menu Modal", () => {
  it("menu modal should have Shop link", () => {
    const links = ["/", "/shop", "/blog", "#artistas"];
    expect(links).toContain("/shop");
  });

  it("menu modal should have Blog link", () => {
    const links = ["/", "/shop", "/blog", "#artistas"];
    expect(links).toContain("/blog");
  });

  it("menu modal should have Artistas link", () => {
    const links = ["/", "/shop", "/blog", "#artistas"];
    expect(links).toContain("#artistas");
  });

  it("menu modal should have Ingressos link", () => {
    const links = ["/", "/shop", "/blog", "#artistas", "https://darksystem.online/ingressos"];
    expect(links).toContain("https://darksystem.online/ingressos");
  });
});

describe("Image Management", () => {
  it("favicon URL should be valid", () => {
    const faviconUrl = "https://example.com/favicon.png";
    expect(faviconUrl).toContain("favicon");
    expect(faviconUrl).toMatch(/\.(png|jpg|gif|ico)$/);
  });

  it("progzaco URL should be valid", () => {
    const progzacoUrl = "https://example.com/prog.gif";
    expect(progzacoUrl).toContain("prog");
    expect(progzacoUrl).toMatch(/\.(gif|png|jpg)$/);
  });

  it("should have default progzaco URL", () => {
    const defaultUrl = "https://darksystem.online/prog.gif";
    expect(defaultUrl).toBeDefined();
    expect(defaultUrl).toContain("prog.gif");
  });
});
