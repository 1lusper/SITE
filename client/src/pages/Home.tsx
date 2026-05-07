/*
 * DARK SYSTEM — Home Page
 * Design: "Circuito Vivo" (Cyberpunk Industrial)
 * Sections: Navbar | Hero | Prog GIF | Countdown + CTA | Artistas | Memorial | Footer
 * Fixed: Social Float | Custom Banner (YouTube) | Particles Canvas | Harm Modal
 */

import { useEffect, useRef, useState } from "react";
import { FloatingPromos } from "@/components/FloatingPromos";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

// ─── COUNTDOWN HOOK ──────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

// ─── PARTICLES CANVAS ────────────────────────────────────────────────────────
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
    for (let i = 0; i < 160; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
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
        ctx.fillStyle = "rgba(0,217,255,0.9)";
        ctx.fillRect(p.x, p.y, 2, 2);
        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = "rgba(0,217,255,0.2)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} id="bgParticles" />;
}

// ─── HARM MODAL ──────────────────────────────────────────────────────────────
function HarmModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`ds-harm-modal${open ? " open" : ""}`}
      onClick={onClose}
    >
      <div className="ds-harm-box" onClick={(e) => e.stopPropagation()}>
        <button className="ds-harm-close" onClick={onClose}>✕</button>
        <h3>🌌 REDUÇÃO DE DANOS NA PISTA</h3>
        <p>
          A energia da pista é única… luzes, som, conexão e liberdade.<br />
          Mas curtir de verdade também é saber se cuidar e cuidar dos outros. 💜
        </p>
        <p>
          <strong>⚡ O QUE ISSO SIGNIFICA?</strong><br />
          Não é sobre proibir ou julgar.<br />
          É sobre diminuir riscos e manter a experiência segura e positiva.
        </p>
        <div className="ds-harm-grid">
          <div>
            <strong>💧 HIDRATE-SE</strong>
            💦 Beba água com frequência<br />
            ⚖️ Evite exageros<br />
            🧘‍♂️ Respeite seus limites
          </div>
          <div>
            <strong>🚫 NÃO COMPARTILHE</strong>
            🥤 Copos<br />
            🚬 Itens pessoais<br />
            🎈 Objetos em geral
          </div>
          <div>
            <strong>😴 PAUSE SE PRECISAR</strong>
            🪑 Faça pausas<br />
            🌬 Respire<br />
            🧠 Escute seu corpo
          </div>
          <div>
            <strong>🧠 CONSCIÊNCIA</strong>
            ✔ Vá com calma<br />
            ❌ Evite misturas<br />
            👥 Esteja com pessoas de confiança
          </div>
          <div>
            <strong>🤝 CUIDADO COLETIVO</strong>
            👀 Observe<br />
            🗣 Chame ajuda<br />
            🫂 Fique junto
          </div>
          <div>
            <strong>📞 APOIO</strong>
            🚑 SAMU: 192<br />
            🚓 Polícia: 190<br />
            ☎️ CVV: 188
          </div>
        </div>
        <p style={{ marginTop: "12px" }}>
          🌿 <strong>DARK SYSTEM</strong><br />
          🎶 Música • 🌀 Energia • 🎨 Arte • 🧠 Consciência<br />
          🔥 A melhor viagem é voltar bem pra viver a próxima.
        </p>
      </div>
    </div>
  );
}

