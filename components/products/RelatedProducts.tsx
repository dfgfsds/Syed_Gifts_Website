import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/context/ProductsContext';

export default function RelatedProducts({ currentProductId }: { currentProductId: string }) {
    const { products, isAuthenticated,isLoading }: any = useProducts();

  const relatedProducts = products?.data?.filter((product:any) => product?.category === currentProductId)
  ?.slice(0,4)
  
  return (
    <section className="border-t border-border pt-12">
      <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts?.map((product:any) => (
          <ProductCard key={product?.id} product={product} />
        ))}
      </div>
    </section>
  );
}