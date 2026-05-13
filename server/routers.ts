import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist } from "./db-artists";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "./db-products";
import { getAllBlogPosts, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost, getFooterConfig, updateFooterConfig, trackEvent } from "./db-content";
import { getUserByEmail, verifyPassword, createEmailUser } from "./db-email-auth";
import { getSiteConfig, updateSiteTitle, updateSiteBannerImage, updateVideoBannerImage, updateFavicon, updateProgzacoImage, toggleCupons, toggleVideoBanner } from "./db-config";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    emailLogin: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input }) => {
        const user = await verifyPassword(input.email, input.password);
        if (!user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou senha inválidos" });
        }
        return { success: true, user };
      }),
  }),

  artists: router({
    list: publicProcedure.query(() => getAllArtists()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => getArtistById(input.id)),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        genre: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        soundcloudUrl: z.string().optional(),
        duration: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create artists" });
        }
        return await createArtist(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        genre: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        soundcloudUrl: z.string().optional(),
        duration: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update artists" });
        }
        const { id, ...data } = input;
        return await updateArtist(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete artists" });
        }
        return await deleteArtist(input.id);
      }),
  }),

  products: router({
    list: publicProcedure.query(() => getAllProducts()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => getProductById(input.id)),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        price: z.number().positive(),
        description: z.string().optional(),
        quantity: z.number().nonnegative().optional(),
        pagseguroId: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create products" });
        }
        return await createProduct(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        price: z.number().positive().optional(),
        description: z.string().optional(),
        quantity: z.number().nonnegative().optional(),
        pagseguroId: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update products" });
        }
        const { id, ...data } = input;
        return await updateProduct(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete products" });
        }
        return await deleteProduct(input.id);
      }),
  }),

  blog: router({
    list: publicProcedure.query(() => getAllBlogPosts()),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getBlogPostBySlug(input.slug)),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        category: z.string().default("noticia"),
        description: z.string().optional(),
        content: z.string().min(1),
        imageUrl: z.string().optional(),
        published: z.number().default(0),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create posts" });
        }
        return await createBlogPost(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        published: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update posts" });
        }
        const { id, ...data } = input;
        return await updateBlogPost(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete posts" });
        }
        return await deleteBlogPost(input.id);
      }),
  }),

  footer: router({
    get: publicProcedure.query(() => getFooterConfig()),
    update: protectedProcedure
      .input(z.object({
        logoUrl: z.string().optional(),
        partnerText: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        instagramUrl: z.string().optional(),
        facebookUrl: z.string().optional(),
        whatsappUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update footer" });
        }
        return await updateFooterConfig(input);
      }),
  }),

  analytics: router({
    track: publicProcedure
      .input(z.object({
        event: z.string(),
        metadata: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        return await trackEvent(input.event, undefined, input.metadata);
      }),
  }),

  config: router({
    get: publicProcedure.query(() => getSiteConfig()),
    updateTitle: protectedProcedure
      .input(z.object({ title: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update config" });
        }
        return await updateSiteTitle(input.title);
      }),
    updateBannerImage: protectedProcedure
      .input(z.object({ url: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await updateSiteBannerImage(input.url);
      }),
    updateVideoBannerImage: protectedProcedure
      .input(z.object({ url: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await updateVideoBannerImage(input.url);
      }),
    updateFavicon: protectedProcedure
      .input(z.object({ url: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await updateFavicon(input.url);
      }),
    updateProgzacoImage: protectedProcedure
      .input(z.object({ url: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await updateProgzacoImage(input.url);
      }),
    toggleCupons: protectedProcedure
      .input(z.object({ show: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await toggleCupons(input.show);
      }),
    toggleVideoBanner: protectedProcedure
      .input(z.object({ show: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await toggleVideoBanner(input.show);
      }),
  }),
});

export type AppRouter = typeof appRouter;
