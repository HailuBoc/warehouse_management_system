import React from 'react';

interface SuggestTransferButtonProps {
  productId: number;
  onTransferClick: (productId: number) => void;
  fullWidth?: boolean;
}

export const SuggestTransferButton: React.FC<SuggestTransferButtonProps> = ({
  productId,
  onTransferClick,
  fullWidth = false,
}) => (
  <button
    onClick={() => onTransferClick(productId)}
    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5
                bg-blue-500 text-white text-sm font-medium rounded-lg
                hover:bg-blue-600 active:bg-blue-700 active:scale-95
                transition-all duration-75 select-none cursor-pointer
                ${fullWidth ? 'w-full py-2.5' : ''}`}
  >
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
    Transfer Stock
  </button>
);
