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
FTP_PROTOCOL="${HOSTGATOR_FTP_PROTOCOL:-ftp}"
FTP_PORT="${HOSTGATOR_FTP_PORT:-}"
LOCAL_DIR="${HOSTGATOR_PUBLIC_ONLY_DIR:-client/public}"
BASE_URL="$FTP_PROTOCOL://$HOSTGATOR_FTP_HOST"
if [ -n "$FTP_PORT" ]; then
  BASE_URL="$BASE_URL:$FTP_PORT"
fi

if [ ! -d "$LOCAL_DIR" ]; then
  echo "Pasta $LOCAL_DIR não encontrada." >&2
  exit 1
fi

echo "Upload rápido (public-only): $LOCAL_DIR -> $REMOTE_DIR"

find "$LOCAL_DIR" -type f -print0 | while IFS= read -r -d '' file; do
  rel="${file#$LOCAL_DIR/}"
  curl --silent --show-error --fail --ftp-create-dirs \
    --user "$HOSTGATOR_FTP_USER:$HOSTGATOR_FTP_PASS" \
    -T "$file" "$BASE_URL/$REMOTE_DIR/$rel"
done

echo "Public-only deploy finalizado."
