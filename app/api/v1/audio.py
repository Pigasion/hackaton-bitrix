import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.ai_gemini import process_audio_call

router = APIRouter(prefix="/audio", tags=["Audio"])

# Local directory for temporary file storage
UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-call/")
async def upload_call(file: UploadFile = File(...)):
    """
    Receives an MP3 call record, processes it via Gemini AI, and returns extracted data.
    """
    # Validate file type
    if not file.filename.lower().endswith((".mp3", ".wav", ".m4a")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_VALUE,
            detail="Unsupported file format. Please upload MP3, WAV or M4A."
        )

    # Create a unique filename to avoid collisions
    file_ext = os.path.splitext(file.filename)[1]
    temp_filename = f"{uuid.uuid4()}{file_ext}"
    temp_path = os.path.join(UPLOAD_DIR, temp_filename)

    try:
        # Save file locally
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process via Gemini
        result = await process_audio_call(temp_path)
        
        return result

    except Exception as e:
        # Log the error (in a real app) and return a clean error message
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing audio call: {str(e)}"
        )
    finally:
        # Always cleanup the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)
