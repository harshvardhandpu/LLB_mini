#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AI_VENV="$PROJECT_ROOT/.ai-venv"
AI_APP="$PROJECT_ROOT/ai-service-python/app/main.py"
BACKEND_JAR="$PROJECT_ROOT/backend-springboot/target/legal-document-analyzer-1.0.0.jar"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

PID_DIR="$PROJECT_ROOT/.run"
LOG_DIR="$PID_DIR/logs"

AI_PID_FILE="$PID_DIR/ai.pid"
BACKEND_PID_FILE="$PID_DIR/backend.pid"
FRONTEND_PID_FILE="$PID_DIR/frontend.pid"

AI_LOG="$LOG_DIR/ai.log"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"

require_cmd() {
    local cmd="$1"
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Missing required command: $cmd" >&2
        exit 1
    fi
}

is_running() {
    local pid_file="$1"
    if [[ -f "$pid_file" ]]; then
        local pid
        pid="$(cat "$pid_file")"
        if [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1; then
            return 0
        fi
        rm -f "$pid_file"
    fi
    return 1
}

wait_for_url() {
    local url="$1"
    local name="$2"
    local attempts="${3:-60}"
    local delay="${4:-2}"

    for ((i = 1; i <= attempts; i++)); do
        if curl -fsS "$url" >/dev/null 2>&1; then
            echo "$name is ready: $url"
            return 0
        fi
        sleep "$delay"
    done

    echo "$name did not become ready in time. Check logs in $LOG_DIR" >&2
    return 1
}

mkdir -p "$PID_DIR" "$LOG_DIR"

require_cmd python3
require_cmd java
require_cmd curl

if [[ ! -x "$AI_VENV/bin/python" ]]; then
    echo "AI virtual environment not found at $AI_VENV" >&2
    echo "Create it first with:" >&2
    echo "  python3.11 -m venv .ai-venv" >&2
    echo "  source .ai-venv/bin/activate" >&2
    echo "  pip install --upgrade pip" >&2
    echo "  pip install \"Flask>=3.0.0,<4.0.0\" \"Flask-CORS>=4.0.0\" \"transformers>=4.30.0,<5.0.0\" \"sentencepiece>=0.1.99\" \"protobuf>=4.20.0,<5.0.0\" \"requests>=2.31.0,<3.0.0\"" >&2
    echo "  pip install \"torch==2.3.1\" --index-url https://download.pytorch.org/whl/cpu" >&2
    exit 1
fi

if [[ ! -f "$BACKEND_JAR" ]]; then
    echo "Backend jar not found at $BACKEND_JAR" >&2
    echo "Build it first, for example with Maven." >&2
    exit 1
fi

if ! is_running "$AI_PID_FILE"; then
    echo "Starting AI service..."
    nohup env PYTHONUNBUFFERED=1 "$AI_VENV/bin/python" "$AI_APP" >"$AI_LOG" 2>&1 &
    echo $! >"$AI_PID_FILE"
else
    echo "AI service already running"
fi

if ! is_running "$BACKEND_PID_FILE"; then
    echo "Starting Spring backend..."
    nohup java -jar "$BACKEND_JAR" >"$BACKEND_LOG" 2>&1 &
    echo $! >"$BACKEND_PID_FILE"
else
    echo "Spring backend already running"
fi

if ! is_running "$FRONTEND_PID_FILE"; then
    echo "Starting frontend..."
    nohup python3 -m http.server 3000 --directory "$FRONTEND_DIR" >"$FRONTEND_LOG" 2>&1 &
    echo $! >"$FRONTEND_PID_FILE"
else
    echo "Frontend already running"
fi

wait_for_url "http://127.0.0.1:5000/health" "AI service" 180 2
wait_for_url "http://127.0.0.1:8080/api/documents/health" "Spring backend" 60 2
wait_for_url "http://127.0.0.1:3000" "Frontend" 30 1

cat <<EOF

Application started successfully.

Open in browser:
  http://localhost:3000

Logs:
  $AI_LOG
  $BACKEND_LOG
  $FRONTEND_LOG

To stop everything:
  ./stop-all.sh
EOF
