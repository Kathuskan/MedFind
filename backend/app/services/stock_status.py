from app.models.stock import StockStatus


class StockStatusService:
    """Service for determining discrete stock status without revealing raw inventory numbers."""

    LOW_STOCK_THRESHOLD = 5

    @classmethod
    def calculate_status(cls, quantity: int) -> StockStatus:
        if quantity <= 0:
            return StockStatus.OUT_OF_STOCK
        elif quantity <= cls.LOW_STOCK_THRESHOLD:
            return StockStatus.LOW_STOCK
        return StockStatus.IN_STOCK

    @classmethod
    def is_reservable(cls, status: StockStatus, is_controlled: bool = False) -> bool:
        """Controlled medicines and out-of-stock items cannot be reserved online."""
        if is_controlled:
            return False
        return status in (StockStatus.IN_STOCK, StockStatus.LOW_STOCK)
