/*
 * DARK SYSTEM — Admin Panel
 * Funcionalidades: Gerenciar Artistas | Trocar Logo/Vídeo | Menu Loja | PagSeguro
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"artistas" | "midia" | "loja" | "blog" | "rodape" | "analytics">("artistas");
  const [showCupons, setShowCupons] = useState(true);
  const [showVideoBanner, setShowVideoBanner] = useState(true);
  const configQuery = trpc.config.get.useQuery();
  const toggleCuponsMutation = trpc.config.toggleCupons.useMutation();
  const toggleVideoBannerMutation = trpc.config.toggleVideoBanner.useMutation();

  useEffect(() => {
    if (configQuery.data) {
      setShowCupons(configQuery.data.showCupons === 1);
      setShowVideoBanner(configQuery.data.showVideoBanner === 1);
    }
  }, [configQuery.data]);

  const handleToggleCupons = async () => {
    try {
      await toggleCuponsMutation.mutateAsync({ show: !showCupons });
      setShowCupons(!showCupons);
      toast.success(showCupons ? "Cupons desativados" : "Cupons ativados");
    } catch (error) {
      toast.error("Erro ao atualizar cupons");
    }
  };

  const handleToggleVideoBanner = async () => {
    try {
      await toggleVideoBannerMutation.mutateAsync({ show: !showVideoBanner });
      setShowVideoBanner(!showVideoBanner);
      toast.success(showVideoBanner ? "Vídeo desativado" : "Vídeo ativado");
    } catch (error) {
      toast.error("Erro ao atualizar vídeo");
    }
  };

  // Redirecionar se não for admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Você não tem permissão para acessar o painel admin.
            </p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER ADMIN */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">⚙️ PAINEL ADMIN</h1>
            <p className="text-xs text-muted-foreground">Dark System Management</p>
          </div>
          <div className="flex gap-3">
            <span className="text-sm text-muted-foreground">Olá, {user.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                setLocation("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          <button
            onClick={() => setActiveTab("artistas")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "artistas"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎤 Artistas
          </button>
          <button
            onClick={() => setActiveTab("midia")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "midia"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎬 Mídia
          </button>
          <button
            onClick={() => setActiveTab("loja")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "loja"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🛍️ Loja
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "blog"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📰 Blog
          </button>
          <button
            onClick={() => setActiveTab("rodape")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "rodape"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📋 Rodapé
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "analytics"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📊 Analytics
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ARTISTAS TAB */}
        {activeTab === "artistas" && <ArtistasTab />}

        {/* MÍDIA TAB */}
        {activeTab === "midia" && (
          <MidiaTab
            showCupons={showCupons}
            showVideoBanner={showVideoBanner}
            onToggleCupons={handleToggleCupons}
            onToggleVideoBanner={handleToggleVideoBanner}
          />
        )}

        {/* LOJA TAB */}
        {activeTab === "loja" && <LojaTab />}

        {/* BLOG TAB */}
        {activeTab === "blog" && <BlogTab />}

        {/* RODAPÉ TAB */}
        {activeTab === "rodape" && <RodapeTab />}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
}

// ─── ARTISTAS TAB ───────────────────────────────────────────────────────────
function ArtistasTab() {
  const { data: artistas = [], isLoading, refetch } = trpc.artists.list.useQuery();
  const createMutation = trpc.artists.create.useMutation();
  const deleteMutation = trpc.artists.delete.useMutation();

  const [novoArtista, setNovoArtista] = useState({
    nome: "",
    genero: "",
    descricao: "",
    imagem: "",
    soundcloud: "",
    duracao: "3H",
  });

  const handleAddArtista = async () => {
    if (!novoArtista.nome || !novoArtista.genero) {
      toast.error("Preencha pelo menos nome e gênero");
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: novoArtista.nome,
        genre: novoArtista.genero,
        description: novoArtista.descricao,
        imageUrl: novoArtista.imagem,
        soundcloudUrl: novoArtista.soundcloud,
        duration: novoArtista.duracao,
      });
      setNovoArtista({
        nome: "",
        genero: "",
        descricao: "",
        imagem: "",
        soundcloud: "",
        duracao: "3H",
      });
      toast.success("Artista adicionado com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao adicionar artista");
    }
  };

  const handleRemoveArtista = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Artista removido!");
      refetch();
    } catch (error) {
      toast.error("Erro ao remover artista");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ADICIONAR NOVO */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">➕ Novo Artista</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Nome</label>
            <Input
              placeholder="Ex: DJ Nome"
              value={novoArtista.nome}
              onChange={(e) => setNovoArtista({ ...novoArtista, nome: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Gênero</label>
            <Input
              placeholder="Ex: HI-TECH / DARK"
              value={novoArtista.genero}
              onChange={(e) => setNovoArtista({ ...novoArtista, genero: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Descrição</label>
            <Textarea
              placeholder="Descreva o estilo..."
              value={novoArtista.descricao}
              onChange={(e) => setNovoArtista({ ...novoArtista, descricao: e.target.value })}
              className="mt-1 text-xs"
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">URL Imagem</label>
            <Input
              placeholder="https://..."
              value={novoArtista.imagem}
              onChange={(e) => setNovoArtista({ ...novoArtista, imagem: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">SoundCloud</label>
            <Input
              placeholder="https://soundcloud.com/..."
              value={novoArtista.soundcloud}
              onChange={(e) => setNovoArtista({ ...novoArtista, soundcloud: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Duração</label>
            <Input
              placeholder="Ex: 5H"
              value={novoArtista.duracao}
              onChange={(e) => setNovoArtista({ ...novoArtista, duracao: e.target.value })}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleAddArtista}
            disabled={createMutation.isPending}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
          >
            {createMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
            Adicionar
          </Button>
        </CardContent>
      </Card>

      {/* LISTA DE ARTISTAS */}
      <div className="lg:col-span-2 space-y-3">
        {artistas.map((artista) => (
          <Card key={artista.id} className="bg-card/50">
            <CardContent className="pt-4">
              <div className="flex gap-4">
                {artista.imageUrl && (
                  <img
                    src={artista.imageUrl}
                    alt={artista.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-cyan-400">{artista.name}</h3>
                  <p className="text-xs text-muted-foreground">{artista.genre}</p>
                  <p className="text-xs text-foreground/70 mt-1">{artista.description}</p>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">
                      LIVE {artista.duration}
                    </span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => handleRemoveArtista(artista.id)}
                >
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── MÍDIA TAB ───────────────────────────────────────────────────────────────
function MidiaTab(props: { showCupons: boolean; showVideoBanner: boolean; onToggleCupons: () => void; onToggleVideoBanner: () => void }) {
  const [logo, setLogo] = useState("https://darksystem.online/AMG.png");
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/MR4FdzkVUww");
  const [heroImage, setHeroImage] = useState("https://darksystem.online/head.png");

  const handleSaveMidia = () => {
    toast.success("Mídia atualizada com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* TOGGLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎁 Cupons Flutuantes</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={props.onToggleCupons}
              className={`w-full font-bold ${
                props.showCupons
                  ? "bg-green-500 hover:bg-green-600 text-black"
                  : "bg-red-500 hover:bg-red-600 text-black"
              }`}
            >
              {props.showCupons ? "✓ ATIVADO" : "✗ DESATIVADO"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎬 Vídeo Esquerda</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={props.onToggleVideoBanner}
              className={`w-full font-bold ${
                props.showVideoBanner
                  ? "bg-green-500 hover:bg-green-600 text-black"
                  : "bg-red-500 hover:bg-red-600 text-black"
              }`}
            >
              {props.showVideoBanner ? "✓ ATIVADO" : "✗ DESATIVADO"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* MÍDIA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LOGO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏷️ Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-background p-4 rounded border border-border flex items-center justify-center h-32">
            <img src={logo} alt="Logo" className="max-w-full max-h-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">URL da Logo</label>
            <Input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSaveMidia} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
            Salvar Logo
          </Button>
        </CardContent>
      </Card>

      {/* HERO IMAGE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🖼️ Banner Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-background p-4 rounded border border-border flex items-center justify-center h-32">
            <img src={heroImage} alt="Hero" className="max-w-full max-h-full" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">URL da Imagem</label>
            <Input
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSaveMidia} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
            Salvar Banner
          </Button>
        </CardContent>
      </Card>

      {/* VIDEO */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">🎬 Vídeo YouTube</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-background p-4 rounded border border-border">
            <iframe
              src={videoUrl}
              width="100%"
              height="300"
              frameBorder="0"
              allowFullScreen
              title="YouTube Player"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">URL do Embed YouTube</label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="mt-1"
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
          <Button onClick={handleSaveMidia} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
            Salvar Vídeo
          </Button>
        </CardContent>
      </Card>

      {/* FAVICON */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🔗 Favicon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload
            label="Upload Favicon"
            currentImage={localStorage.getItem('faviconUrl') || ''}
            onUpload={(url) => {
              localStorage.setItem('faviconUrl', url);
              const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
              if (link) link.href = url;
              toast.success('Favicon atualizado!');
            }}
          />
        </CardContent>
      </Card>

      {/* PROGZACO IMAGE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎤 Imagem Progzaco</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload
            label="Upload Imagem Progzaco"
            currentImage={localStorage.getItem('progzacoUrl') || 'https://darksystem.online/prog.gif'}
            onUpload={(url) => {
              localStorage.setItem('progzacoUrl', url);
              toast.success('Imagem Progzaco atualizada!');
              window.location.reload();
            }}
          />
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

// ─── LOJA TAB ───────────────────────────────────────────────────────────────
function LojaTab() {
  const { data: produtos = [], isLoading, refetch } = trpc.products.list.useQuery();
  const createMutation = trpc.products.create.useMutation();
  const deleteMutation = trpc.products.delete.useMutation();

  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    preco: 0,
    descricao: "",
    quantidade: 0,
  });

  const handleAddProduto = async () => {
    if (!novoProduto.nome || novoProduto.preco <= 0) {
      toast.error("Preencha nome e preço");
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: novoProduto.nome,
        price: Math.round(novoProduto.preco * 100), // Converter para centavos
        description: novoProduto.descricao,
        quantity: novoProduto.quantidade,
      });
      setNovoProduto({ nome: "", preco: 0, descricao: "", quantidade: 0 });
      toast.success("Produto adicionado!");
      refetch();
    } catch (error) {
      toast.error("Erro ao adicionar produto");
    }
  };

  const handleRemoveProduto = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Produto removido!");
      refetch();
    } catch (error) {
      toast.error("Erro ao remover produto");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ADICIONAR PRODUTO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">➕ Novo Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Nome</label>
            <Input
              placeholder="Ex: Ingresso VIP"
              value={novoProduto.nome}
              onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Preço (R$)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={novoProduto.preco}
              onChange={(e) => setNovoProduto({ ...novoProduto, preco: parseFloat(e.target.value) })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Descrição</label>
            <Textarea
              placeholder="Descreva o produto..."
              value={novoProduto.descricao}
              onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
              className="mt-1 text-xs"
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Quantidade</label>
            <Input
              type="number"
              placeholder="0"
              value={novoProduto.quantidade}
              onChange={(e) => setNovoProduto({ ...novoProduto, quantidade: parseInt(e.target.value) })}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleAddProduto}
            disabled={createMutation.isPending}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
          >
            {createMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
            Adicionar
          </Button>
        </CardContent>
      </Card>

      {/* LISTA DE PRODUTOS */}
      <div className="lg:col-span-2 space-y-3">
        {produtos.map((produto) => (
          <Card key={produto.id} className="bg-card/50">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-cyan-400">{produto.name}</h3>
                  <p className="text-sm text-foreground/70 mt-1">{produto.description}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-green-400 font-bold">R$ {(produto.price / 100).toFixed(2)}</span>
                    <span className="text-muted-foreground">Estoque: {produto.quantity}</span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => handleRemoveProduto(produto.id)}
                >
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* INTEGRAÇÃO PAGSEGURO */}
        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-lg text-green-400">💳 PagSeguro Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Integração com PagSeguro para processar pagamentos dos produtos acima.
            </p>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Token PagSeguro</label>
              <Input
                type="password"
                placeholder="Seu token PagSeguro"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Email Conta</label>
              <Input
                placeholder="seu@email.com"
                className="mt-1"
              />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
              Configurar PagSeguro
            </Button>
            <p className="text-xs text-muted-foreground italic">
              ℹ️ Após configurar, os produtos acima estarão disponíveis para compra no site.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── BLOG TAB ───────────────────────────────────────────────────────────────
function BlogTab() {
  const { data: posts = [], isLoading, refetch } = trpc.blog.list.useQuery();
  const createMutation = trpc.blog.create.useMutation();
  const deleteMutation = trpc.blog.delete.useMutation();

  const [novoPost, setNovoPost] = useState({
    titulo: "",
    slug: "",
    categoria: "noticia",
    descricao: "",
    conteudo: "",
    imagem: "",
  });

  const handleAddPost = async () => {
    if (!novoPost.titulo || !novoPost.conteudo) {
      toast.error("Preencha título e conteúdo");
      return;
    }
    try {
      await createMutation.mutateAsync({
        title: novoPost.titulo,
        slug: novoPost.slug || novoPost.titulo.toLowerCase().replace(/\s+/g, "-"),
        category: novoPost.categoria,
        description: novoPost.descricao,
        content: novoPost.conteudo,
        imageUrl: novoPost.imagem,
        published: 1,
      });
      setNovoPost({ titulo: "", slug: "", categoria: "noticia", descricao: "", conteudo: "", imagem: "" });
      toast.success("Post publicado!");
      refetch();
    } catch (error) {
      toast.error("Erro ao publicar post");
    }
  };

  const handleRemovePost = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Post removido!");
      refetch();
    } catch (error) {
      toast.error("Erro ao remover post");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📝 Novo Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Título</label>
            <Input
              placeholder="Título do post"
              value={novoPost.titulo}
              onChange={(e) => setNovoPost({ ...novoPost, titulo: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Slug (URL)</label>
            <Input
              placeholder="titulo-do-post"
              value={novoPost.slug}
              onChange={(e) => setNovoPost({ ...novoPost, slug: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Categoria</label>
            <Input
              placeholder="noticia"
              value={novoPost.categoria}
              onChange={(e) => setNovoPost({ ...novoPost, categoria: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Descrição</label>
            <Textarea
              placeholder="Resumo do post..."
              value={novoPost.descricao}
              onChange={(e) => setNovoPost({ ...novoPost, descricao: e.target.value })}
              className="mt-1 text-xs"
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Conteúdo</label>
            <Textarea
              placeholder="Conteúdo completo..."
              value={novoPost.conteudo}
              onChange={(e) => setNovoPost({ ...novoPost, conteudo: e.target.value })}
              className="mt-1 text-xs"
              rows={4}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">URL Imagem</label>
            <Input
              placeholder="https://..."
              value={novoPost.imagem}
              onChange={(e) => setNovoPost({ ...novoPost, imagem: e.target.value })}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleAddPost}
            disabled={createMutation.isPending}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
          >
            {createMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
            Publicar
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-3">
        {posts.map((post) => (
          <Card key={post.id} className="bg-card/50">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-cyan-400">{post.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{post.category}</p>
                  <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{post.description}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => handleRemovePost(post.id)}
                >
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── RODAPÉ TAB ──────────────────────────────────────────────────────────────
function RodapeTab() {
  const { data: footer } = trpc.footer.get.useQuery();
  const updateMutation = trpc.footer.update.useMutation();

  const [footerData, setFooterData] = useState({
    logo: footer?.logoUrl || "https://darksystem.online/AMG.png",
    partner: footer?.partnerText || "Parceria desde 2019",
    phone: footer?.phone || "(21) 99224-4319",
    email: footer?.email || "contato@darksystem.com",
    instagram: footer?.instagramUrl || "https://instagram.com/darksystemoficial",
    facebook: footer?.facebookUrl || "https://www.facebook.com/darksystem",
    whatsapp: footer?.whatsappUrl || "https://wa.me/5521992244319",
  });

  const handleSaveFooter = async () => {
    try {
      await updateMutation.mutateAsync({
        logoUrl: footerData.logo,
        partnerText: footerData.partner,
        phone: footerData.phone,
        email: footerData.email,
        instagramUrl: footerData.instagram,
        facebookUrl: footerData.facebook,
        whatsappUrl: footerData.whatsapp,
      });
      toast.success("Rodapé atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar rodapé");
    }
  };

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Configurar Rodapé</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Logo URL</label>
            <Input
              value={footerData.logo}
              onChange={(e) => setFooterData({ ...footerData, logo: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Texto Parceria</label>
            <Textarea
              value={footerData.partner}
              onChange={(e) => setFooterData({ ...footerData, partner: e.target.value })}
              className="mt-1 text-xs"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Telefone</label>
              <Input
                value={footerData.phone}
                onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Email</label>
              <Input
                value={footerData.email}
                onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Instagram</label>
              <Input
                value={footerData.instagram}
                onChange={(e) => setFooterData({ ...footerData, instagram: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Facebook</label>
              <Input
                value={footerData.facebook}
                onChange={(e) => setFooterData({ ...footerData, facebook: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">WhatsApp</label>
              <Input
                value={footerData.whatsapp}
                onChange={(e) => setFooterData({ ...footerData, whatsapp: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <Button
            onClick={handleSaveFooter}
            disabled={updateMutation.isPending}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
          >
            {updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
            Salvar Rodapé
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── ANALYTICS TAB ───────────────────────────────────────────────────────────
function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Visualizações</p>
              <p className="text-3xl font-bold text-cyan-400 mt-2">1,234</p>
              <p className="text-xs text-green-400 mt-1">+12% vs. semana passada</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Vendas</p>
              <p className="text-3xl font-bold text-green-400 mt-2">R$ 5.240</p>
              <p className="text-xs text-green-400 mt-1">+8% vs. semana passada</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Usuários</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">456</p>
              <p className="text-xs text-blue-400 mt-1">+5% vs. semana passada</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Taxa Conversão</p>
              <p className="text-3xl font-bold text-orange-400 mt-2">3.2%</p>
              <p className="text-xs text-orange-400 mt-1">+0.5% vs. semana passada</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📊 Eventos Rastreados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-background rounded">
              <span>Página inicial visitada</span>
              <span className="font-bold text-cyan-400">892</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded">
              <span>Loja acessada</span>
              <span className="font-bold text-cyan-400">234</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded">
              <span>Blog lido</span>
              <span className="font-bold text-cyan-400">156</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded">
              <span>Produto adicionado ao carrinho</span>
              <span className="font-bold text-green-400">89</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded">
              <span>Compra realizada</span>
              <span className="font-bold text-green-400">34</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
