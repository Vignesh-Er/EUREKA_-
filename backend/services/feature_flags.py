"""Feature flag service to control wave-based module visibility."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from models.foundation import FeatureFlag
from loguru import logger


class FeatureFlags:
    """Manages wave-based feature flags stored in the database."""

    async def is_enabled(self, db: AsyncSession, flag_name: str) -> bool:
        """Check if a feature flag is enabled in the database."""
        try:
            stmt = select(FeatureFlag).where(FeatureFlag.flag_name == flag_name).limit(1)
            result = await db.execute(stmt)
            flag = result.scalar_one_or_none()
            return flag.enabled if flag else False
        except Exception as e:
            logger.error(f"Error checking feature flag '{flag_name}': {e}")
            return False

    async def set_flag(self, db: AsyncSession, flag_name: str, enabled: bool) -> bool:
        """Admin-only toggle for feature flags."""
        try:
            stmt = update(FeatureFlag).where(FeatureFlag.flag_name == flag_name).values(enabled=enabled)
            result = await db.execute(stmt)
            await db.flush()
            logger.info(f"Feature flag '{flag_name}' updated to {enabled}")
            return result.rowcount > 0
        except Exception as e:
            logger.error(f"Failed to set feature flag '{flag_name}': {e}")
            return False


feature_flags = FeatureFlags()
