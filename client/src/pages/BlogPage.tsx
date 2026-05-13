import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = "rgba(0,217,255,0.6)";
        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }} />;
}

export default function BlogPage() {
  const [, setLocation] = useLocation();
  const { data: posts = [], isLoading } = trpc.blog.list.useQuery();

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#000" }}>
      <ParticlesCanvas />

      {/* NAVBAR */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          background: "linear-gradient(180deg, rgba(0,0,0,0.95), rgba(0,0,0,0.7))",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          borderBottom: "1px solid rgba(0, 217, 255, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => setLocation("/")}
        >
          <img
            src="https://darksystem.online/AMG.png"
            alt="Dark System"
            style={{ height: "40px", width: "auto" }}
          />
          <span style={{ color: "#00d9ff", fontSize: "18px", fontWeight: "bold", letterSpacing: "2px" }}>
            BLOG
          </span>
        </div>
        <button
          onClick={() => setLocation("/")}
          style={{
            background: "transparent",
            border: "1px solid #00d9ff",
            color: "#00d9ff",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 12px #00d9ff";
            e.currentTarget.style.background = "rgba(0, 217, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.background = "transparent";
          }}
        >
          ← VOLTAR
        </button>
      </nav>

      {/* HEADER */}
      <div
        style={{
          paddingTop: "100px",
          paddingBottom: "40px",
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(0, 217, 255, 0.1), transparent 70%)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            color: "#00d9ff",
            marginBottom: "10px",
            letterSpacing: "3px",
            textShadow: "0 0 20px rgba(0, 217, 255, 0.5)",
          }}
        >
          NOTÍCIAS & ATUALIZAÇÕES
        </h1>
        <p style={{ color: "#aaa", fontSize: "14px", letterSpacing: "1px" }}>
          Fique por dentro dos eventos, artistas e novidades do Dark System
        </p>
      </div>

      {/* POSTS GRID */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Loader2 style={{ animation: "spin 1s linear infinite", color: "#00d9ff", width: "40px", height: "40px" }} />
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#aaa",
              border: "1px dashed rgba(0, 217, 255, 0.3)",
              borderRadius: "8px",
            }}
          >
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>Nenhuma notícia publicada ainda</p>
            <p style={{ fontSize: "12px" }}>Volte em breve para mais atualizações!</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: "linear-gradient(135deg, rgba(0, 217, 255, 0.05), rgba(0, 255, 166, 0.02))",
                  border: "1px solid rgba(0, 217, 255, 0.2)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 0 20px rgba(0, 217, 255, 0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 217, 255, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(0, 217, 255, 0.6)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 217, 255, 0)";
                  e.currentTarget.style.borderColor = "rgba(0, 217, 255, 0.2)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                  />
                )}
                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(0, 217, 255, 0.2)",
                        color: "#00d9ff",
                        padding: "4px 8px",
                        borderRadius: "3px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {post.category}
                    </span>
                  </div>
                  <h3
                    style={{
                      color: "#00d9ff",
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      lineHeight: "1.4",
                    }}
                  >
                    {post.title}
                  </h3>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      marginBottom: "12px",
                    }}
                  >
                    {post.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(0, 217, 255, 0.1)",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#666" }}>
                      {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <span style={{ color: "#00ffa6", fontSize: "12px", fontWeight: "bold" }}>LER MAIS →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "60px",
          padding: "40px 20px",
          borderTop: "1px solid rgba(0, 217, 255, 0.2)",
          textAlign: "center",
          color: "#666",
          fontSize: "12px",
        }}
      >
        <p>© Dark System {new Date().getFullYear()} - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
