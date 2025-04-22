#!/bin/bash

APP_LEVEL=$APP_LEVEL
export PATH="/root/.nvm/versions/node/v22.14.0/bin:$PATH"

# Run alembic revisions
cd /project
pdm run alembic upgrade head

if [ "$APP_LEVEL" == "PROD" ]; then
    export FRONTEND_COMMAND="npm run start"
    export BACKEND_COMMAND="pdm run python -m uvicorn src.saas_backend.app:app --host 0.0.0.0 --port 8000"
else
    export FRONTEND_COMMAND="npm run dev"
    export BACKEND_COMMAND="pdm run python -m uvicorn src.saas_backend.app:app --reload --host 0.0.0.0 --port 8000"
fi

/usr/bin/supervisord -c /etc/supervisor/supervisord.conf
