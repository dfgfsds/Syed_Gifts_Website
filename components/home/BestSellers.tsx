"use client";
import Link from 'next/link';
import { getBestSellers } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/context/ProductsContext';
import { useCartItem } from '@/context/CartItemContext';

export default function BestSellers() {
  // const bestSellers = getBestSellers().slice(0, 4);
  const { products, isAuthenticated, isLoading }: any = useProducts();
  const { cartItem }: any = useCartItem();

  const matchingProductsArray = products?.data?.map((product: any, index: number) => {
    const matchingCartItem = cartItem?.data?.find(
      (item: any) => item?.product === product?.id
    );

    if (matchingCartItem) {
      return {
        ...product,
        Aid: index,
        cartQty: matchingCartItem?.quantity,
        cartId: matchingCartItem.id,
      };
    }
    return product;
  });

  return (
    <section className="py-20 bg-[#f4d0d0]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl text-black font-bold mb-2">Our Best Sellers</h2>
            <p className="text-muted-foreground max-w-2xl tet-white">
              Discover our most loved products that customers come back for again and again.
            </p>
          </div>

          <Button asChild variant="outline" className="mt-4 md:mt-0 border-[#4D8B31] text-[#4D8B31] hover:bg-[#4D8B31] hover:text-white">
            <Link href="/products">
              View All
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading || !matchingProductsArray ? Array.from({ length: 4 }).map((_, i) => (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
          <div className="aspect-square bg-green-200" />
          <div className="p-4">
            <div className="h-4 bg-green-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-green-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-green-200 rounded w-1/3 mb-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 bg-green-200 rounded-full"></div>
            </div>
          </div>
        </div>
      )):(
        <>
          {matchingProductsArray?.slice(0, 4)?.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
          </>
        )}

        </div>
      </div>
    </section>
  );
}