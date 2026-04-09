import asyncio
import json
import os
import google.generativeai as genai
from app.core.config import settings

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

async def process_audio_call(file_path: str) -> dict:
    """
    Uploads an MP3 file to Gemini, waits for processing, and extracts metadata.
    """
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    # upload_file is a blocking call in google-generativeai==0.4.1
    audio_file = await asyncio.to_thread(genai.upload_file, path=file_path)
    
    # Wait for file to be active
    while audio_file.state.name == "PROCESSING":
        await asyncio.sleep(2)
        audio_file = await asyncio.to_thread(genai.get_file, audio_file.name)
        
    if audio_file.state.name == "FAILED":
        raise ValueError(f"Gemini failed to process audio: {audio_file.error.message}")

    prompt = (
        "Ты ИИ-ассистент отдела продаж B2B. Прослушай звонок. "
        "Выведи транскрипцию. Извлеки Имя клиента, Телефон, Суть запроса и Настроение клиента. "
        "Верни ответ строго в формате JSON."
    )
    
    # Using JSON mode if supported (0.4.1 might not have native response_mime_type in all regions, 
    # but we'll try config as requested)
    generation_config = {"response_mime_type": "application/json"}
    
    response = await model.generate_content_async(
        [prompt, audio_file],
        generation_config=generation_config
    )
    
    # Cleanup file from Gemini File API (optional but good practice)
    # await asyncio.to_thread(genai.delete_file, audio_file.name)
    
    return json.loads(response.text)

async def summarize_chat(messages: list[str]) -> str:
    """
    Summarizes the chat history into a brief summary.
    """
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"Проверь историю сообщений и сделай краткую выжимку (итоги, договоренности):\n\n" + "\n".join(messages)
    
    response = await model.generate_content_async(prompt)
    return response.text.strip()

async def generate_manager_hint(messages: list[str]) -> str:
    """
    Generates a brief (1-2 sentences) business hint for the manager.
    """
    model = genai.GenerativeModel("gemini-1.5-flash")
    context = "\n".join(messages)
    prompt = (
        f"Проанализируй последние сообщения диалога между клиентом и менеджером:\n{context}\n\n"
        "Дай короткую (1-2 предложения) бизнес-подсказку менеджеру: что спросить или предложить, чтобы не потерять клиента."
    )
    
    response = await model.generate_content_async(prompt)
    return response.text.strip()

async def is_technical_request(text: str) -> bool:
    """
    Evaluates if a user's request contains complex technical terms
    or requires a technologist's assistance.
    """
    if not text:
        return False
        
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = (
        f"Проанализируй следующий запрос:\n'{text}'\n\n"
        "Определи, является ли этот запрос сложным, техническим, или требующим "
        "глубокой технологической проработки (например, спецификации, схемы, "
        "параметры материалов). Ответь СТРОГО одним словом: 'true' если да, "
        "или 'false' если нет."
    )
    
    response = await model.generate_content_async(prompt)
    result_text = response.text.strip().lower()
    return result_text == "true"