// ─── DRAGGABLE BANNER ────────────────────────────────────────────────────────
function DraggableBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [bannerImage, setBannerImage] = useState(() => 
    localStorage.getItem('videoBannerImageUrl') || "https://darksystem.online/dddddd.png"
  );

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    dragging.current = true;
    offset.current = {
      x: e.clientX - ref.current.offsetLeft,
      y: e.clientY - ref.current.offsetTop,
    };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !ref.current) return;
      ref.current.style.left = e.clientX - offset.current.x + "px";
      ref.current.style.top = e.clientY - offset.current.y + "px";
      ref.current.style.bottom = "auto";
      ref.current.style.right = "auto";
    };
    const onUp = () => { dragging.current = false; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  // Sincronizar com localStorage em tempo real
  useEffect(() => {
    const handleStorageChange = () => {
      const newUrl = localStorage.getItem('videoBannerImageUrl');
      if (newUrl) setBannerImage(newUrl);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="ds-custom-banner" ref={ref} onMouseDown={onMouseDown}>
      <div className="ds-banner-inner">
        <img
          src={bannerImage}
          alt="player frame"
        />
        <iframe
          src="https://www.youtube.com/embed/MR4FdzkVUww?rel=0&modestbranding=1"
          allowFullScreen
          title="Dark System YouTube"
        />
      </div>
    </div>
  );
}

// ─── MEMORIAL CAROUSEL ───────────────────────────────────────────────────────
const memorialItems = [
  { src: "https://darksystem.online/2.jpg", label: "Release High Tech 2019" },
  { src: "https://darksystem.online/1.png", label: "Indoo 2.0 2019" },
  { src: "https://darksystem.online/3.jpg", label: "Ritual Vodoo 2020" },
  { src: "https://darksystem.online/4.jpg", label: "EvolutiOhm 2020" },
  { src: "https://darksystem.online/6.jpg", label: "IA Astrologic 2024" },
  { src: "https://darksystem.online/5.jpg", label: "O Retorno 2025" },
  { src: "https://darksystem.online/a4b34773-2db6-4466-a09a-ff490d01e2e2.png", label: "Criminal Hi-Tech 2026" },
];

function Memorial() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };
  return (
    <div className="ds-memorial-wrap">
      <button className="ds-memorial-arrow left" onClick={() => scroll(-1)}>&#10094;</button>
      <button className="ds-memorial-arrow right" onClick={() => scroll(1)}>&#10095;</button>
      <div className="ds-memorial-track" ref={trackRef}>
        {memorialItems.map((item) => (
          <div className="ds-memorial-item" key={item.label}>
            <img src={item.src} alt={item.label} />
            <div className="ds-memorial-overlay">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN HOME ────────────────────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth();
  const [harmOpen, setHarmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const countdownTarget = useState(() => new Date("Dec 12, 2026 23:59:59"))[0];
  const time = useCountdown(countdownTarget);
  const pad = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setHarmOpen(false);
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <a
        href="#conteudo-principal"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "0",
          zIndex: 9999,
          background: "#0a0f16",
          color: "#00d9ff",
          padding: "8px 12px",
          border: "1px solid #00d9ff",
          borderRadius: "6px",
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = "12px";
          e.currentTarget.style.top = "12px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = "-9999px";
        }}
      >
        Pular para o conteúdo principal
      </a>
      {/* PARTICLES */}
      <ParticlesCanvas />

      {/* NAVBAR */}
      <nav className="ds-navbar" aria-label="Navegação principal">
        <div className="ds-menu">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            style={{
              background: 'none',
              border: 'none',
              color: '#00d9ff',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px 12px',
              textShadow: '0 0 8px rgba(0, 217, 255, 0.6)',
              transition: 'all 0.3s',
            }}
          >
            ☰ MENU
          </button>
          <a href="#">Início</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setHarmOpen(true); }}>
            Redução de Danos
          </a>
          <a href="/ingressos">
            Ingressos
          </a>
          {!user && (
            <a href={getLoginUrl()} style={{ color: '#ff7a18' }}>
              LOGIN
            </a>
          )}
        </div>
      </nav>

      {/* MENU MODAL */}
      {menuOpen && (
        <div
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            zIndex: 100,
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 217, 255, 0.2)',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href="/"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '15px',
                background: 'rgba(0, 217, 255, 0.1)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '6px',
                color: '#00d9ff',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 217, 255, 0.2)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 217, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🏠 Início
            </a>
            <a
              href="/shop-page"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '15px',
                background: 'rgba(0, 217, 255, 0.1)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '6px',
                color: '#00d9ff',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 217, 255, 0.2)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 217, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🛍️ Loja
            </a>
            <a
              href="/blog-page"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '15px',
                background: 'rgba(0, 217, 255, 0.1)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '6px',
                color: '#00d9ff',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 217, 255, 0.2)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 217, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📰 Blog
            </a>
            <a
              href="/ingressos"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '15px',
                background: 'rgba(255, 122, 24, 0.1)',
                border: '1px solid rgba(255, 122, 24, 0.3)',
                borderRadius: '6px',
                color: '#ff7a18',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 122, 24, 0.2)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(255, 122, 24, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 122, 24, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🎟️ Ingressos
            </a>
          </div>
        </div>
      )}

      {/* HERO */}
      <main id="conteudo-principal">
      <section className="ds-hero" style={{ position: "relative" }}>
        <img
          className="hero-banner"
          src="https://darksystem.online/head.png"
          alt="Dark System"
          style={{ width: '100%', maxWidth: '900px', height: 'auto', display: 'block', position: 'relative', zIndex: 2, objectFit: 'contain' }}
        />
      </section>

      {/* PROG GIF */}
      <div className="ds-prog-wrap">
        <a href="https://www.instagram.com/progzaco/" target="_blank" rel="noreferrer">
          <img
            src={localStorage.getItem('progzacoUrl') || "https://darksystem.online/prog.gif"}
            alt="Progzaco"
          />
        </a>
      </div>

      {/* COUNTDOWN SECTION */}
      <section className="ds-section">
        <div className="container">
          <h2>CONTAGEM REGRESSIVA</h2>
          <div className="ds-countdown-wrap">
            <div className="ds-timer">
              <div className="ds-box">{pad(time.d)}<div style={{ fontSize: "10px", color: "#00d9ff", marginTop: "4px" }}>DIAS</div></div>
              <div className="ds-box">{pad(time.h)}<div style={{ fontSize: "10px", color: "#00d9ff", marginTop: "4px" }}>HORAS</div></div>
              <div className="ds-box">{pad(time.m)}<div style={{ fontSize: "10px", color: "#00d9ff", marginTop: "4px" }}>MIN</div></div>
              <div className="ds-box">{pad(time.s)}<div style={{ fontSize: "10px", color: "#00d9ff", marginTop: "4px" }}>SEG</div></div>
            </div>

            <div style={{ textAlign: "center" }}>
              <span style={{ display: "block", marginBottom: "12px", color: "#b8c7d1", fontFamily: "'Space Mono', monospace", fontSize: "13px" }}>
                Garanta sua presença no evento
              </span>
              <a href="https://darksystem.online/ingressos" className="ds-btn-ingresso">
                COMPRE SEU INGRESSO
              </a>
            </div>

            {/* MEDIA CTA */}
            <div className="ds-cta-wrapper">
              {/* FLYER */}
              <div className="ds-cta-box">
                <div className="ds-media-equal">
                  <img
                    src="https://darksystem.online/a4b34773-2db6-4466-a09a-ff490d01e2e2.png"
                    alt="Flyer do Evento"
                  />
                </div>
                <a
                  href="https://darksystem.online/ingressos"
                  className="ds-btn-ingresso"
                  style={{ marginTop: "10px", width: "320px", textAlign: "center" }}
                >
                  VER EVENTO
                </a>
              </div>

              {/* INSTAGRAM EMBED */}
              <div className="ds-cta-box">
                <div className="ds-media-equal">
                  <iframe
                    src="https://www.instagram.com/p/DWCZX6akSna/embed"
                    title="Instagram Dark System"
                  />
                </div>
                <a
                  href="https://instagram.com/darksystemoficial"
                  target="_blank"
                  rel="noreferrer"
                  className="ds-ig-btn"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
                    alt="Instagram"
                  />
                  SIGA-NOS NO INSTAGRAM
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTISTAS */}
      <section className="ds-section ds-artist-bar" id="artistas">
        <div className="container">
          <h2>ARTISTAS CONFIRMADOS</h2>
          <div className="ds-artist-row">
            {/* RAZEK */}
            <div className="ds-artist-feed">
              <div className="ds-artist-card">
                <div className="ds-live-badge">LIVE 5H</div>
                <img className="artist-logo" src="https://rayzer.fun/razek.png" alt="Razek" />
                <img
                  className="ds-kamino-inside"
                  src="https://darksystem.online/Kamino%20PNG.png"
                  alt="Kamino"
                />
                <div className="ds-artist-overlay">
                  <div className="ds-artist-title" style={{ color: "#00d9ff" }}>HI-TECH / DARK</div>
                  <div className="ds-artist-desc">
                    Set agressivo, altas BPMs e energia intensa de pista. Som pesado, psicodélico e futurista.
                  </div>
                </div>
              </div>
              <iframe
                src="https://w.soundcloud.com/player/?url=https://soundcloud.com/razeklive/razek-siddhartha-counsciusness-180"
                style={{ width: "250px", height: "80px", border: "none", borderRadius: "6px" }}
                title="Razek SoundCloud"
              />
            </div>

            {/* MAKTON */}
            <div className="ds-artist-feed">
              <div className="ds-artist-card">
                <img className="artist-logo" src="https://rayzer.fun/makton.png" alt="Makton" />
                <div className="ds-artist-overlay">
                  <div className="ds-artist-title" style={{ color: "#ff7a18" }}>TWILIGHT</div>
                  <div className="ds-artist-desc">
                    Groove progressivo e psicodélico com atmosferas profundas e evolução sonora constante.
                  </div>
                </div>
              </div>
              <iframe
                src="https://w.soundcloud.com/player/?url=https://soundcloud.com/makton_music/makton-e-full-on-e-f-da-se"
                style={{ width: "250px", height: "80px", border: "none", borderRadius: "6px" }}
                title="Makton SoundCloud"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MEMORIAL */}
      <section className="ds-section">
        <div className="container">
          <h2>MEMORIAL DARK SYSTEM</h2>
          <Memorial />
        </div>
      </section>
      </main>

      {/* FOOTER */}
      <footer className="ds-footer">
        <div className="ds-footer-grid">
          <div className="ds-footer-logo">
            <img src="https://darksystem.online/AMG.png" alt="AMG" />
            <p style={{ marginTop: "10px", color: "#aaa", fontFamily: "'Space Mono', monospace", fontSize: "12px", lineHeight: "1.6" }}>
              Parceria desde 2019<br />fortalecendo a cultura underground.
            </p>
          </div>
          <div className="ds-footer-col">
            <h3>Links</h3>
            <a href="https://darksystem.online/ingressos">Ingressos</a>
          </div>
          <div className="ds-footer-col">
            <h3>Redes</h3>
            <a href="https://instagram.com/darksystemoficial" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.facebook.com/share/174MiepdFL/" target="_blank" rel="noreferrer">Facebook</a>
          </div>
          <div className="ds-footer-col">
            <h3>Contato</h3>
            <a href="https://wa.me/5521992244319">(21) 99224-4319</a>
          </div>
        </div>
        <div className="ds-footer-bottom">© Dark System</div>
      </footer>

      {/* SOCIAL FLOAT */}
      <div className="ds-social-float">
        <a href="https://wa.me/5521992244319" target="_blank" rel="noreferrer" aria-label="WhatsApp">
          <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" alt="WhatsApp" />
        </a>
        <a href="https://instagram.com/darksystemoficial" target="_blank" rel="noreferrer" aria-label="Instagram">
          <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" />
        </a>
        <a href="https://www.facebook.com/events/2161767187926456" target="_blank" rel="noreferrer" aria-label="Facebook">
          <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" />
        </a>
      </div>

      {/* YOUTUBE BANNER (DRAGGABLE) */}
      <DraggableBanner />

      {/* FLOATING PROMOS */}
      <FloatingPromos />

      {/* HARM MODAL */}
      <HarmModal open={harmOpen} onClose={() => setHarmOpen(false)} />
    </div>
  );
}
