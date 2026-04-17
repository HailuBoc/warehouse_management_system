import React from 'react';
import { ProductWithStatus } from '../types/index.js';
import { SuggestTransferButton } from './SuggestTransferButton.js';

interface ProductTableProps {
  products: ProductWithStatus[];
  onTransferClick: (productId: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onTransferClick,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Product Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Category
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Warehouse A
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Warehouse B
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Reorder Level
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Status
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {product.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {product.categoryName}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {product.warehouseAQty}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {product.warehouseBQty}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {product.reorderLevel}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    product.status === 'ok'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.status === 'ok' ? 'OK' : 'Shortage'}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {product.status === 'shortage' && (
                  <SuggestTransferButton
                    productId={product.id}
                    onTransferClick={onTransferClick}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
