// app/providers.tsx
'use client';

import { StrictMode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VendorProvider } from '@/context/VendorContext';
import { UserProvider } from '@/context/UserContext';
import { CartItemProvider } from '@/context/CartItemContext';
import { CategoriesProvider } from '@/context/CategoriesContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { PolicyProvider } from '@/context/PolicyContext';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <VendorProvider>
          <UserProvider>
            <CartItemProvider>
              <CategoriesProvider>
                <ProductsProvider>
                  <PolicyProvider>
                    <ThemeProvider
                      attribute="class"
                      defaultTheme="light"
                      enableSystem
                    >
                      {children}
                      <Toaster />
                    </ThemeProvider>
                  </PolicyProvider>
                </ProductsProvider>
              </CategoriesProvider>
            </CartItemProvider>
          </UserProvider>
        </VendorProvider>
      </StrictMode>
    </QueryClientProvider>
  );
}
