"""Data Retention Cleanup Job for expired student grading file uploads."""

import os
import sys
import asyncio
from datetime import datetime

# Add root folder to sys path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.session import DatabaseEngine
from models.foundation import GradingFile
from sqlalchemy import select, update
from loguru import logger


async def cleanup_expired_files():
    logger.info("Starting data retention cleanup job for expired files...")
    session_maker = DatabaseEngine.get_session_maker()
    now = datetime.utcnow()
    
    async with session_maker() as session:
        try:
            # Query all files where expires_at is in the past and deleted_at is not set
            stmt = select(GradingFile).where(
                GradingFile.expires_at < now,
                GradingFile.deleted_at == None
            )
            result = await session.execute(stmt)
            expired_files = result.scalars().all()
            
            if not expired_files:
                logger.info("No expired grading uploads found for cleanup.")
                return
                
            logger.info(f"Found {len(expired_files)} expired files to clean up.")
            
            for g_file in expired_files:
                storage_path = g_file.storage_path
                
                # Check if file exists and delete it
                if os.path.exists(storage_path):
                    try:
                        os.remove(storage_path)
                        logger.info(f"Successfully deleted local file: {storage_path}")
                    except Exception as fe:
                        logger.error(f"Failed to delete physical file {storage_path}: {fe}")
                else:
                    logger.warning(f"Physical file {storage_path} not found on disk. Marking as deleted in DB.")
                
                # Update DB state
                g_file.deleted_at = now
                
            await session.commit()
            logger.info("Data retention cleanup job finished successfully!")
            
        except Exception as e:
            await session.rollback()
            logger.error(f"Error during expired files cleanup: {e}")
            raise e


if __name__ == "__main__":
    asyncio.run(cleanup_expired_files())
