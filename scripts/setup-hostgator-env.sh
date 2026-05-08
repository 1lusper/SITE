#!/usr/bin/env bash
set -euo pipefail

TARGET_FILE=".env.hostgator"
SOURCE_FILE=".env.hostgator.example"

if [ ! -f "$SOURCE_FILE" ]; then
  echo "Arquivo $SOURCE_FILE não encontrado." >&2
  exit 1
fi

if [ -f "$TARGET_FILE" ]; then
  echo "$TARGET_FILE já existe. Nenhuma alteração feita."
  exit 0
fi

cp "$SOURCE_FILE" "$TARGET_FILE"

echo "$TARGET_FILE criado com sucesso."
echo "Preencha usuário/senha/host antes de rodar o deploy."
