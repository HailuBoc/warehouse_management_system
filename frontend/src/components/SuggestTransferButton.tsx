import React from 'react';
import { useShortages } from '../hooks/useShortages.js';

interface SuggestTransferButtonProps {
  productId: number;
  onTransferClick: (productId: number) => void;
}

export const SuggestTransferButton: React.FC<SuggestTransferButtonProps> = ({
  productId,
  onTransferClick,
}) => {
  const { data: shortages, isLoading } = useShortages();

  const hasShortage = shortages?.some((s) => s.productId === productId);

  if (!hasShortage || isLoading) {
    return null;
  }

  return (
    <button
      onClick={() => onTransferClick(productId)}
      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
    >
      Suggest Transfer
    </button>
  );
};
