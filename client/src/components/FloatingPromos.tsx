import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Promo {
  id: string;
  title: string;
  description: string;
  code?: string;
  color: string;
  icon: string;
}

const defaultPromos: Promo[] = [
  {
    id: "1",
    title: "INGRESSO VIP",
    description: "Acesso exclusivo à área VIP",
    code: "VIP2026",
    color: "#ff7a18",
    icon: "🎟️",
  },
  {
    id: "2",
    title: "CUPOM 20%",
    description: "Desconto em ingressos",
    code: "DARK20",
    color: "#00d9ff",
    icon: "🎁",
  },
  {
    id: "3",
    title: "MEIA ENTRADA",
    description: "Meia entrada disponível",
    code: "MEIA",
    color: "#00ffa6",
    icon: "🎫",
  },
];

export function FloatingPromos() {
  const [promos, setPromos] = useState<Promo[]>(defaultPromos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [promos.length, visible]);

  if (!visible) return null;

  const current = promos[currentIndex];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        right: "20px",
        zIndex: 50,
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 217, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(0, 217, 255, 0);
          }
        }
      `}</style>

      <div
        style={{
          background: `linear-gradient(135deg, ${current.color}20 0%, ${current.color}10 100%)`,
          border: `2px solid ${current.color}`,
          borderRadius: "12px",
          padding: "16px",
          width: "280px",
          boxShadow: `0 0 20px ${current.color}40, inset 0 0 20px ${current.color}20`,
          animation: "pulse 2s infinite",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "24px", marginBottom: "4px" }}>{current.icon}</div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: current.color,
                textShadow: `0 0 8px ${current.color}`,
              }}
            >
              {current.title}
            </div>
            <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>
              {current.description}
            </div>
            {current.code && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "6px 10px",
                  background: `${current.color}20`,
                  border: `1px solid ${current.color}`,
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: current.color,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${current.color}40`;
                  e.currentTarget.style.boxShadow = `0 0 12px ${current.color}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${current.color}20`;
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => {
                  navigator.clipboard.writeText(current.code!);
                  alert(`Cupom ${current.code} copiado!`);
                }}
              >
                Copiar: {current.code}
              </div>
            )}
          </div>

          <button
            onClick={() => setVisible(false)}
            style={{
              background: "none",
              border: "none",
              color: current.color,
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* DOTS INDICATOR */}
        <div style={{ display: "flex", gap: "4px", marginTop: "12px", justifyContent: "center" }}>
          {promos.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: idx === currentIndex ? current.color : `${current.color}40`,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
