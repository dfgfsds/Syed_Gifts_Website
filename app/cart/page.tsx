"use client";

import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useCartItem } from '@/context/CartItemContext';
import { useProducts } from '@/context/ProductsContext';
import { useQuery } from '@tanstack/react-query';
import { getSizesApi, getVariantsProductApi } from '@/api-endpoints/products';
import { useEffect, useState } from 'react';
import { baseUrl } from '@/api-endpoints/ApiUrls';
import axios from 'axios';
import { useVendor } from '@/context/VendorContext';

export default function CartPage() {
  // For demo purposes, we'll use the first 3 products as cart items
  const { cartItem }: any = useCartItem();
  const { products }: any = useProducts();
  const { vendorId } = useVendor();
  const [userId, setUserId] = useState<string | null>(null);

  const [totalAmountValue, setTotalAmountValue] = useState(0);
  const [getWrapCost, setWrapCost] = useState(0);

  useEffect(() => {
    if (vendorId) {
      getTotalValue();
    }
  }, [vendorId]);

  const getTotalValue = async () => {
    try {
      const res = await axios.post(`${baseUrl}/cart/calculate-total/`,
        {
          user_id: userId || localStorage.getItem('userId'),
          vendor_id: vendorId
        }
      )
      setTotalAmountValue(res?.data?.data?.final_price)
      setWrapCost(res?.data?.data?.total_gift_wrap_price)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
    } catch (e) {
      console.error("Failed to access localStorage", e);
    }
  }, []);

  const VariantData: any = useQuery({
    queryKey: ['VariantData'],
    queryFn: () => getVariantsProductApi(``),
  });

  const sizesData: any = useQuery({
    queryKey: ['getSizesData'],
    queryFn: () => getSizesApi(``),
  });

  const matchingProductsArray = cartItem?.data?.map((item: any, index: number) => {
    const matchingProduct = products?.data?.find((product: any) => product.id === item.product);
    const matchingVariant = VariantData?.data?.data?.message?.find((variant: any) => variant.id === item.product_variant);
    const matchingSize = sizesData?.data?.data?.message?.find((size: any) => size.id === item.product_size);

    return {
      Aid: index,
      cartId: item?.id,
      cartQty: item?.quantity,
      is_gift_wrap_opted: item?.is_gift_wrap_opted,
      gift_wrap_price: item?.gift_wrap_price,
      uploadImages: item?.cart_item_images.find(
        (img: any) => img.cart_item === item?.id),
      ...matchingProduct,
      ...matchingVariant,
      ...matchingSize,
    };
  });

  const totalAmount = matchingProductsArray?.reduce((acc: number, item: any) => {
    const price =
      item.price ??
      item?.product_variant_price ??
      item?.product_size_price ??
      0;
    return acc + price * (item.cartQty || 1);
  }, 0);


  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        {matchingProductsArray?.length === 0 ? (
          // <div className="flex flex-col items-center justify-center h-64">
          //   <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
          //   <p className="text-gray-600">Your cart is empty</p>
          //   <Link href="/products" className="mt-4 text-[#4D8B31] hover:underline flex">
          //     Start Shopping 
          //     <ArrowRight className="ml-2 h-4 w-4 my-auto" />

          //   </Link>
          // </div>

          <div className="flex flex-col items-center justify-center h-max  text-gray-800 animate-fadeIn">
            <div className="text-6xl text-gray-400 animate-float">
              <ShoppingBag className="h-16 w-16 text-green-400 mb-4" />
            </div>
            <h1 className="text-3xl font-bold mt-0 animate-slideInUp">
              Your cart is empty.
            </h1>
            <p className="mt-2 text-gray-600 animate-fadeIn delay-200">
              {/* Looks like you haven't added anything to your cart yet. */}
              Start Shopping
            </p>
            <Link href="/products">
              <button
                className="mt-8 px-6 py-3 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transform transition hover:scale-105 animate-bounce"
              >
                Return To Shop
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[#F8F7F2] rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Cart Items {cartItem?.length}</h2>
                    <Link href="/products" className="text-[#4D8B31] hover:underline text-sm flex items-center">
                      Continue Shopping
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {[...matchingProductsArray || []]
                      ?.map((item: any) => ({
                        ...item,
                        sortName: (item?.name || "").toLowerCase(),
                      }))
                      ?.sort((a: any, b: any) => a?.sortName?.localeCompare(b?.sortName))
                      ?.map((product: any, index: any) => (
                        <CartItem key={product.id} product={product} quantity={index + 1}  onUpdate={getTotalValue} />
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <CartSummary totalAmount={totalAmount} totalAmountValue={totalAmountValue} getWrapCost={getWrapCost} onUpdate={getTotalValue} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}