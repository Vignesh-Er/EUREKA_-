import traceback, asyncio, httpx  
from api.routes.exam_prep import NVIDIA_NIM_API_KEY, DEEPSEEK_URL  
async def run():  
 try:  
  async with httpx.AsyncClient() as c:  
   r = await c.post(DEEPSEEK_URL, headers={'Authorization': f'Bearer {NVIDIA_NIM_API_KEY}'}, json={'model': 'deepseek-ai/deepseek-v3.2', 'messages': [{'role': 'user', 'content': 'hi'}], 'max_tokens': 100}, timeout=60.0)  
   r.raise_for_status()  
   print(r.text)  
 except Exception as e:  
  print('Except:', str(e)); traceback.print_exc()  
asyncio.run(run())  
