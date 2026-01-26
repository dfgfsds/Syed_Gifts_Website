"use client";

import { getDeliveryChargeApi, getPaymentDeliveryPartnerApi, getVendorDeliveryDetailsApi, patchUserSelectAddressAPi } from '@/api-endpoints/authendication';
import { deleteCouponApi, getAddressApi, getAllCouponsApi, getAppliedCouponDataApi, getCartApi, postApplyCouponApi, postCODPaymentApi, postDtdcChargeApi, postPaymentApi } from '@/api-endpoints/CartsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/context/UserContext';
import { useVendor } from '@/context/VendorContext';
import { formatPrice } from '@/lib/utils';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import OrderSuccessModal from './OrderSucessModal';
import axios from 'axios';
import { baseUrl } from '@/api-endpoints/ApiUrls';

export default function CartSummary({ totalAmount, totalAmountValue, getWrapCost, onUpdate, refreshTrigger }: any) {

  const [userId, setUserId] = useState<string | null>(null);
  const [getCartId, setCartId] = useState<string | null>(null);
  const [cartItems, setCartItem] = useState()
  const [DeliveryChargeValue, setDeliveryChargeValue] = useState<any>()
  const { user }: any = useUser();
  const { vendorId } = useVendor();
  const [code, setCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  const [getUserName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<any>()
  const [loading, setLoading] = useState(false);
  const [dtdcSelectValue, setDtdcSelectValue] = useState('');
  const [dtdcErrorMessage, setDtdcErrorMessage] = useState('');
  const [dtdcLoader, setDtdcLoader] = useState(false);
  const [paymentValue, setPaymentValue] = useState('PAY ON')
  const [dtdcDeliveryCharge, setDtdcDeliveryCharge] = useState<any>();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [addressError, setAddressError] = useState<any>('');
  const [couponLoader, setCouponloader] = useState(false);
  // const [totalAmountValue, setTotalAmountValue] = useState(0);
  // const [getWrapCost, setWrapCost] = useState(0);
  console.log(DeliveryChargeValue, '12345')
  // useEffect(() => {
  //   if (vendorId) {
  //     getTotalValue();
  //   }
  // }, [vendorId]);

  // const getTotalValue = async () => {
  //   try {
  //     const res = await axios.post(`${baseUrl}/cart/calculate-total/`,
  //       {
  //         user_id: userId || localStorage.getItem('userId'),
  //         vendor_id: vendorId
  //       }
  //     )
  //     setTotalAmountValue(res?.data?.data?.final_price)
  //     setWrapCost(res?.data?.data?.total_gift_wrap_price)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }


  const paymentMethod = [
    // { value: "CASH ON DELIVERY" },
    { value: "PAY ON" }
  ]
  const dtdcMethod: any = [
    { value: "B2C PRIORITY" },
    { value: "B2C SMART EXPRESS" }
  ]
  const handleDtdcMethod = (value: string) => {
    setDtdcSelectValue(value)
  };

  const handlePaymentMethod = (value: string) => {
    setPaymentValue(value)
  }



  const getVendorDeliveryDetailsData: any = useQuery({
    queryKey: ['getVendorDeliveryDetailsData', vendorId],
    queryFn: () => getVendorDeliveryDetailsApi(`${vendorId}`),
    enabled: !!vendorId
  })

  const { data, isLoading }: any = useQuery({
    queryKey: ['getAddressData', userId],
    queryFn: () => getAddressApi(`user/${userId}`),
    enabled: !!userId
  })

  // getAppliedCouponDataApi
  const getAppliedCouponData: any = useQuery({
    queryKey: ['getAppliedCouponDataData', userId],
    queryFn: () => getAppliedCouponDataApi(`?user_id=${userId}`),
    enabled: !!userId
  })




  const handleSelectAddress = async (id: any) => {
    try {
      const upadetApi = await patchUserSelectAddressAPi(`user/${userId}/address/${id?.id}`, { updated_by: getUserName })
      if (upadetApi) {
        queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);

      }
    } catch (error) {

    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsChecking(true);

    const payload = {
      user_id: Number(userId),
      coupon_code: code,
      vendor_id: vendorId,
      updated_by: getUserName || 'user'
    };

    try {
      const updateApi = await postApplyCouponApi("", payload);
      if (updateApi) {
        if (onUpdate) onUpdate();
        await fetchCartAndDeliveryCharge();
        queryClient.invalidateQueries(['getAllCouponsData'] as InvalidateQueryFilters);
      }
    } catch (error: any) {
      // console.log(error?.response?.data?.error)
      setError(error?.response?.data?.error || "Failed to apply coupon. Please try again.");
      // setError("Failed to apply coupon. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };



  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem('userId');
      const storedCartId = localStorage.getItem('cartId');
      const storedUserName = localStorage.getItem('userName');

      setUserName(storedUserName);
      setUserId(storedUserId);
      setCartId(storedCartId);
      setUserId(storedUserId);

    } catch (e) {
      console.error("Failed to access localStorage", e);
    }
  }, []);

  // const RazorPayKey = getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.payment_gateway_client_id;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const RazorPayKey =
    getVendorDeliveryDetailsData?.data?.data?.vendor_site_details
      ?.payment_gateway_client_id;

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        setErrorMessage(
          "Payment gateway blocked by browser. Please use Chrome or disable ad-block."
        );
        setLoading(false);
        return;
      }

      if (paymentValue === "PAY ON") {
        const paymentApi = await postPaymentApi("", {
          customer_phone: user?.data?.contact_number,
          vendor_id: vendorId,
          user_id: user?.data?.id,
        });

        if (!paymentApi) throw new Error("Payment init failed");

        const { payment_order_id, final_price } = paymentApi.data;

        const options = {
          key: RazorPayKey,
          amount: Math.round(final_price * 100),
          currency: "INR",
          name: "Syed Gifts",
          description: "Order Payment",
          order_id: payment_order_id,

          handler: function (response: any) {
            setPaymentSuccess(true);
          },

          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },

          prefill: {
            name: user?.data?.name || "",
            email: user?.data?.email || "",
            contact: user?.data?.contact_number || "",
          },

          notes: {
            address: "Selected Address",
          },

          theme: {
            color: "#4D8B31",
          },
        };

        const razorpay = new (window as any).Razorpay(options);

        razorpay.on("payment.failed", function (response: any) {
          setErrorMessage(response?.error?.description || "Payment failed");
        });

        razorpay.open();
      }
      else {
        const updateApi = await postCODPaymentApi("", {
          customer_phone: user?.data?.contact_number,
          vendor_id: vendorId,
          user_id: user?.data?.id,
          dtdc_courier_service_type: dtdcSelectValue,
        });

        if (updateApi) {
          setPaymentSuccess(true);
        }
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.error ||
        "Failed to initiate payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleCheckout = async () => {
  //   setLoading(true);
  //   setErrorMessage('')
  //   try {
  //     if (paymentValue === 'PAY ON') {
  //       const paymentAPi = await postPaymentApi('', {
  //         customer_phone: user?.data?.contact_number,
  //         vendor_id: vendorId,
  //         user_id: user?.data?.id,
  //         // dtdc_courier_service_type: dtdcSelectValue
  //       });

  //       if (paymentAPi) {
  //         const { payment_order_id, final_price } = paymentAPi.data;

  //         const options = {
  //           // key: "rzp_live_RaR9fnl73kdFfP",
  //           key:RazorPayKey,
  //           amount: final_price * 100,
  //           currency: "INR",
  //           name: "Syed gifts",
  //           description: "Order Payment",
  //           order_id: payment_order_id,
  //           handler: function (response: any) {
  //             setPaymentSuccess(true);
  //           },
  //           prefill: {
  //             name: user?.data?.name,
  //             email: user?.data?.email,
  //             contact: user?.data?.contact_number,
  //           },
  //           notes: {
  //             address: "Selected Address",
  //           },
  //           theme: {
  //             color: "#4D8B3180",
  //           },
  //         };
  //         // toast.success("created successfully!");
  //         const razor = new (window as any).Razorpay(options);
  //         razor.open();
  //       }
  //     } else {
  //       const updateApi = await postCODPaymentApi("",
  //         {
  //           customer_phone: user?.data?.contact_number,
  //           vendor_id: vendorId,
  //           user_id: user?.data?.id,
  //           dtdc_courier_service_type: dtdcSelectValue

  //         }
  //       );
  //       if (updateApi) {
  //         setPaymentSuccess(true);

  //       }
  //     }


  //   } catch (error: any) {
  //     setErrorMessage(error?.response?.data?.error || "Failed to initiate payment. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // useEffect(() => {
  //   const fetchCartAndDeliveryCharge = async () => {
  //     try {
  //       // 1. Fetch cart data
  //       const cartResponse: any = await getCartApi(getCartId);
  //       if (cartResponse) {
  //         setCartItem(cartResponse);
  //       }

  //       // 2. Fetch delivery charge
  //       if (
  //         user?.data?.contact_number &&
  //         userId &&
  //         vendorId &&
  //         getPaymentDeliveryPartnerData?.data?.data[0]?.delivery_partner !== "own_delivery"
  //       ) {
  //         const deliveryResponse: any = await getDeliveryChargeApi('', {
  //           user_id: userId,
  //           vendor_id: vendorId,
  //           payment_mode: '',
  //           customer_phone: user?.data?.contact_number,
  //         });
  //         if (deliveryResponse) {
  //           setDeliveryChargeValue(deliveryResponse);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error in cart/delivery API:", error);
  //     }
  //   };

  //   if (getCartId) {
  //     fetchCartAndDeliveryCharge();
  //   }
  // }, [getCartId, userId, vendorId, user?.data?.contact_number]);

  const fetchCartAndDeliveryCharge = async () => {
    try {
      // Fetch cart
      if (getCartId) {
        const cartResponse: any = await getCartApi(getCartId);
        if (cartResponse) {
          setCartItem(cartResponse);
        }
      }

      // const deliveryPartner =
      //   getPaymentDeliveryPartnerData?.data?.data?.[0]?.delivery_partner;

      // Fetch delivery charge (not own delivery)
      if (
        user?.data?.contact_number &&
        userId &&
        vendorId
        // deliveryPartner !== "own_delivery"
      ) {
        const deliveryResponse: any = await getDeliveryChargeApi("", {
          user_id: userId,
          vendor_id: vendorId,
          payment_mode: "",
          customer_phone: user?.data?.contact_number,
        });

        if (deliveryResponse) {
          setDeliveryChargeValue(deliveryResponse);
        }
      }
    } catch (error) {
      console.error("Error in cart/delivery API:", error);
    }
  };

  useEffect(() => {
    if (getCartId) {
      fetchCartAndDeliveryCharge();
    }
  }, [getCartId, userId, vendorId, user?.data?.contact_number, refreshTrigger]);



  // getPaymentDeliveryPartnerApi
  const getPaymentDeliveryPartnerData: any = useQuery({
    queryKey: ['getAppliedCouponDataData', vendorId],
    queryFn: () => getPaymentDeliveryPartnerApi(`${vendorId}`),
    enabled: !!vendorId
  })


  useEffect(() => {
    if (data?.data?.length) {
      const selected = data?.data?.find((address: any) => address?.selected_address === true);
      if (selected?.id) {
        setSelectedAddressId(String(selected?.id));
      }
    }
  }, [data]);

  const postDtdcCharge = async () => {
    setDtdcLoader(true);
    setDtdcErrorMessage('')
    try {
      // 1. Fetch cart data
      const dtdcDeliveryCharge: any = await postDtdcChargeApi('',
        {
          user_id: user?.data?.id,
          vendor_id: vendorId,
          payment_mode: paymentValue === 'PAY ON' ? '' : 'cod',
          customer_phone: user?.data?.contact_number,
          service_type: dtdcSelectValue
        });
      if (dtdcDeliveryCharge) {
        setDtdcDeliveryCharge(dtdcDeliveryCharge?.data)
      }
    } catch (error: any) {
      setDtdcLoader(false)
      setDtdcErrorMessage(error?.response?.data?.error)
      console.log(error)
    }
  };
  useEffect(() => {


    if (dtdcSelectValue) {
      postDtdcCharge();
    }
  }, [dtdcSelectValue, paymentValue]);

  // getAllCouponsData
  const getAllCouponsData: any = useQuery({
    queryKey: ['getAllCouponsData', vendorId],
    queryFn: () => getAllCouponsApi(`?vendor_id=${vendorId}`),
    // enabled: !!vendorId
  })

  const availableCoupons = getAllCouponsData?.data?.data?.data

  const handleRemoveCoupon = async (id: any) => {
    setCouponloader(true);
    try {
      const updateAPi = await deleteCouponApi(`${getCartId}/coupon/${id}/remove/`
        , { updated_by: 'user' })
      if (updateAPi) {
        await fetchCartAndDeliveryCharge();
        setCouponloader(false);
        queryClient.invalidateQueries(['getAppliedCouponDataData'] as InvalidateQueryFilters);
        if (onUpdate) onUpdate();
        setError('');
        setCode('');
      }
    } catch (error) {
    }
  }

  const appliedCouponIds =
    getAppliedCouponData?.data?.data?.applied_coupons
      ?.map((item: any) => item?.coupon_id) || [];

  const deliveryCharge = Number(DeliveryChargeValue?.data?.delivery_charge);
  const finalDeliveryCharge = Number(DeliveryChargeValue?.data?.final_delivery_charge);
  const hasDiscount = deliveryCharge > finalDeliveryCharge;

  return (
    <>
      {data?.data?.length ? (
        <div className="space-y-3 mb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Delivery Address</h3>
            <Link
              href="/profile?tab=addresses"
              className="text-sm text-blue-600 hover:text-blue-700"
            // onClick={() => {onClose(),setOpenMoadl(!openModal)}}
            >
              Manage addresses
            </Link>
          </div>

          <div className="space-y-2">

            {data?.data?.map((address: any) => (
              <label
                key={address.id}
                className={`flex items-start p-3 rounded-lg border cursor-pointer
            ${selectedAddressId === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="deliveryAddress"
                  value={address.id}
                  checked={selectedAddressId === String(address.id)}
                  onChange={() => { handleSelectAddress(address) }}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {address.street}
                    {address.isDefault && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-sm font-bold text-gray-500">
                    {address.customer_name}, {address.contact_number},
                  </p>
                  <p className="text-sm text-gray-500">
                    {address.address_line1}, {address.address_line2},
                  </p>
                  <p className="text-sm text-gray-500">
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p className="text-sm text-gray-500">{address.country}</p>
                </div>
              </label>
            ))}
          </div>

        </div>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-lg mb-3">
          <MapPin className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No delivery address found</p>
          <p className="mt-2 inline-block text-sm text-green-600 hover:text-green-700 cursor-pointer"
            onClick={() => {
              router.push('/profile?tab=addresses')
            }
              //  setOpenMoadl(!openModal)
            }
          >
            Add a delivery address
          </p>
        </div>
      )}


      <div className="bg-[#F8F7F2] rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(DeliveryChargeValue?.data?.product_total)}</span>
          </div>
          {getPaymentDeliveryPartnerData?.data?.data[0]?.delivery_partner === "own_delivery" ?
            (<>
              {/* <div className="space-y-4 font-bold !text-gray-600 mt-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Charge</span>

                  {paymentValue === "CASH ON DELIVERY" ? (
                    <span>
                      {formatPrice(
                        Number(getPaymentDeliveryPartnerData?.data?.data[0]?.own_cod_delivery_charge)
                        +
                        Number(getPaymentDeliveryPartnerData?.data?.data[0]?.own_delivery_charge)
                      )}
                    </span>
                  ) : (
                    <span>
                      {formatPrice(
                        Number(getPaymentDeliveryPartnerData?.data?.data[0]?.own_delivery_charge)
                      )}
                    </span>
                  )}
                </div>
                {
                  getWrapCost > 0 &&
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Wrap cost</span>
                    <span>{formatPrice(getWrapCost)}</span>
                  </div>
                }
              </div>
              <div className="space-y-4 font-bold !text-gray-600 mt-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span>
                    {(() => {
                      const baseAmount = Number(totalAmountValue || 0);
                      const discount = Number(getAppliedCouponData?.data?.data?.total_discount || 0);
                      const deliveryCharge =
                        paymentValue === "CASH ON DELIVERY"
                          ? Number(getPaymentDeliveryPartnerData?.data?.data?.[0]?.own_cod_delivery_charge || 0) + Number(getPaymentDeliveryPartnerData?.data?.data?.[0]?.own_delivery_charge || 0)
                          : Number(getPaymentDeliveryPartnerData?.data?.data?.[0]?.own_delivery_charge || 0);

                      const finalTotal = baseAmount + deliveryCharge;

                      return formatPrice(finalTotal > 0 ? finalTotal : 0);
                    })()}
                  </span>
                </div>
              </div> */}
              {/* {DeliveryChargeValue?.data?.final_delivery_charge > 0 && (
                <div className="space-y-4 font-bold !text-gray-600 mt-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deliver Charge (incl transaction charges)</span>
                    <span>{formatPrice(Number(DeliveryChargeValue?.data?.final_delivery_charge))}</span>
                  </div >
                </div >
              )} */}
              <div className="space-y-4 font-bold text-gray-600 mt-1">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Delivery Charge (incl transaction charges)
                  </span>

                  {Number(DeliveryChargeValue?.data?.final_delivery_charge) > 0 ? (
                    <div className="flex items-center gap-2">

                      {/* <span className="line-through text-gray-400 text-sm">
                        {formatPrice(Number(DeliveryChargeValue?.data?.delivery_charge))}
                      </span>

                      <span className="text-gray-800">
                        {formatPrice(Number(DeliveryChargeValue?.data?.final_delivery_charge))}
                      </span> */}

                      {/* Old delivery charge – show only if discount exists */}
                      {hasDiscount && (
                        <span className="line-through text-gray-400 text-sm">
                          {formatPrice(deliveryCharge)}
                        </span>
                      )}

                      {/* Final delivery charge – always show */}
                      <span className="text-gray-800">
                        {formatPrice(finalDeliveryCharge)}
                      </span>

                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {/* Old delivery charge – strike */}
                      <span className="line-through text-gray-400 text-sm">
                        {formatPrice(Number(DeliveryChargeValue?.data?.delivery_charge))}
                      </span>

                      {/* Free */}
                      <span className="text-green-600 font-bold">
                        FREE
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* {getAppliedCouponData?.data?.data?.data
                ?.filter((item: any) => item?.discount_type !== "delivery")
                ?.map((item: any) => (
                  <div className="flex justify-between text-green-500">
                    <span className="text-green-500">{item?.code}</span>
                    <span>- {formatPrice(item?.discount_value)}</span>
                  </div>
                ))} */}

              {getAppliedCouponData?.data?.data?.data
                ?.filter((item: any) => item?.discount_type !== "delivery")
                ?.map((item: any) => (
                  <div
                    key={item?.id}
                    className="flex justify-between items-center text-sm text-green-600 mt-2"
                  >
                    <span className="font-medium">
                      Coupon <span className="text-green-700">({item?.code})</span>
                    </span>
                    <span className="font-semibold">
                      - {formatPrice(item?.discount_value)}
                    </span>
                  </div>
                ))}


              {/* <div className="space-y-4 font-bold !text-gray-600 mt-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span>{formatPrice(Number(DeliveryChargeValue?.data?.final_price_including_delivery))}</span>
                </div>
              </div> */}
              <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-700">
                    Total Payable
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(Number(DeliveryChargeValue?.data?.final_price_including_delivery))}
                  </span>
                </div>
              </div>

            </>) : (
              <>
                {
                  addressError ?
                    <span className='mt-4 p-2 text-red-600'>{addressError}</span>
                    :
                    <>
                      <div className="space-y-4 font-bold !text-gray-600 mt-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deliver Charge (incl transaction charges)</span>
                          <span>{formatPrice(Number(DeliveryChargeValue?.final_delivery_charge))}</span>
                        </div >
                      </div >

                      <div className="space-y-4 font-bold !text-gray-600 mt-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total</span>
                          <span>{formatPrice(Number(DeliveryChargeValue?.final_price_including_delivery))}</span>
                        </div>
                      </div>
                    </>
                }
              </>
            )}
        </div>

        <div className="mt-6 space-y-4">

          {getAppliedCouponData?.data?.data?.applied_coupons?.length ? (
            <>
              {/* {getAppliedCouponData?.data?.data?.auto_apply_coupons?.length && (
                <div>
                  <p className="text-sm text-green-700 font-bold mb-2">
                    Applied Coupon: {getAppliedCouponData?.data?.data?.auto_apply_coupons[0]?.code}
                  </p>
                  <p className="text-sm text-green-700 font-bold">
                    {getAppliedCouponData?.data?.data?.auto_apply_coupons[0]?.discount ? (
                      <>Discount Amount: ₹{getAppliedCouponData.data.data.auto_apply_coupons[0].discount}</>
                    ) : getAppliedCouponData?.data?.data?.auto_apply_coupons[0]?.delivery_discount ? (
                      <></>
                    ) : null}
                  </p>
                </div>
              )} */}

              {/* {getAppliedCouponData?.data?.data?.data?.map((item: any) => ( */}

              {getAppliedCouponData?.data?.data?.data
                ?.map((item: any) => (
                  <div className="bg-green-50 p-4 rounded-lg space-y-2 flex justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-bold mb-2">
                        Applied Coupon: {item?.code}
                      </p>
                      {item?.discount_type !== "delivery" && (
                        <p className="text-sm text-green-700 font-bold">
                          Discount Amount: ₹{item?.discount_value || 0}
                        </p>
                      )}

                    </div>
                    {item?.auto_apply !== true && (
                      <Button
                        onClick={() => {
                          handleRemoveCoupon(item?.id);
                          setCode(""); // reset code on remove
                        }}
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        disabled={couponLoader}
                      >
                        {couponLoader ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Remove Coupon"
                        )}
                      </Button>
                    )}

                  </div>
                ))}
            </>
          ) : ''}


          {getAppliedCouponData?.data?.data?.applied_coupons?.length < 2 &&
            (
              <div>
                <h4 className="font-semibold mb-2">Apply Coupon:</h4>

                <div className="flex items-center gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Discount code"
                    className="bg-white"
                    value={code}
                    onChange={(e: any) => setCode(e?.target?.value)}
                  />
                  <Button
                    disabled={!code || isChecking}
                    onClick={handleSubmit}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    {isChecking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
                {error && <p className="text-sm text-red-600 pb-2">{error}</p>}
                {availableCoupons
                  ?.filter((item: any) => item?.auto_apply !== true)
                  ?.filter((coupon: any) => !appliedCouponIds.includes(coupon?.id))
                  ?.filter((coupon: any) => {
                    if (!coupon?.allowed_users?.length) return true;
                    return coupon?.allowed_users?.includes(userId);
                  })
                  ?.map((coupon: any) => (
                    <div
                      key={coupon.id}
                      onClick={() => {
                        setCode(coupon?.code);
                      }}
                      className="cursor-pointer border mb-1 border-gray-200 bg-white rounded-lg p-3 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex justify-between">
                        <span className="font-bold text-[#b39e49]">{coupon?.code}</span>
                        {/* <span className="text-sm text-gray-600">

                          {coupon?.discount_type === "delivery" &&
                            String(coupon?.delivery_discount).includes('%') ? (
                            `${coupon?.delivery_discount} OFF`
                          ) : (
                            `₹${coupon?.delivery_discount} Maximum discount`
                          )
                          }

                          {coupon?.discount_type !== "delivery" &&
                            <>
                              {coupon?.discount_type === "percentage"
                                ? `${coupon?.discount_value}% OFF`
                                : `₹${coupon?.flat_discount} OFF`}
                            </>
                          }

                        </span> */}
                        <span className="text-sm text-gray-600">
                          {coupon?.discount_type === "delivery" ? (
                            coupon?.delivery_discount &&
                              String(coupon.delivery_discount).includes("%") ? (
                              `${coupon.delivery_discount} OFF`
                            ) : (
                              `Maximum discount ₹${coupon?.delivery_discount}`
                            )
                          ) : (
                            <>
                              {coupon?.discount_type === "percentage"
                                ? `${coupon?.discount_value}% OFF`
                                : `₹${coupon?.flat_discount} OFF`}
                            </>
                          )}
                        </span>

                      </div>
                      <p className="text-sm text-gray-500">{coupon?.description}</p>
                    </div>
                  ))}

              </div>
            )}

          {/* // : (
          //   <div>
          //     <h4 className="font-semibold mb-2">Apply Coupon:</h4>

          //     <div className="flex items-center gap-2 mb-2">
          //       <Input
          //         type="text"
          //         placeholder="Discount code"
          //         className="bg-white"
          //         value={code}
          //         onChange={(e: any) => setCode(e?.target?.value)}
          //       />
          //       <Button
          //         disabled={!code || isChecking}
          //         onClick={handleSubmit}
          //         variant="outline"
          //         className="whitespace-nowrap"
          //       >
          //         {isChecking ? (
          //           <Loader2 className="h-4 w-4 animate-spin" />
          //         ) : (
          //           "Apply"
          //         )}
          //       </Button>
          //     </div>
          //     {error && <p className="text-sm text-red-600 pb-2">{error}</p>}
          //     {availableCoupons
          //       ?.filter((coupon: any) => {
          //         if (!coupon?.allowed_users?.length) return true;
          //         return coupon?.allowed_users?.includes(userId);
          //       })
          //       ?.map((coupon: any) => (
          //         <div
          //           key={coupon.id}
          //           onClick={() => {
          //             setCode(coupon?.code);
          //           }}
          //           className="cursor-pointer border mb-1 border-gray-200 bg-white rounded-lg p-3 hover:bg-gray-50 transition-all"
          //         >
          //           <div className="flex justify-between">
          //             <span className="font-bold text-[#b39e49]">{coupon?.code}</span>
          //             <span className="text-sm text-gray-600">

          //               {coupon?.discount_type === "delivery" &&
          //                 String(coupon?.delivery_discount).includes('%') ? (
          //                 `${coupon?.delivery_discount} OFF`
          //               ) : (
          //                 `₹${coupon?.delivery_discount} Maximum discount`
          //               )
          //               }

          //               {coupon?.discount_type !== "delivery" &&
          //                 <>
          //                   {coupon?.discount_type === "percentage"
          //                     ? `${coupon?.discount_value}% OFF`
          //                     : `₹${coupon?.flat_discount} OFF`}
          //                 </>
          //               }

          //             </span>
          //           </div>
          //           <p className="text-sm text-gray-500">{coupon?.description}</p>
          //         </div>
          //       ))}

          //   </div>
          // )} */}

          <div>
            <label>Payment Method</label>
            {paymentMethod?.map((item: any) => (
              <label
                className={`flex items-start mb-2 p-3 rounded-lg border cursor-pointer
          ${paymentValue === item?.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={item?.value}
                  checked={paymentValue === String(item?.value)}
                  onChange={() => { handlePaymentMethod(item?.value) }}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {item?.value}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {!data?.data?.length ? (
            <Button className="w-full bg-[#a8822d] hover:bg-[#977526]"
              onClick={() => {
                router.push('/profile?tab=addresses')
              }}
            >
              Add a delivery address
            </Button>
          ) : (
            <>
              <Button className="w-full bg-[#a8822d] hover:bg-[#977526]"
                onClick={handleCheckout}
                // disabled={!selectedAddressId || loading || !dtdcSelectValue || !paymentValue}
                disabled={!selectedAddressId || loading || !getPaymentDeliveryPartnerData?.data?.data[0]?.delivery_partner}
              >

                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
              {errorMessage && (
                <div className='text-red-600 mt-2'>
                  {errorMessage}
                </div>
              )}
            </>
          )}
          <div className="text-center text-sm text-muted-foreground">
            <p>We accept:</p>
            <div className="flex justify-center gap-2 mt-2">
              <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/visa.svg" alt="Visa" className="h-6 w-auto opacity-70" />
              <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mastercard.svg" alt="Mastercard" className="h-6 w-auto opacity-70" />
              <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/paypal.svg" alt="PayPal" className="h-6 w-auto opacity-70" />
              <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/applepay.svg" alt="Apple Pay" className="h-6 w-auto opacity-70" />
            </div>
          </div>
        </div>
      </div>
      {paymentSuccess && <OrderSuccessModal />}

    </>
  );
}