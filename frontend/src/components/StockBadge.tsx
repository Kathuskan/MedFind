import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface StockBadgeProps {
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export const StockBadge: React.FC<StockBadgeProps> = ({ status }) => {
  switch (status) {
    case 'IN_STOCK':
      return (
        <span className="badge badge-in-stock">
          <CheckCircle2 size={14} /> In Stock
        </span>
      );
    case 'LOW_STOCK':
      return (
        <span className="badge badge-low-stock">
          <AlertTriangle size={14} /> Low Stock
        </span>
      );
    case 'OUT_OF_STOCK':
      return (
        <span className="badge badge-out-of-stock">
          <XCircle size={14} /> Out of Stock
        </span>
      );
    default:
      return null;
  }
};
