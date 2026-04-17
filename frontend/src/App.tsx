import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductsPage } from './pages/ProductsPage.js';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsPage />
    </QueryClientProvider>
  );
}

export default App;
