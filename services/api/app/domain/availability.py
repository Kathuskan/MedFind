from datetime import UTC, datetime, timedelta


def as_utc(value: datetime) -> datetime:
    # SQLite drops timezone metadata; persisted dates are always UTC.
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value.astimezone(UTC)


def stock_state(status: str, confirmed_at: datetime | None, disputed: bool, now: datetime):
    expires_at = as_utc(confirmed_at) + timedelta(hours=24) if confirmed_at else None
    fresh = bool(confirmed_at and not disputed and as_utc(confirmed_at) <= now < expires_at)
    return (status if fresh else "UNCONFIRMED"), expires_at
