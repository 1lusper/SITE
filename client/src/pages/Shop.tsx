import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";

export default function Shop() {
  const { data: produtos = [], isLoading } = trpc.products.list.useQuery();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const existing = cart.find(item => item.id === selectedProduct.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === selectedProduct.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...selectedProduct, quantity }]);
    }
    toast.success("Adicionado ao carrinho!");
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.success("Removido do carrinho");
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Carrinho vazio!");
      return;
    }

    // Simular integração com PagSeguro
    const items = cart.map(item => ({
      id: item.id,
      description: item.name,
      quantity: item.quantity,
      amount: (item.price / 100).toFixed(2),
    }));

    const pagseguroData = {
      reference: `DS-${Date.now()}`,
      items: items,
      sender: {
        name: "Cliente Dark System",
        email: "cliente@darksystem.com",
      },
      redirectURL: window.location.origin,
    };

    console.log("PagSeguro Data:", pagseguroData);
    toast.success("Pedido enviado para PagSeguro! (Simulado)");
    setCart([]);
    setShowCart(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400">🛍️ LOJA DARK SYSTEM</h1>
            <p className="text-muted-foreground mt-2">Ingressos, merchandise e muito mais</p>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-3 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 transition"
          >
            <ShoppingCart className="text-cyan-400" size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* CARRINHO FLUTUANTE */}
        {showCart && (
          <Card className="mb-8 border-cyan-500/50 bg-cyan-500/5">
            <CardHeader>
              <CardTitle className="text-cyan-400">🛒 Seu Carrinho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Carrinho vazio</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-background rounded border border-border">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x R$ {(item.price / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-cyan-400">
                          R$ {((item.price * item.quantity) / 100).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <X size={18} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="text-2xl font-bold text-green-400">
                        R$ {(totalPrice / 100).toFixed(2)}
                      </span>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                      💳 Pagar com PagSeguro
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* GRID DE PRODUTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => (
            <Card key={produto.id} className="hover:border-cyan-500 transition group cursor-pointer">
              <CardContent className="pt-4">
                <div className="bg-gradient-to-b from-cyan-500/20 to-transparent rounded-lg h-40 mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <ShoppingCart size={48} className="text-cyan-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{produto.name}</p>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-cyan-400 mb-2">{produto.name}</h3>
                <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{produto.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-400">
                    R$ {(produto.price / 100).toFixed(2)}
                  </span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    Estoque: {produto.quantity}
                  </span>
                </div>
                <Button
                  onClick={() => setSelectedProduct(produto)}
                  disabled={produto.quantity === 0}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
                >
                  {produto.quantity === 0 ? "Fora de Estoque" : "Comprar"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {produtos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Nenhum produto disponível no momento</p>
          </div>
        )}
      </div>

      {/* MODAL DE COMPRA */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-b from-cyan-500/20 to-transparent rounded-lg h-40 flex items-center justify-center">
              <ShoppingCart size={48} className="text-cyan-400" />
            </div>
            <p className="text-foreground/70">{selectedProduct?.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Preço:</span>
              <span className="text-2xl font-bold text-green-400">
                R$ {selectedProduct ? (selectedProduct.price / 100).toFixed(2) : "0.00"}
              </span>
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Quantidade:</label>
              <Input
                type="number"
                min="1"
                max={selectedProduct?.quantity || 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-2"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedProduct(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
              >
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
