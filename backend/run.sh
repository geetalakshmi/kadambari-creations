#!/usr/bin/env bash
set -euo pipefail
export PYTHONUNBUFFERED=1
# Load .env if present
if [ -f .env ]; then
  export $(grep -v '^#' .env | sed 's/#.*//' | xargs)
fi
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
