import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, User } from "lucide-react";
import { useLocation } from "wouter";

export default function Blog() {
  const { data: posts = [], isLoading } = trpc.blog.list.useQuery();
  const [, setLocation] = useLocation();
  const [selectedPost, setSelectedPost] = useState<any>(null);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => setSelectedPost(null)}
            className="mb-8"
          >
            ← Voltar
          </Button>

          <article className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-cyan-400 mb-4">{selectedPost.title}</h1>
              <div className="flex gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(selectedPost.createdAt).toLocaleDateString("pt-BR")}
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  Dark System
                </div>
              </div>
            </div>

            {selectedPost.imageUrl && (
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full rounded-lg border border-cyan-500/50"
              />
            )}

            <div className="prose prose-invert max-w-none">
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </p>
            </div>

            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                Categoria: <span className="text-cyan-400 font-semibold">{selectedPost.category}</span>
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-cyan-400">📰 BLOG DARK SYSTEM</h1>
          <p className="text-muted-foreground mt-2">Notícias, atualizações e histórias do underground</p>
        </div>

        {/* POSTS GRID */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Nenhum post publicado ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="hover:border-cyan-500 transition cursor-pointer group"
                onClick={() => setSelectedPost(post)}
              >
                <CardContent className="pt-4">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-lg mb-4 group-hover:opacity-80 transition"
                    />
                  )}

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-cyan-400 line-clamp-2 group-hover:text-cyan-300 transition">
                      {post.title}
                    </h3>

                    <p className="text-sm text-foreground/70 line-clamp-3">
                      {post.description || post.content.substring(0, 100) + "..."}
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 group-hover:border-cyan-500 group-hover:text-cyan-400"
                    >
                      Ler Mais →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
