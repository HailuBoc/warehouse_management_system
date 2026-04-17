import React, { useState, useEffect } from 'react';
import { useShortages } from '../hooks/useShortages.js';
import { useProducts } from '../hooks/useProducts.js';
import { useTransfer } from '../hooks/useTransfer.js';
import { TransferRequest } from '../types/index.js';

interface TransferFormProps {
  productId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({
  productId,
  onClose,
  onSuccess,
}) => {
  const { data: shortages } = useShortages();
  const { data: products } = useProducts();
  const { mutate: transfer, isPending, error, reset } = useTransfer();

  const [fromWarehouse, setFromWarehouse] = useState<number | ''>('');
  const [toWarehouse, setToWarehouse]     = useState<number | ''>('');
  const [quantity, setQuantity]           = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-populate suggested warehouses from shortage data
  useEffect(() => {
    const match = shortages?.find((s) => s.productId === productId);
    if (match) {
      setToWarehouse(match.shortageWarehouseId);
      if (match.suggestedSourceWarehouseId) {
        setFromWarehouse(match.suggestedSourceWarehouseId);
      }
    }
  }, [productId, shortages]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPending, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    reset();

    const qty = parseInt(quantity, 10);

    if (!fromWarehouse || !toWarehouse) {
      setValidationError('Please select both warehouses.');
      return;
    }
    if (fromWarehouse === toWarehouse) {
      setValidationError('Source and destination warehouses must be different.');
      return;
    }
    if (!quantity || isNaN(qty) || qty < 1) {
      setValidationError('Please enter a valid quantity (minimum 1).');
      return;
    }

    const request: TransferRequest = {
      productId,
      fromWarehouseId: Number(fromWarehouse),
      toWarehouseId:   Number(toWarehouse),
      quantity:        qty,
    };

    transfer(request, {
      onSuccess: () => {
        onClose();
        onSuccess();
      },
    });
  };

  const product = products?.find((p) => p.id === productId);
  const displayError = validationError
    ?? (error && typeof error === 'object' && 'message' in error
        ? (error as any).message
        : error ? 'Transfer failed. Please try again.' : null);

  return (
    /* Backdrop — click outside to close */
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 animate-fade-in p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !isPending) onClose(); }}
    >
      {/* Modal panel — full-width sheet on mobile, card on sm+ */}
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Transfer Stock</h2>
            {product && (
              <p className="text-sm text-gray-500 mt-0.5">{product.name}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close"
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100
                       active:scale-90 transition-all duration-75 disabled:opacity-40"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Warehouse
              </label>
              <select
                value={fromWarehouse}
                onChange={(e) => { setFromWarehouse(Number(e.target.value)); setValidationError(null); }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white transition-shadow duration-75"
              >
                <option value="">Select…</option>
                <option value="1">Warehouse A</option>
                <option value="2">Warehouse B</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Warehouse
              </label>
              <select
                value={toWarehouse}
                onChange={(e) => { setToWarehouse(Number(e.target.value)); setValidationError(null); }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-white transition-shadow duration-75"
              >
                <option value="">Select…</option>
                <option value="1">Warehouse A</option>
                <option value="2">Warehouse B</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={quantity}
              onChange={(e) => { setQuantity(e.target.value); setValidationError(null); }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-shadow duration-75"
              placeholder="Enter quantity"
              autoFocus
            />
          </div>

          {/* Inline error */}
          {displayError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-sm">
              <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {displayError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1 pb-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm
                         hover:bg-gray-50 active:bg-gray-100 active:scale-95
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-75 select-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white font-medium text-sm
                         hover:bg-blue-600 active:bg-blue-700 active:scale-95
                         disabled:bg-blue-300 disabled:cursor-not-allowed
                         transition-all duration-75 select-none flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Transferring…
                </>
              ) : (
                'Transfer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
