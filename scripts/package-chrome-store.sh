#!/usr/bin/env bash
# Chrome ウェブストア提出用 ZIP を生成する（manifest / assets / src のみ同梱）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VER=$(grep -m1 '"version"' "${ROOT}/manifest.json" | sed 's/.*"version": *"\([^"]*\)".*/\1/')
DOWNLOAD="${ROOT}/download"
OUT="${DOWNLOAD}/SITRUS_EX-chrome-store-v${VER}.zip"
cd "${ROOT}"
mkdir -p "${DOWNLOAD}"
rm -f "${OUT}"
zip -r "${OUT}" manifest.json assets src -x "*.DS_Store" "*__MACOSX*"
echo "Created: ${OUT}"
echo "→ Chrome Web Store の「パッケージ」にこの ZIP をアップロードしてください。"
