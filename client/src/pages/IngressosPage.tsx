import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

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
        ctx.fillStyle = "rgba(0, 255, 166, 0.6)";
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

export default function IngressosPage() {
  const [, setLocation] = useLocation();

  const ingressos = [
    {
      tipo: "INGRESSO INTEIRA",
      preco: "R$ 150,00",
      descricao: "Acesso completo ao evento",
      beneficios: ["Entrada livre", "Acesso à pista", "Bar e bebidas"],
      cor: "#00d9ff",
    },
    {
      tipo: "MEIA ENTRADA",
      preco: "R$ 75,00",
      descricao: "Meia entrada válida com documento",
      beneficios: ["Entrada com desconto", "Acesso à pista", "Bar e bebidas"],
      cor: "#00ffa6",
      destaque: true,
    },
    {
      tipo: "VIP PREMIUM",
      preco: "R$ 300,00",
      descricao: "Experiência exclusiva VIP",
      beneficios: ["Área VIP privativa", "Open bar", "Estacionamento", "Cortesia"],
      cor: "#ff7a18",
    },
  ];

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
          borderBottom: "1px solid rgba(0, 255, 166, 0.2)",
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
          <span style={{ color: "#00ffa6", fontSize: "18px", fontWeight: "bold", letterSpacing: "2px" }}>
            INGRESSOS
          </span>
        </div>
        <button
          onClick={() => setLocation("/")}
          style={{
            background: "transparent",
            border: "1px solid #00ffa6",
            color: "#00ffa6",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 12px #00ffa6";
            e.currentTarget.style.background = "rgba(0, 255, 166, 0.1)";
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
          background: "radial-gradient(circle at center, rgba(0, 255, 166, 0.1), transparent 70%)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            color: "#00ffa6",
            marginBottom: "10px",
            letterSpacing: "3px",
            textShadow: "0 0 20px rgba(0, 255, 166, 0.5)",
          }}
        >
          INGRESSOS DARK SYSTEM
        </h1>
        <p style={{ color: "#aaa", fontSize: "14px", letterSpacing: "1px" }}>
          Escolha seu tipo de ingresso e garanta sua presença
        </p>
      </div>

      {/* INGRESSOS GRID */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          {ingressos.map((ingresso, idx) => (
            <div
              key={idx}
              style={{
                background: ingresso.destaque
                  ? `linear-gradient(135deg, rgba(0, 255, 166, 0.1), rgba(0, 255, 166, 0.05))`
                  : `linear-gradient(135deg, rgba(${ingresso.cor === "#00d9ff" ? "0, 217, 255" : "255, 122, 24"}, 0.05), rgba(${ingresso.cor === "#00d9ff" ? "0, 217, 255" : "255, 122, 24"}, 0.02))`,
                border: `2px solid ${ingresso.cor}`,
                borderRadius: "12px",
                padding: "30px 24px",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s",
                boxShadow: ingresso.destaque ? `0 0 30px ${ingresso.cor}40` : `0 0 20px ${ingresso.cor}00`,
                transform: ingresso.destaque ? "scale(1.05)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px ${ingresso.cor}60`;
                e.currentTarget.style.transform = ingresso.destaque ? "scale(1.08)" : "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = ingresso.destaque ? `0 0 30px ${ingresso.cor}40` : `0 0 20px ${ingresso.cor}00`;
                e.currentTarget.style.transform = ingresso.destaque ? "scale(1.05)" : "scale(1)";
              }}
            >
              {ingresso.destaque && (
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: ingresso.cor,
                    color: "#000",
                    padding: "4px 16px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                  }}
                >
                  ⭐ MAIS POPULAR
                </div>
              )}

              <h3
                style={{
                  color: ingresso.cor,
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  marginTop: ingresso.destaque ? "16px" : "0",
                  letterSpacing: "1px",
                }}
              >
                {ingresso.tipo}
              </h3>

              <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "20px" }}>
                {ingresso.descricao}
              </p>

              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: ingresso.cor,
                  marginBottom: "20px",
                  textShadow: `0 0 10px ${ingresso.cor}`,
                }}
              >
                {ingresso.preco}
              </div>

              <div style={{ marginBottom: "24px" }}>
                {ingresso.beneficios.map((beneficio, bidx) => (
                  <div key={bidx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                    <span style={{ color: ingresso.cor, fontSize: "16px" }}>✓</span>
                    <span style={{ color: "#aaa", fontSize: "13px" }}>{beneficio}</span>
                  </div>
                ))}
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  background: `linear-gradient(135deg, ${ingresso.cor}, ${ingresso.cor}dd)`,
                  color: ingresso.cor === "#ff7a18" ? "#000" : "#000",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s",
                  letterSpacing: "1px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 20px ${ingresso.cor}`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                COMPRAR AGORA
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* INFO SECTION */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "60px auto 0",
          padding: "40px 20px",
          borderTop: "1px solid rgba(0, 255, 166, 0.2)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#00ffa6", fontSize: "24px", marginBottom: "20px", letterSpacing: "2px" }}>
          INFORMAÇÕES IMPORTANTES
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(0, 255, 166, 0.05)",
              border: "1px solid rgba(0, 255, 166, 0.2)",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#00ffa6", marginBottom: "10px", fontSize: "16px" }}>📍 LOCAL</h3>
            <p style={{ color: "#aaa", fontSize: "13px", lineHeight: "1.6" }}>
              Endereço do evento será confirmado após a compra do ingresso
            </p>
          </div>
          <div
            style={{
              background: "rgba(0, 255, 166, 0.05)",
              border: "1px solid rgba(0, 255, 166, 0.2)",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#00ffa6", marginBottom: "10px", fontSize: "16px" }}>⏰ HORÁRIO</h3>
            <p style={{ color: "#aaa", fontSize: "13px", lineHeight: "1.6" }}>
              Abertura das portas às 22h00 | Encerramento às 06h00
            </p>
          </div>
          <div
            style={{
              background: "rgba(0, 255, 166, 0.05)",
              border: "1px solid rgba(0, 255, 166, 0.2)",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#00ffa6", marginBottom: "10px", fontSize: "16px" }}>📞 SUPORTE</h3>
            <p style={{ color: "#aaa", fontSize: "13px", lineHeight: "1.6" }}>
              Dúvidas? Contate-nos no WhatsApp: (21) 99224-4319
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "60px",
          padding: "40px 20px",
          borderTop: "1px solid rgba(0, 255, 166, 0.2)",
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
