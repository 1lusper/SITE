#!/usr/bin/env bash
set -euo pipefail

if [ -f .env.hostgator ]; then
  # shellcheck disable=SC1091
  source .env.hostgator
fi

: "${HOSTGATOR_FTP_HOST:?Defina HOSTGATOR_FTP_HOST}"
: "${HOSTGATOR_FTP_USER:?Defina HOSTGATOR_FTP_USER}"
: "${HOSTGATOR_FTP_PASS:?Defina HOSTGATOR_FTP_PASS}"

REMOTE_DIR="${HOSTGATOR_FTP_REMOTE_DIR:-public_html}"
LOCAL_DIR="${HOSTGATOR_FTP_LOCAL_DIR:-deploy/hostgator/public_html}"
FTP_PROTOCOL="${HOSTGATOR_FTP_PROTOCOL:-ftp}"
FTP_PORT="${HOSTGATOR_FTP_PORT:-}"
BASE_URL="$FTP_PROTOCOL://$HOSTGATOR_FTP_HOST"
if [ -n "$FTP_PORT" ]; then
  BASE_URL="$BASE_URL:$FTP_PORT"
fi

if [ ! -d "$LOCAL_DIR" ]; then
  echo "Pasta $LOCAL_DIR não encontrada. Rode: pnpm run deploy:hostgator" >&2
  exit 1
fi

echo "Enviando $LOCAL_DIR para $HOSTGATOR_FTP_HOST:$REMOTE_DIR ..."

if command -v lftp >/dev/null 2>&1; then
  lftp -u "$HOSTGATOR_FTP_USER","$HOSTGATOR_FTP_PASS" "$HOSTGATOR_FTP_HOST" <<LFTP_CMDS
set ftp:ssl-allow no
set net:max-retries 2
set net:timeout 20
mirror -R --delete --verbose "$LOCAL_DIR" "$REMOTE_DIR"
bye
LFTP_CMDS
elif command -v curl >/dev/null 2>&1; then
  echo "lftp não encontrado. Usando fallback com curl (sem delete remoto automático)."
  find "$LOCAL_DIR" -type d -print0 | while IFS= read -r -d '' dir; do
    rel="${dir#$LOCAL_DIR/}"
    [ "$dir" = "$LOCAL_DIR" ] && rel=""
    curl --silent --show-error --fail --ftp-create-dirs \
      --user "$HOSTGATOR_FTP_USER:$HOSTGATOR_FTP_PASS" \
      -T /dev/null "$BASE_URL/$REMOTE_DIR/$rel/.keep" >/dev/null || true
  done

  find "$LOCAL_DIR" -type f -print0 | while IFS= read -r -d '' file; do
    rel="${file#$LOCAL_DIR/}"
    curl --silent --show-error --fail --ftp-create-dirs \
      --user "$HOSTGATOR_FTP_USER:$HOSTGATOR_FTP_PASS" \
      -T "$file" "$BASE_URL/$REMOTE_DIR/$rel"
  done
else
  echo "Erro: nem lftp nem curl estão disponíveis para deploy FTP." >&2
  exit 1
fi

echo "Deploy direto finalizado com sucesso."
