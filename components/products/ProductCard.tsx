"use client";

import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/data';
import { useEffect, useState } from 'react';
import { deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { useVendor } from '@/context/VendorContext';
import LoginModal from '@/app/auth/LoginModal/page';


export default function ProductCard({ product }: { product: any }) {
  const [getUserId, setUserId] = useState<string | null>(null);
  const [getCartId, setCartId] = useState<string | null>(null);
  const [getUserName, setUserName] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { vendorId } = useVendor();
  const [signInmodal, setSignInModal] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedCartId = localStorage.getItem('cartId');
    const storedUserName = localStorage.getItem('userName');

    setUserId(storedUserId);
    setCartId(storedCartId);
    setUserName(storedUserName);
  }, []);

  const handleUpdateCart = async (id: any, type: any, qty: any) => {
    try {
      if (qty === 1) {
        const updateApi = await deleteCartitemsApi(`${id}`)
        if (updateApi) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      } else {
        const response = await updateCartitemsApi(`${id}/${type}/`)
        if (response) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      }

    } catch (error) {

    }
  }

  const handleAddCart = async (id: any, qty: any) => {
    const payload = {
      cart: getCartId,
      product: id,
      user: getUserId,
      vendor: vendorId,
      quantity: qty,
      created_by: getUserName ? getUserName : 'user'
    }
    try {
      const response = await postCartitemApi(``, payload)
      if (response) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {

    }
  }
  const getDiscountPercentage = (mrp: string | number, price: string | number): number => {
    const mrpVal = parseFloat(mrp as string);
    const priceVal = parseFloat(price as string);

    if (isNaN(mrpVal) || mrpVal === 0) return 0;

    const discount = ((mrpVal - priceVal) / mrpVal) * 100;
    return Math.round(discount);
  };

  const discountPercentage =
    product?.discount && product?.price
      ? getDiscountPercentage(product.discount, product.price)
      : 0;

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          {/* <img
            src={product?.image_urls[0] ? product?.image_urls[0] : "https://semantic-ui.com/images/wireframe/image.png"}
            alt={product?.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            width={300}
            height={300}
          /> */}
          <div className="relative w-full h-full overflow-hidden">
            {/* First image */}
            <img
              src={product?.image_urls?.[0] || "https://semantic-ui.com/images/wireframe/image.png"}
              alt={product?.name}
              className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:translate-x-full"
            />
            {/* Second image */}
            <img
              src={product?.image_urls?.[0] || product?.image_urls?.[0] || "https://semantic-ui.com/images/wireframe/image.png"}
              alt={`${product?.name} hover`}
              className="absolute inset-0 w-full h-full object-cover transform translate-x-full transition-transform duration-500 group-hover:translate-x-0"
            />
          </div>
        </Link>
      </div>

      {/* {product?.isNew && (
        <div className="absolute top-4 left-4">
          <Badge className="bg-[#8BC34A] hover:bg-[#8BC34A]">New</Badge>
        </div>
      )} */}

      {/* {product?.discount && product?.price && (
        <div className="absolute top-4 left-4">
          <Badge className="bg-[#FF0000] hover:bg-[#FF0000] rounded-sm"> {getDiscountPercentage(product.discount, product.price)}% OFF</Badge>
        </div>
      )} */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4">
          <Badge className="bg-[#FF0000] hover:bg-[#FF0000] rounded-sm">
            {discountPercentage}%
          </Badge>
        </div>
      )}

      <div className="p-4  bg-[#86a39f]">
        <Link href={`/products/${product?.id}`}>
          <h3 className="font-bold text-lg mb-1 transition-colors text-[#fff] group-hover:text-[#fff]">
            {product?.name?.slice(0, 20)}
          </h3>
        </Link>

        <div className='flex gap-2'>
          <span className="text-[#fff] font-medium">{formatPrice(product?.price)}</span>
          {product?.price === product?.discount || product?.discount === 0 || product?.discount === '' ?
            ('') : (
              <>
                <span className="font-semibold line-through text-gray-500">{formatPrice(product?.discount)}</span><br />
              </>
            )}
        </div>
        <div className="flex items-center justify-center mt-2">



          {product?.cartId ? (
            <div
              className="flex items-center gap-2 mt-2"
              onClick={(e) => e.stopPropagation()} // 🛑 Prevents navigation
            >
              <button
                onClick={() =>
                  handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)
                }
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className='border-2 px-10 border-green-400 text-green-900'>{product?.cartQty}</span>

              <button
                onClick={() => handleUpdateCart(product?.cartId, 'increase', '')}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button className="cursor-pointer relative px-4 py-1.5 bg-[#4e3e63] text-white group-hover:text-[#fff] font-semibold rounded-xl overflow-hidden group"
              disabled={product?.stock_quantity === 0 || product?.status === false}
              onClick={(e) => {
                e.stopPropagation();
                if (getUserId) {
                  handleAddCart(product.id, 1);
                  //   handleAddCartAnalytics(product)
                  // });
                } else {
                  setSignInModal(true);
                }
              }}
            >
              <span className="relative z-10">
                {product?.stock_quantity === 0 || product?.status === false ? 'Out of Stock' : 'Buy Now'}
              </span>
              <span className="absolute inset-0 w-1/3 bg-gradient-to-l from-white to-transparent opacity-40 transform skew-x-[-40deg] shine-animation"></span>
            </button>
          )}
        </div>
      </div>
      {signInmodal && (
        <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
      )}
    </div>
  );
}