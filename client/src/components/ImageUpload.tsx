import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label?: string;
  currentImage?: string;
}

export function ImageUpload({ onUpload, label = "Upload Imagem", currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande (máx 5MB)");
      return;
    }

    setUploading(true);
    try {
      // Criar FormData
      const formData = new FormData();
      formData.append("file", file);

      // Fazer upload para o servidor
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro no upload");
      }

      const data = await response.json();
      setPreview(data.url);
      onUpload(data.url);
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar imagem");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>

      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-cyan-500/50"
          />
          <button
            onClick={() => {
              setPreview(null);
              onUpload("");
            }}
            className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-600 rounded"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Enviando...
            </>
          ) : (
            <>
              <Upload size={16} className="mr-2" />
              Selecionar Imagem
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Máx 5MB • PNG, JPG, GIF
      </p>
    </div>
  );
}
