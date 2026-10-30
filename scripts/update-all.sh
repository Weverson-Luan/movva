#!/usr/bin/env bash
# Envia uma atualização OTA (EAS Update) para o canal de produção de cada cliente.
# Uso: ./scripts/update-all.sh "Mensagem da atualização" [cliente ...]
set -euo pipefail
cd "$(dirname "$0")/.."

MSG="${1:?Informe a mensagem da atualização}"
shift
CLIENTS=("$@")
if [ ${#CLIENTS[@]} -eq 0 ]; then
  CLIENTS=($(ls clients))
fi

for c in "${CLIENTS[@]}"; do
  echo "==> Update de $c"
  CLIENT="$c" npx eas update --channel production --message "$MSG" --non-interactive
done
