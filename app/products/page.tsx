"use client";

import { Suspense, useState } from 'react';
import ProductsGrid from '@/components/products/ProductsGrid';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsSidebar from '@/components/products/ProductsSidebar';
import ProductsLoading from '@/components/products/ProductsLoading';
import { useCartItem } from '@/context/CartItemContext';
import { useProducts } from '@/context/ProductsContext';
import { Pagination } from '@/components/Pagination';
import Image from 'next/image';
import emptyBox from '../../public/img/empty-box.png';

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const { cartItem }: any = useCartItem();
  const { products, isAuthenticated, isLoading }: any = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const finalQuery = (e.target as HTMLInputElement).value.trim();
    }
  };


  if (products?.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No products found. Try adjusting your search or category filter.
      </p>
    );
  }

  const filter = products?.data?.filter((item: any) => {
    return (
      (!selectedCategory || item?.category === selectedCategory) &&
      (!searchQuery || item?.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // 🔽 Add sorting logic based on selected option
  const sortedProducts = [...filter].sort((a: any, b: any) => {
    if (sortOption === 'price-low') {
      return a.price - b.price;
    } else if (sortOption === 'price-high') {
      return b.price - a.price;
    }
    return 0;
  });


  const totalPages = Math.ceil(sortedProducts?.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedProducts?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const matchingProductsArray = paginatedItems?.map((product: any, index: number) => {
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
    <div className="bg-[#f4d0d0]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-muted-foreground">
            Discover our range of thoughtful, unique, and customizable gifts for every occasion.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4">
            <ProductsSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          <div className="w-full lg:w-3/4">
            <ProductsHeader value={searchQuery} onChange={handleSearch} onKeyDown={handleSearchKeyDown}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
            {matchingProductsArray?.length ? (
              <>
                <Suspense fallback={<ProductsLoading />}>
                  <ProductsGrid products={matchingProductsArray} isLoading={isLoading} />
                </Suspense>

                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>

              </>
            ) : (
              <>
                <Image
                  src={emptyBox ?? "https://semantic-ui.com/images/wireframe/image.png"}
                  alt="Empty"
                  className='size-24 mx-auto'
                  width={400}
                  height={300}
                />
                <div className='text-center text-green-500 font-bold'>No products found.</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}