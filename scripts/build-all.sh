#!/usr/bin/env bash
# Gera o build de produção de todos os clientes (ou dos que você passar).
# Uso: ./scripts/build-all.sh            -> todos
#      ./scripts/build-all.sh movva       -> só movva
set -euo pipefail
cd "$(dirname "$0")/.."

PLATFORM="${PLATFORM:-all}"
CLIENTS=("$@")
if [ ${#CLIENTS[@]} -eq 0 ]; then
  CLIENTS=($(ls clients))
fi

for c in "${CLIENTS[@]}"; do
  echo "==> Build de $c ($PLATFORM)"
  CLIENT="$c" npx eas build --profile "$c" --platform "$PLATFORM" --non-interactive --no-wait
done
