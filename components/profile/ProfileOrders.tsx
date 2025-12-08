"use client";

import { Button } from '@/components/ui/button';
import { formatDate, formatPrice } from '@/lib/utils';
import { getProducts } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import { useEffect, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getOrderApi, getOrderItemApi, getOrdersAndOrdersItemsApi } from '@/api-endpoints/CartsApi';
import { Package } from 'lucide-react';

export default function ProfileOrders() {
  const router = useRouter();
  const { vendorId } = useVendor();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const { data, isLoading }: any = useQuery({
    queryKey: ['getOrderData', userId, vendorId],
    queryFn: () => getOrderApi(`${userId}/vendor/${vendorId}`),
    enabled: !!userId && !!vendorId
  });

  const getOrdersAndOrdersItemsApiData: any = useQuery({
    queryKey: ['getOrdersAndOrdersItemsApiData', userId, vendorId],
    queryFn: () => getOrdersAndOrdersItemsApi(`?vendor_id=${vendorId}&user_id=${userId}`),
    enabled: !!userId && !!vendorId
  });

  console.log('getOrdersAndOrdersItemsApiData', getOrdersAndOrdersItemsApiData?.data?.data);
  
  
  // For demo purposes, we'll create mock orders using products
  const products = getProducts().slice(0, 3);
  const mockOrders = [
    {
      id: 'ORD-001',
      date: 'April 12, 2023',
      status: 'Delivered',
      total: 42.99,
      items: [products[0]],
    },
    {
      id: 'ORD-002',
      date: 'March 28, 2023',
      status: 'Delivered',
      total: 68.98,
      items: [products[1], products[2]],
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Your Orders</h2>
      {getOrdersAndOrdersItemsApiData?.data?.data?.length ? (
        <div className="space-y-6">
          {getOrdersAndOrdersItemsApiData?.data?.data
            ?.slice() // prevent mutation of original data
            ?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // sort descending
            ?.map((order: any) => (
            <div key={order?.id} className="border border-border rounded-lg overflow-hidden">
              <div className="bg-[#F8F7F2] p-4 flex justify-between items-center flex-wrap">
                <div>
                  <div className="text-sm text-muted-foreground">Order placed</div>
                  <div className="font-medium">{formatDate(order?.created_at)}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Order number</div>
                  <div className="font-medium">{order?.id}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="font-medium">{formatPrice(order?.total_amount)}</div>
                </div>

                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order?.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order?.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                        order?.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700' :
                          order?.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                            'bg-red-100 text-red-800'
                    }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {order?.order_items?.map((product:any) => (
                     <div key={product.id} className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-[#F8F7F2] rounded-md overflow-hidden flex-shrink-0">
                         <img 
                           src={product.product?.image_urls?.[0] || "https://semantic-ui.com/images/wireframe/image.png"} 
                           alt={product.name} 
                           className="w-full h-full object-cover"
                         />
                       </div>
                       
                       <div className="flex-grow">
                         <h3 className="font-medium">{product?.product?.name}</h3>
                         <p className="text-sm text-muted-foreground">
                           Qty: {product?.quantity}
                         </p>
                       </div>
                       
                       <div>
                         <Button variant="outline" size="sm"
                         onClick={() => router.push(`/products/${product?.product?.id}`)}
                         >
                           Buy Again
                         </Button>
                       </div>
                     </div>
                   ))}
                </div>

                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" 
                   onClick={() => router.push(`/order-view/${order.id}`)}
                  >
                    View Order Details
                  </Button>

                  {/* <Button variant="outline" size="sm">
                    Track Package
                  </Button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new orders.</p>
        </div>
      )}
    </div>
  );
}