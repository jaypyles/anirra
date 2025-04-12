#!/bin/bash

if [ "$APP_MODE" = "dev" ]; then
    pdm run python -m uvicorn src.saas_backend.app:app --reload --host 0.0.0.0 --port 8000
else
    pdm run python -m uvicorn src.saas_backend.app:app --host 0.0.0.0 --port 8000
fi

