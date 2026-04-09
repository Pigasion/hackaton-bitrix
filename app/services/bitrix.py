import asyncio
import logging
import httpx
from typing import Any, Dict, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class BitrixClient:
    def __init__(self):
        # Ensure the webhook URL correctly ends with a slash or doesn't depending on usage
        self.webhook_url = settings.BITRIX_WEBHOOK_URL.rstrip('/')
        self.client = httpx.AsyncClient(timeout=10.0)

    async def _call_api(self, method: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Base method to call Bitrix24 REST API with retry logic for rate limits.
        """
        url = f"{self.webhook_url}/{method}"
        max_retries = 3
        base_delay = 1.0

        for attempt in range(max_retries):
            try:
                response = await self.client.post(url, json=params or {})
                response.raise_for_status()
                data = response.json()

                if "error" in data:
                    is_limit_exceeded = (
                        data.get("error") == "QUERY_LIMIT_EXCEEDED" or 
                        data.get("error_description", "") == "QUERY_LIMIT_EXCEEDED"
                    )
                    if is_limit_exceeded:
                        logger.warning(
                            f"Bitrix Rate Limit Exceeded. Retrying in {base_delay}s... "
                            f"(Attempt {attempt + 1}/{max_retries})"
                        )
                        await asyncio.sleep(base_delay)
                        base_delay *= 2  # Exponential backoff
                        continue
                    else:
                        logger.error(f"Bitrix API Error: {data}")
                        raise ValueError(f"Bitrix API returned error: {data.get('error')} - {data.get('error_description')}")
                
                return data

            except httpx.HTTPStatusError as e:
                # If HTTP status is 429/503 we also treat it as limit/overload
                if e.response.status_code in (429, 502, 503, 504) and attempt < max_retries - 1:
                     logger.warning(
                         f"Bitrix HTTP Status {e.response.status_code}. Retrying in {base_delay}s... "
                         f"(Attempt {attempt + 1}/{max_retries})"
                     )
                     await asyncio.sleep(base_delay)
                     base_delay *= 2
                     continue
                logger.error(f"HTTP error occurred while calling Bitrix: {e}")
                raise

        raise Exception("Max retries reached while calling Bitrix24 API")

    async def find_contact_by_phone_or_email(
        self, 
        identifier: str
    ) -> Optional[Dict[str, Any]]:
        """
        Finds a contact in Bitrix24 by phone or email.
        """
        filter_params = {}
        if "@" in identifier:
            filter_params["EMAIL"] = identifier
        else:
            filter_params["PHONE"] = identifier

        params = {
            "filter": filter_params,
            "select": ["ID", "NAME", "LAST_NAME", "PHONE", "EMAIL", "ASSIGNED_BY_ID"]
        }

        response = await self._call_api("crm.contact.list", params)
        result = response.get("result", [])
        if result:
             return result[0]
        return None

    async def create_lead(self, data: dict) -> int:
        """
        Creates a new lead in Bitrix24 and returns its ID.
        """
        params = {"fields": data}
        response = await self._call_api("crm.lead.add", params)
        
        return int(response.get("result"))

    async def close(self):
        await self.client.aclose()

# Global instance for use in dependency injection or directly
bitrix_client = BitrixClient()
