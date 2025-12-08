import ProductCard from '@/components/products/ProductCard';


export default function ProductsGrid({ products, isLoading }: any) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {isLoading || !products ? Array.from({ length: 8 }).map((_, i) => (
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
      )) : (
        <>
          {products?.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </>
      )}
    </div>
  );
}