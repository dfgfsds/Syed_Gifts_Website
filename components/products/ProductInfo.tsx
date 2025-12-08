"use client"

import { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingBag, Heart, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCartItem } from '@/context/CartItemContext';
import { useProducts } from '@/context/ProductsContext';
import { getProductVariantCartItemUpdate } from '@/api-endpoints/products';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { useVendor } from '@/context/VendorContext';
import { deleteCartitemsApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
import LoginModal from '@/app/auth/LoginModal/page';

export default function ProductInfo({ product, cartDetails, getUserId, getCartId, getUserName, totalQty }: any) {
  const queryClient = useQueryClient();
  const { vendorId } = useVendor();
  const [signInmodal, setSignInModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(
    product?.variants && product?.variants?.length > 0 ? product?.variants[0] : null
  );

  const handleAddCart = async (id: any, qty: any) => {
    const payload = {
      product: id,
      cart: getCartId,
      user: getUserId,
      vendor: vendorId,
      quantity: qty,
      created_by: getUserName ? getUserName : 'user',
      ...(selectedVariant?.product_variant_title ? { product_variant: selectedVariant?.id } : selectedVariant?.product_size ? { product_size: selectedVariant?.id }
        : selectedVariant?.id ? { product: selectedVariant?.id } : ''),
    };

    try {
      const response = await getProductVariantCartItemUpdate('', payload)
      if (response) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {
    }
  }

  const handleUpdateCart = async (id: any, type: any, qty: any) => {
    try {
      if (qty === 1) {
        const updateApi = await deleteCartitemsApi(`${id}`)
        if (updateApi) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      } else {
        if (!selectedVariant) {
          const response = await updateCartitemsApi(`${id}/${type}/`)
          if (response) {
            queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
          }
        } else {
          handleAddCart(id, 1)
        }
      }
    } catch (error) {

    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-green-700 uppercase">{product?.name}</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground !text-green-600">
            {product?.brand_name}
          </span>
        </div>
      </div>
      <div className='flex gap-5'>
        <div className="text-2xl font-bold text-green-700">{formatPrice(product?.price)}</div>
        {product?.price === product?.discount || product?.discount === 0 || product?.discount === '' ?
          ('') : (
            <>
              <span className="font-semibold text-2xl line-through text-gray-500">{formatPrice(product?.discount)}</span>

            </>
          )}

      </div>


      <div
        className="text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: product?.description }}
      />


      {/* {product?.variants && product?.variants?.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">Size</label>
          <Select 
            value={selectedVariant?.id} 
            onValueChange={handleVariantChange}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {product?.variants.map((variant:any) => (
                <SelectItem key={variant.id} value={variant.id}>
                  {variant.size} - {formatPrice(variant.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )} */}

      {cartDetails?.length && cartDetails[0]?.cartQty > 0 ? (
        <div>
          <label className="text-sm font-medium mb-2 block">Quantity</label>
          <div className="flex items-center w-full md:w-[180px]">
            <Button
              variant="outline"
              size="icon"
              className="rounded-r-none h-10 w-10"
              onClick={() =>
                handleUpdateCart(cartDetails[0]?.cartId, 'decrease', cartDetails[0]?.cartQty)
              }
            // disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <div className="text-green-500 flex-1 h-10 border-y border-input flex items-center justify-center font-medium">
              {totalQty ? totalQty : ''}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-l-none h-10 w-10"
              // onClick={increaseQuantity}
              onClick={() => handleUpdateCart(cartDetails[0]?.cartId, 'increase', '')}

            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        // <div className="flex flex-col md:flex-row gap-4">
        //   <Button 
        //     size="lg" 
        //     className="bg-[#4D8B31] hover:bg-[#3e7026] gap-2 flex-1 p-2"
        //     onClick={(e: any) => {
        //         e.stopPropagation();
        //       if (getUserId) {
        //         handleAddCart(product?.id, 1);
        //       } else {
        //         setSignInModal(true);
        //       }
        //     }}
        //   >
        //     <ShoppingBag className="h-5 w-5" />
        //     Add to Cart
        //   </Button>
        // </div>

        <button className="cursor-pointer relative px-6 py-3 bg-green-600 text-white font-semibold rounded-full overflow-hidden group"
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
            {product?.stock_quantity === 0 || product?.status === false ? 'Out of Stock' : (
              <div className='gap-2 flex p-2'>
                <ShoppingBag className="h-5 w-5" />
                <div> Add to Cart</div>

              </div>
            )}
          </span>
          <span className="absolute inset-0 w-1/3 bg-gradient-to-l from-white to-transparent opacity-40 transform skew-x-[-40deg] shine-animation"></span>
        </button>
      )}


      {signInmodal && (
        <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />

      )}
    </div>
  );
}