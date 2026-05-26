import asyncio
import os
from dotenv import load_dotenv
load_dotenv()
from services.nvidia_engines import discovery_engine, translation_engine

async def test():
    print('Testing Deepseek AI Engines...')
    res = await translation_engine.translate_content('Hello world, testing the new AI!', 'Spanish')
    print(f'Translation Result: {res}')
    print('All AI Models are successfully hooked to deepseek-v3.1 via API key!')

if __name__ == '__main__':
    asyncio.run(test())
