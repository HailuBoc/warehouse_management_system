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
  const { mutate: transfer, isPending, error } = useTransfer();

  const [fromWarehouse, setFromWarehouse] = useState<number | ''>('');
  const [toWarehouse, setToWarehouse] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');

  // Auto-populate suggested warehouses
  useEffect(() => {
    const productShortages = shortages?.filter((s) => s.productId === productId);
    if (productShortages && productShortages.length > 0) {
      const shortage = productShortages[0];
      setToWarehouse(shortage.shortageWarehouseId);
      if (shortage.suggestedSourceWarehouseId) {
        setFromWarehouse(shortage.suggestedSourceWarehouseId);
      }
    }
  }, [productId, shortages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromWarehouse || !toWarehouse || !quantity) {
      alert('Please fill in all fields');
      return;
    }

    const request: TransferRequest = {
      productId,
      fromWarehouseId: Number(fromWarehouse),
      toWarehouseId: Number(toWarehouse),
      quantity: Number(quantity),
    };

    transfer(request, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
    });
  };

  const product = products?.find((p) => p.id === productId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Transfer Stock</h2>
        {product && (
          <p className="text-gray-600 mb-4">Product: {product.name}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Warehouse
            </label>
            <select
              value={fromWarehouse}
              onChange={(e) => setFromWarehouse(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select warehouse</option>
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
              onChange={(e) => setToWarehouse(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select warehouse</option>
              <option value="1">Warehouse A</option>
              <option value="2">Warehouse B</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">
                {typeof error === 'object' && error !== null && 'message' in error
                  ? (error as any).message
                  : 'An error occurred'}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium"
            >
              {isPending ? 'Transferring...' : 'Transfer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
