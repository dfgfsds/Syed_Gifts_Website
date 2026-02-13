"use client";

import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductTabs from "@/components/products/ProductTabs";
import RelatedProducts from "@/components/products/RelatedProducts";
import { useCartItem } from "@/context/CartItemContext";
import { useProducts } from "@/context/ProductsContext";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPageClient({ id }: any) {
  const { products, isAuthenticated, isLoading }: any = useProducts();
  const { cartItem }: any = useCartItem();
  const [getUserId, setUserId] = useState<string | null>(null);
  const [getCartId, setCartId] = useState<string | null>(null);
  const [getUserName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedCartId = localStorage.getItem('cartId');
    const storedUserName = localStorage.getItem('userName');

    setUserId(storedUserId);
    setCartId(storedCartId);
    setUserName(storedUserName);
  }, []);


  const productDetails = products?.data?.find((item: any) => String(item?.id) === String(id));

  const matchingData = cartItem?.data?.map((item: any, index: number) => {
    const product = productDetails;
    const isProductMatch = product?.id === item?.product;

    if (isProductMatch) {
      return {
        Aid: index,
        cartId: item?.id,
        cartQty: item?.quantity,
        ...product,
      };
    }

    return null;
  }).filter(Boolean);

  const totalQty = matchingData?.reduce((sum: number, item: any) => sum + (item?.cartQty || 0), 0);

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>

      <div className="bg-[#D6FFD7]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex mt-auto  !cursor-pointer mb-3"
            onClick={() => router.back()}
          >
            <ArrowLeft />
            <h1>Back</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <ProductGallery product={productDetails} />
            <ProductInfo product={productDetails} cartDetails={matchingData} getUserId={getUserId}
              getCartId={getCartId} getUserName={getUserName} totalQty={totalQty}
            />
          </div>

          {/* <ProductTabs product={productDetails} /> */}

          <RelatedProducts currentProductId={productDetails?.category} />
        </div>
      </div>
    </>
  )

}
