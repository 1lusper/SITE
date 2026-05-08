import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("lagpdev@outlook.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginMutation = trpc.auth.emailLogin.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Login realizado com sucesso!");
        setLocation("/admin");
      } else {
        toast.error("Email ou senha incorretos");
      }
    },
    onError: (error) => {
      toast.error("Erro ao fazer login");
      console.error(error);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    setLoading(true);
    await loginMutation.mutateAsync({ email, password });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* BACKGROUND PARTICLES */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <Card className="w-full max-w-md bg-background border-cyan-500/50">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-cyan-400">
            🔐 ADMIN LOGIN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="mt-1 bg-background border-cyan-500/30 focus:border-cyan-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 bg-background border-cyan-500/30 focus:border-cyan-500"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Entrando...
                </>
              ) : (
                "ENTRAR"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-cyan-500/30">
            <p className="text-xs text-muted-foreground text-center">
              Credenciais padrão:
              <br />
              Email: lagpdev@outlook.com
              <br />
              Senha: senhaloka1
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="w-full mt-4 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            Voltar ao Site
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
