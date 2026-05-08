import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";

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
        ctx.fillStyle = "rgba(255, 122, 24, 0.6)";
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

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function ShopPage() {
  const [, setLocation] = useLocation();
  const { data: produtos = [], isLoading } = trpc.products.list.useQuery();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
          borderBottom: "1px solid rgba(255, 122, 24, 0.2)",
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
          <span style={{ color: "#ff7a18", fontSize: "18px", fontWeight: "bold", letterSpacing: "2px" }}>
            LOJA
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => setShowCart(!showCart)}
            style={{
              background: "transparent",
              border: "1px solid #ff7a18",
              color: "#ff7a18",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.3s",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 12px #ff7a18";
              e.currentTarget.style.background = "rgba(255, 122, 24, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <ShoppingCart size={16} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#ff7a18",
                  color: "#000",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setLocation("/")}
            style={{
              background: "transparent",
              border: "1px solid #ff7a18",
              color: "#ff7a18",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 12px #ff7a18";
              e.currentTarget.style.background = "rgba(255, 122, 24, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "transparent";
            }}
          >
            ← VOLTAR
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <div
        style={{
          paddingTop: "100px",
          paddingBottom: "40px",
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(255, 122, 24, 0.1), transparent 70%)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            color: "#ff7a18",
            marginBottom: "10px",
            letterSpacing: "3px",
            textShadow: "0 0 20px rgba(255, 122, 24, 0.5)",
          }}
        >
          LOJA DARK SYSTEM
        </h1>
        <p style={{ color: "#aaa", fontSize: "14px", letterSpacing: "1px" }}>
          Ingressos, merchandise e produtos exclusivos
        </p>
      </div>

      {/* CART SIDEBAR */}
      {showCart && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            width: "100%",
            maxWidth: "400px",
            height: "100vh",
            background: "linear-gradient(135deg, rgba(0,0,0,0.98), rgba(255, 122, 24, 0.05))",
            border: "1px solid rgba(255, 122, 24, 0.3)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            boxShadow: "-10px 0 40px rgba(255, 122, 24, 0.2)",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              borderBottom: "1px solid rgba(255, 122, 24, 0.2)",
            }}
          >
            <h2 style={{ color: "#ff7a18", fontSize: "18px", fontWeight: "bold" }}>CARRINHO</h2>
            <button
              onClick={() => setShowCart(false)}
              style={{ background: "none", border: "none", color: "#ff7a18", cursor: "pointer", fontSize: "20px" }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", color: "#aaa", paddingTop: "40px" }}>
                <p>Carrinho vazio</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "rgba(255, 122, 24, 0.05)",
                      border: "1px solid rgba(255, 122, 24, 0.2)",
                      padding: "12px",
                      borderRadius: "6px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#ff7a18", fontWeight: "bold", fontSize: "14px" }}>{item.name}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ff7a18",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            background: "rgba(255, 122, 24, 0.2)",
                            border: "1px solid rgba(255, 122, 24, 0.4)",
                            color: "#ff7a18",
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                            borderRadius: "3px",
                            fontSize: "12px",
                          }}
                        >
                          -
                        </button>
                        <span style={{ color: "#aaa", fontSize: "12px", width: "20px", textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            background: "rgba(255, 122, 24, 0.2)",
                            border: "1px solid rgba(255, 122, 24, 0.4)",
                            color: "#ff7a18",
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                            borderRadius: "3px",
                            fontSize: "12px",
                          }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ color: "#ff7a18", fontWeight: "bold", fontSize: "13px" }}>
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div
              style={{
                padding: "20px",
                borderTop: "1px solid rgba(255, 122, 24, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid rgba(255, 122, 24, 0.2)",
                }}
              >
                <span style={{ color: "#aaa" }}>Total:</span>
                <span style={{ color: "#ff7a18", fontWeight: "bold", fontSize: "18px" }}>R$ {total.toFixed(2)}</span>
              </div>
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "linear-gradient(135deg, #ff7a18, #ff9933)",
                  color: "#000",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 122, 24, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                FINALIZAR COMPRA
              </button>
            </div>
          )}
        </div>
      )}

      {/* PRODUCTS GRID */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Loader2 style={{ animation: "spin 1s linear infinite", color: "#ff7a18", width: "40px", height: "40px" }} />
          </div>
        ) : produtos.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#aaa",
              border: "1px dashed rgba(255, 122, 24, 0.3)",
              borderRadius: "8px",
            }}
          >
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>Nenhum produto disponível</p>
            <p style={{ fontSize: "12px" }}>Volte em breve para novidades!</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {produtos.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "linear-gradient(135deg, rgba(255, 122, 24, 0.05), rgba(255, 122, 24, 0.02))",
                  border: "1px solid rgba(255, 122, 24, 0.2)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "all 0.3s",
                  boxShadow: "0 0 20px rgba(255, 122, 24, 0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 122, 24, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(255, 122, 24, 0.6)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 122, 24, 0)";
                  e.currentTarget.style.borderColor = "rgba(255, 122, 24, 0.2)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 122, 24, 0.1)",
                    padding: "40px 20px",
                    textAlign: "center",
                    borderBottom: "1px solid rgba(255, 122, 24, 0.2)",
                    minHeight: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "#ff7a18", fontSize: "48px" }}>🎟️</span>
                </div>
                <div style={{ padding: "16px" }}>
                  <h3
                    style={{
                      color: "#ff7a18",
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "6px",
                    }}
                  >
                    {product.name}
                  </h3>
                  <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "12px", minHeight: "32px" }}>
                    {product.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(255, 122, 24, 0.1)",
                    }}
                  >
                    <span style={{ color: "#ff7a18", fontWeight: "bold", fontSize: "16px" }}>
                      R$ {product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      style={{
                        background: "rgba(255, 122, 24, 0.2)",
                        border: "1px solid rgba(255, 122, 24, 0.4)",
                        color: "#ff7a18",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 122, 24, 0.4)";
                        e.currentTarget.style.boxShadow = "0 0 10px rgba(255, 122, 24, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 122, 24, 0.2)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      ADICIONAR
                    </button>
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
          borderTop: "1px solid rgba(255, 122, 24, 0.2)",
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
