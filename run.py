import uvicorn
import asyncio
from app.main import app

def main():
    """
    Main entry point to run the FastAPI application.
    The Telegram bot is integrated via webhooks and started/stopped 
    within the FastAPI lifespan (see app/main.py).
    """
    print("Starting Omnichannel CRM Backend (FastAPI + Telegram Bot via Webhook)...")
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )

if __name__ == "__main__":
    main()
