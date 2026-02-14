#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_ROOT=""

cleanup() {
  if [[ -n "${TMP_ROOT}" && -d "${TMP_ROOT}" ]]; then
    rm -rf "${TMP_ROOT}"
  fi
}
trap cleanup EXIT

log_step() {
  printf '[health-check] %s\n' "$1"
}

require_command() {
  local cmd="$1"
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    printf '❌ 缺少命令: %s\n' "${cmd}" >&2
    exit 1
  fi
}

log_step "检查运行环境"
require_command node
require_command npm

cd "${ROOT_DIR}"

log_step "执行测试套件"
npm test --silent

log_step "验证 CLI 核心链路"
TMP_ROOT="$(mktemp -d /tmp/ag-kit-health-check-XXXXXX)"
WORKSPACE_DIR="${TMP_ROOT}/workspace"
INDEX_PATH="${TMP_ROOT}/workspaces.json"
mkdir -p "${WORKSPACE_DIR}"
export AG_KIT_INDEX_PATH="${INDEX_PATH}"

node bin/ag-kit.js init --targets gemini,codex --path "${WORKSPACE_DIR}" --quiet
if [[ "$(node bin/ag-kit.js status --path "${WORKSPACE_DIR}" --quiet)" != "installed" ]]; then
  printf '❌ status 检查失败\n' >&2
  exit 1
fi
node bin/ag-kit.js doctor --path "${WORKSPACE_DIR}" --quiet
node bin/ag-kit.js update --path "${WORKSPACE_DIR}" --quiet
node bin/ag-kit.js update-all --dry-run --quiet
node bin/ag-kit.js exclude add --path "${WORKSPACE_DIR}" --quiet
if ! node bin/ag-kit.js exclude list --quiet | grep -F -q "${WORKSPACE_DIR}"; then
  printf '❌ exclude add 未生效\n' >&2
  exit 1
fi
node bin/ag-kit.js exclude remove --path "${WORKSPACE_DIR}" --quiet
if node bin/ag-kit.js exclude list --quiet | grep -F -q "${WORKSPACE_DIR}"; then
  printf '❌ exclude remove 未生效\n' >&2
  exit 1
fi

log_step "执行清理预检"
npm run clean:dry-run --silent

printf '✅ 健康检查通过\n'
