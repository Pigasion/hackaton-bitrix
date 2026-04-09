import os
import uuid
import logging
import aiofiles
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api.deps import get_session
from app.models.client import Client, ClientGrade
from app.services.ai_gemini import process_audio_call
from app.services.bitrix import bitrix_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/audio", tags=["Audio"])

# Local directory for temporary file storage
UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-call/")
async def upload_call(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_session),
):
    """
    Receives an MP3/WAV/M4A call record, transcribes it via Gemini AI,
    creates/updates the client in the DB, and creates a Bitrix24 lead
    with an attached transcription comment — all in a single batch HTTP request.
    """
    if not file.filename.lower().endswith((".mp3", ".wav", ".m4a")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload MP3, WAV or M4A.",
        )

    # Build unique temp path
    file_ext = os.path.splitext(file.filename)[1]
    temp_filename = f"{uuid.uuid4()}{file_ext}"
    temp_path = os.path.join(UPLOAD_DIR, temp_filename)

    try:
        # --- Save file asynchronously (non-blocking) ---
        async with aiofiles.open(temp_path, "wb") as out_file:
            content = await file.read()
            await out_file.write(content)

        # --- Transcribe & extract metadata via Gemini ---
        # Expected keys: client_name, phone, request_summary, sentiment, transcription
        result: dict = await process_audio_call(temp_path)

        # --- Upsert client in DB ---
        phone: str | None = result.get("phone")
        client_name: str = result.get("client_name", "Неизвестный клиент")

        client: Client | None = None
        if phone:
            db_result = await session.execute(
                select(Client).where(Client.phone == phone)
            )
            client = db_result.scalars().first()

        if not client:
            client = Client(
                name=client_name,
                phone=phone,
                grade=ClientGrade.new,
            )
            session.add(client)
            await session.flush()  # populate client.id
            logger.info(f"Created new client from call: {client_name} ({phone})")
        else:
            logger.info(f"Matched existing client: {client.name} (id={client.id})")

        await session.commit()

        # --- Create Bitrix24 lead + transcription comment in ONE batch call ---
        lead_data = {
            "TITLE": f"Звонок: {client_name}",
            "NAME": client_name,
            "PHONE": phone or "",
            "COMMENTS": result.get("request_summary", ""),
            "OPENED": "Y",
        }
        transcription_comment = (
            f"Транскрипция звонка:\n{result.get('transcription', '')}\n\n"
            f"Настроение клиента: {result.get('sentiment', 'не определено')}"
        )

        try:
            await bitrix_client.create_lead_with_comment(lead_data, transcription_comment)
        except Exception as bitrix_err:
            # Don't fail the whole request if Bitrix is unavailable
            logger.error(f"Bitrix24 batch call failed: {bitrix_err}")

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error processing audio call: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing audio call: {str(e)}",
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
