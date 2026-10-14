"""Default MedFind Seeder pointing to comprehensive Sri Lanka nationwide data."""

import asyncio
from app.seed_srilanka import seed_srilanka_dataset


async def seed_data():
    await seed_srilanka_dataset()


if __name__ == "__main__":
    asyncio.run(seed_data())
