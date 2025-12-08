'use client';
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useParams } from 'next/navigation';
import { getOrderItemApi } from "@/api-endpoints/CartsApi";
// import { formatDate } from "@/utils/date";
import { useRouter } from "next/navigation";
import { useVendor } from "@/context/VendorContext";
import { useEffect, useState } from "react";
import { formatDate, formatPrice } from "@/lib/utils";

function OrderSingleView() {
    const params = useParams();
    const id = params.id;
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const { vendorId } = useVendor();

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        setUserId(storedId);
    }, []);

    const { data }: any = useQuery({
        queryKey: ['getOrderSingle', vendorId],
        queryFn: () => getOrderItemApi(`?user_id=${userId}&vendor_id=${vendorId}&order_id=${id}`)
    });

    return (
        <>
            <button
                onClick={() => {
                    router.back();
                }}
                className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 p-10"
            >
                <ArrowLeft className="h-5 w-5" />
                Back
            </button>
            <div className="lg:px-20 px-5">
                <h1 className="text-2xl font-extrabold mb-2">Order Details</h1>
                <div className="border shadow-xl p-5 bg-white mb-10">
                    <div className="flex justify-between flex-wrap ">
                        <div className="text-slate-500 font-medium">
                            <div className="mb-2">
                                Order Date:<span className="ml-1 text-slate-700 font-bold">{data?.data?.created_at ? formatDate(data?.data?.created_at) : ''} </span>
                            </div>
                            <div>
                                Total Amount:<span className="ml-1 text-slate-700 font-bold">{formatPrice(data?.data?.total_amount)}</span>
                            </div>
                            <div>
                                Gift Wrap Cost:<span className="ml-1 text-slate-700 font-bold">{formatPrice(data?.data?.gift_wrap_cost)}</span>
                            </div>
                        </div>

                        <div className="text-slate-500 font-medium">
                            <div className="mb-2">
                                Ship to:<span className="ml-1 text-slate-700 font-bold">{data?.data?.consumer_address?.address_type} </span>
                            </div>
                            <div>
                                Status:<span className="ml-1 text-slate-700 font-bold">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${data?.data?.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            data?.data?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`}>
                                        {data?.data?.status?.charAt(0).toUpperCase() + data?.data?.status?.slice(1)}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-lg font-bold mt-5">Items in Order:</h1>
                        {data?.data?.order_items?.map((item: any) => (
                            <div className="box border bg-slate-100 flex flex-wrap p-3 rounded-md gap-5">
                                <img className="h-20 w-20" src={item?.product?.image_urls[0] ? item?.product?.image_urls[0] : "https://cdn.shopify.com/s/files/1/2303/2711/files/2_e822dae0-14df-4cb8-b145-ea4dc0966b34.jpg?v=1617059123"} />
                                <div className="mt-auto mb-auto">
                                    <h1 className="text-lg font-semibold">{item?.product?.name}</h1>
                                    <p>Quantity: <span className="ml-1">{item?.quantity}</span></p>
                                    {item?.custom_instruction && <div className=""> <span className="font-bold">Custom Notes: </span> {item?.custom_instruction}</div>}
                                    {item?.is_gift_wrap_opted && <div className=""> <span className="font-bold">Gift Wrap:  </span>Yes</div>}
                                    {item?.image_urls?.length > 0 && <div className="flex gap-2"> Uploaded Images: {item?.image_urls?.map((img: string) => {
                                        return <img src={img} className="h-20 w-20 m-2" />
                                    })} </div>}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderSingleView;