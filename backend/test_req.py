import asyncio, httpx  
from api.routes.exam_prep import NVIDIA_NIM_API_KEY, DEEPSEEK_URL  
async def run():  
    async with httpx.AsyncClient() as c:  
        r = await c.post(DEEPSEEK_URL, headers={'Authorization': f'Bearer {NVIDIA_NIM_API_KEY}'}, json={'model': 'deepseek-ai/deepseek-v3.2', 'messages': [{'role': 'user', 'content': 'hi'}], 'max_tokens': 100})  
        print(r.status_code, r.text)  
asyncio.run(run())  
