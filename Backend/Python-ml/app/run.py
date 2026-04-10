# run.py
# Start the Python ML service.
# Run this file with: python run.py

import uvicorn
import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

if __name__ == "__main__":
    port    = int(os.getenv("PORT", 8000))
    host    = os.getenv("HOST", "0.0.0.0")
    reload  = os.getenv("RELOAD", "true").lower() == "true"
    log_lvl = os.getenv("LOG_LEVEL", "info")

    print(f"""
    ╔══════════════════════════════════════════╗
    ║   India Post ML Service Starting...      ║
    ║   URL:  http://localhost:{port}          ║
    ║   Docs: http://localhost:{port}/docs     ║
    ╚══════════════════════════════════════════╝
    """)

    uvicorn.run(
        "app.main:app",  # file app/main.py, variable named app
        host=host,
        port=port,
        reload=reload,  # auto-restart when code changes
        log_level=log_lvl
    )
