#!/usr/bin/env bash
set -euo pipefail

if [ -f .env.hostgator ]; then
  # shellcheck disable=SC1091
  source .env.hostgator
fi

: "${HOSTGATOR_FTP_HOST:?Defina HOSTGATOR_FTP_HOST}"
: "${HOSTGATOR_FTP_USER:?Defina HOSTGATOR_FTP_USER}"
: "${HOSTGATOR_FTP_PASS:?Defina HOSTGATOR_FTP_PASS}"

FTP_PROTOCOL="${HOSTGATOR_FTP_PROTOCOL:-ftp}"
FTP_PORT="${HOSTGATOR_FTP_PORT:-}"
BASE_URL="$FTP_PROTOCOL://$HOSTGATOR_FTP_HOST"
if [ -n "$FTP_PORT" ]; then
  BASE_URL="$BASE_URL:$FTP_PORT"
fi

echo "Testando conexão FTP em $BASE_URL ..."

curl --silent --show-error --fail --list-only \
  --user "$HOSTGATOR_FTP_USER:$HOSTGATOR_FTP_PASS" \
  "$BASE_URL/" >/dev/null

echo "Conexão FTP OK."
