import React, { useState } from 'react';
import { useProductsWithStatus } from '../hooks/useProducts.js';
import { ProductTable } from '../components/ProductTable.js';
import { TransferForm } from '../components/TransferForm.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorMessage } from '../components/ErrorMessage.js';

export const ProductsPage: React.FC = () => {
  const { data: products, isLoading, isFetching, error } = useProductsWithStatus();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleTransferSuccess = () => {
    setToast('Transfer completed successfully!');
    setTimeout(() => setToast(null), 3000);
  };

  const shortageCount = products?.filter((p) => p.status === 'shortage').length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            <span className="font-bold text-gray-900 text-lg">Inventory</span>
          </div>
          {isFetching && !isLoading && (
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <svg className="animate-spin h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Syncing…
            </span>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Page title + summary */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          {!isLoading && !error && products && (
            <p className="text-sm text-gray-500 mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''}
              {shortageCount > 0 && (
                <span className="ml-2 text-red-500 font-medium">
                  · {shortageCount} shortage{shortageCount !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          )}
        </div>

        {isLoading && <LoadingSpinner />}

        {error && !isLoading && (
          <ErrorMessage message="Failed to load products. Please check your connection and try again." />
        )}

        {!isLoading && !error && products && products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <svg className="h-12 w-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
            </svg>
            <p className="text-sm">No products found</p>
          </div>
        )}

        {!isLoading && !error && products && products.length > 0 && (
          <ProductTable products={products} onTransferClick={setSelectedProductId} />
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-slide-in">
          <div className="bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-xl flex items-center gap-2">
            <svg className="h-4 w-4 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {toast}
          </div>
        </div>
      )}

      {/* Transfer modal */}
      {selectedProductId !== null && (
        <TransferForm
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onSuccess={handleTransferSuccess}
        />
      )}
    </div>
  );
};
