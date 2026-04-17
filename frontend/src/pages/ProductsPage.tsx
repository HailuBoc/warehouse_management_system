import React, { useState } from 'react';
import { useProductsWithStatus } from '../hooks/useProducts.js';
import { ProductTable } from '../components/ProductTable.js';
import { TransferForm } from '../components/TransferForm.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorMessage } from '../components/ErrorMessage.js';

export const ProductsPage: React.FC = () => {
  const { data: products, isLoading, error, refetch } = useProductsWithStatus();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const handleTransferSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>
        <ErrorMessage message="Failed to load products" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>

      {products && products.length > 0 ? (
        <ProductTable
          products={products}
          onTransferClick={setSelectedProductId}
        />
      ) : (
        <p className="text-gray-600">No products found</p>
      )}

      {selectedProductId && (
        <TransferForm
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onSuccess={handleTransferSuccess}
        />
      )}
    </div>
  );
};
