"""Prompt registry for version control, rollback, and auditing of AI prompts."""

import os
from datetime import datetime
from typing import List, Optional
import yaml
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from models.foundation import PromptVersion
from loguru import logger


class PromptRegistry:
    """Manages prompt templates with versioning, dynamic overrides, and fallbacks."""

    def __init__(self, prompts_dir: str = "prompts"):
        self.prompts_dir = prompts_dir

    def _get_fallback_prompt(self, engine_name: str) -> str:
        """Reads default prompt template from YAML file in prompts folder."""
        file_path = os.path.join(self.prompts_dir, f"{engine_name}.yaml")
        if not os.path.exists(file_path):
            # Absolute fallback if YAML does not exist
            return f"You are a helpful assistant for the {engine_name} engine. Provide clear, academic advice."
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
                return data.get("prompt_template", "")
        except Exception as e:
            logger.error(f"Failed to read default prompt YAML for {engine_name}: {e}")
            return ""

    async def get_active_prompt(self, db: AsyncSession, engine_name: str) -> str:
        """Returns the active prompt template. Falls back to embedded YAML/default."""
        try:
            stmt = select(PromptVersion).where(
                PromptVersion.engine_name == engine_name,
                PromptVersion.is_active == True
            ).limit(1)
            result = await db.execute(stmt)
            active_version = result.scalar_one_or_none()
            
            if active_version:
                return active_version.prompt_template
        except Exception as e:
            logger.error(f"Database error loading prompt for {engine_name}: {e}")

        # Fallback to YAML definitions
        return self._get_fallback_prompt(engine_name)

    async def register_prompt(
        self, db: AsyncSession, engine_name: str, template: str, version: str, created_by: str
    ) -> PromptVersion:
        """Registers a new version (does NOT activate it)."""
        new_prompt = PromptVersion(
            engine_name=engine_name,
            version=version,
            prompt_template=template,
            is_active=False,
            created_by=created_by,
            created_at=datetime.utcnow()
        )
        db.add(new_prompt)
        await db.flush()
        logger.info(f"Registered new prompt version {version} for {engine_name} by {created_by}")
        return new_prompt

    async def activate_prompt(self, db: AsyncSession, engine_name: str, version: str, activated_by: str) -> bool:
        """Sets a version as active. Deactivates previous active version."""
        # Find prompt to activate
        stmt = select(PromptVersion).where(
            PromptVersion.engine_name == engine_name,
            PromptVersion.version == version
        ).limit(1)
        result = await db.execute(stmt)
        target = result.scalar_one_or_none()
        
        if not target:
            logger.warning(f"Failed to activate prompt: version {version} not found for {engine_name}")
            return False

        # Deactivate all active prompts for this engine
        deactivate_stmt = (
            update(PromptVersion)
            .where(PromptVersion.engine_name == engine_name, PromptVersion.is_active == True)
            .values(is_active=False)
        )
        await db.execute(deactivate_stmt)

        # Activate target
        target.is_active = True
        target.activated_at = datetime.utcnow()
        await db.flush()
        logger.info(f"Activated prompt version {version} for {engine_name} by {activated_by}")
        return True

    async def rollback_prompt(self, db: AsyncSession, engine_name: str, activated_by: str) -> bool:
        """Reactivates the previously created active version."""
        # Find all versions for this engine sorted by created_at descending
        stmt = select(PromptVersion).where(PromptVersion.engine_name == engine_name).order_by(PromptVersion.created_at.desc())
        result = await db.execute(stmt)
        versions = result.scalars().all()

        if len(versions) < 2:
            logger.warning(f"Cannot rollback: less than 2 prompt versions exist for {engine_name}")
            return False

        # The current active one might be index 0 or somewhere else. Find the next one in creation order.
        current_active = next((v for v in versions if v.is_active), None)
        
        # Deactivate current active
        if current_active:
            current_active.is_active = False

        # Activate the next most recent one
        next_active = next((v for v in versions if v != current_active), None)
        if next_active:
            next_active.is_active = True
            next_active.activated_at = datetime.utcnow()
            await db.flush()
            logger.info(f"Rolled back prompt for {engine_name} to version {next_active.version} by {activated_by}")
            return True

        return False

    async def list_versions(self, db: AsyncSession, engine_name: str) -> List[dict]:
        """Returns all versions for a given engine."""
        stmt = select(PromptVersion).where(PromptVersion.engine_name == engine_name).order_by(PromptVersion.created_at.desc())
        result = await db.execute(stmt)
        versions = result.scalars().all()
        return [
            {
                "id": v.id,
                "engine_name": v.engine_name,
                "version": v.version,
                "prompt_template": v.prompt_template,
                "is_active": v.is_active,
                "created_by": v.created_by,
                "created_at": v.created_at.isoformat() if v.created_at else None,
                "activated_at": v.activated_at.isoformat() if v.activated_at else None,
            }
            for v in versions
        ]


prompt_registry = PromptRegistry(prompts_dir=os.path.join(os.path.dirname(os.path.dirname(__file__)), "prompts"))
