import json
import logging
from typing import Optional, Dict, Any
from backend.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._client = None
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._client = genai.GenerativeModel(self.model_name)
                logger.info(f"Initialized Gemini model {self.model_name}")
            except Exception as e:
                logger.warning(f"Could not initialize Google Generative AI client: {e}")

    def is_configured(self) -> bool:
        return bool(self.api_key and self._client)

    async def generate_json(self, prompt: str, image_bytes: Optional[bytes] = None, mime_type: str = "image/jpeg") -> Optional[Dict[str, Any]]:
        if not self.is_configured():
            return None

        try:
            import google.generativeai as genai
            contents = [prompt]
            if image_bytes:
                contents.append({
                    "mime_type": mime_type,
                    "data": image_bytes
                })

            response = self._client.generate_content(
                contents,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )

            text = response.text.strip()
            # Clean possible markdown wrapping
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()

            return json.loads(text)
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            return None

    async def generate_text(self, prompt: str, chat_history: Optional[list] = None) -> Optional[str]:
        if not self.is_configured():
            return None

        try:
            import google.generativeai as genai
            full_prompt = prompt
            if chat_history:
                context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history])
                full_prompt = f"Previous conversation:\n{context}\n\nUser Question: {prompt}"

            response = self._client.generate_content(
                full_prompt,
                generation_config=genai.GenerationConfig(temperature=0.3)
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini text generation failed: {e}")
            return None

gemini_service = GeminiService()
