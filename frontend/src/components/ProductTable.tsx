import React from 'react';
import { ProductWithStatus } from '../types/index.js';
import { SuggestTransferButton } from './SuggestTransferButton.js';

interface ProductTableProps {
  products: ProductWithStatus[];
  onTransferClick: (productId: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onTransferClick }) => {
  return (
    <>
      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Product', 'Category', 'Warehouse A', 'Warehouse B', 'Reorder', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-blue-50/60 transition-colors duration-100">
                  <td className="px-5 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-sm">{product.categoryName}</td>
                  <td className="px-5 py-3 text-center">
                    <StockQty qty={product.warehouseAQty} reorder={product.reorderLevel} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <StockQty qty={product.warehouseBQty} reorder={product.reorderLevel} />
                  </td>
                  <td className="px-5 py-3 text-center text-gray-500 text-sm">{product.reorderLevel}</td>
                  <td className="px-5 py-3 text-center">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    {product.status === 'shortage' && (
                      <SuggestTransferButton productId={product.id} onTransferClick={onTransferClick} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile cards (< md) ── */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{product.categoryName}</p>
              </div>
              <StatusBadge status={product.status} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="bg-gray-50 rounded-xl py-2">
                <p className="text-xs text-gray-400 mb-0.5">Warehouse A</p>
                <StockQty qty={product.warehouseAQty} reorder={product.reorderLevel} />
              </div>
              <div className="bg-gray-50 rounded-xl py-2">
                <p className="text-xs text-gray-400 mb-0.5">Warehouse B</p>
                <StockQty qty={product.warehouseBQty} reorder={product.reorderLevel} />
              </div>
              <div className="bg-gray-50 rounded-xl py-2">
                <p className="text-xs text-gray-400 mb-0.5">Reorder</p>
                <span className="font-semibold text-gray-700">{product.reorderLevel}</span>
              </div>
            </div>

            {product.status === 'shortage' && (
              <SuggestTransferButton
                productId={product.id}
                onTransferClick={onTransferClick}
                fullWidth
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

const StockQty: React.FC<{ qty: number; reorder: number }> = ({ qty, reorder }) => (
  <span className={`font-semibold text-sm ${qty < reorder ? 'text-red-500' : 'text-gray-800'}`}>
    {qty}
  </span>
);

const StatusBadge: React.FC<{ status: 'ok' | 'shortage' }> = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
      status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}
  >
    {status === 'ok' ? '✓ OK' : '⚠ Shortage'}
  </span>
);
