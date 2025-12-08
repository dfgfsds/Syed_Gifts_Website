"use client"; 
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getProductApi } from '../api-endpoints/products';
import { useQuery } from '@tanstack/react-query';
import { useVendor } from './VendorContext';
interface ProductsContextType {
  products: any[] | null;  // fixed here
  isAuthenticated: boolean;
  isLoading:any
}


const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: any) {
      const { vendorId } = useVendor();
  const { data,isLoading }: any = useQuery({
    queryKey: ['getProductData',vendorId],
    queryFn: () => getProductApi(`?vendor_id=${vendorId}`),
    enabled: !!vendorId
  });

  const [products, setProducts] = useState<any[]>([]);

  React.useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        isAuthenticated: !!products.length,
        isLoading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
