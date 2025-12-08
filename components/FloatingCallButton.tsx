"use client";

import Link from "next/link";
import { Phone } from "lucide-react"; // or react-icons if u prefer
import { useQuery } from "@tanstack/react-query";
import { getVendorDeliveryDetailsApi } from "@/api-endpoints/authendication";
import { useVendor } from "@/context/VendorContext";

interface FloatingCallButtonProps {
    phoneNumber?: string;
}

export default function FloatingCallButton({
}: FloatingCallButtonProps) {
    const { vendorId } = useVendor();
    const getVendorDeliveryDetailsData: any = useQuery({
        queryKey: ['getVendorDeliveryDetailsData', vendorId],
        queryFn: () => getVendorDeliveryDetailsApi(`${vendorId}`),
        enabled: !!vendorId
    })
    const floatingCallData = getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.vendor_floating_icon;


    return (
        <>
            {floatingCallData?.call?.value && floatingCallData?.call?.status === true && (
                <Link
                    href={`tel:${floatingCallData?.call?.value}`}
                    className={`fixed bottom-36 md:bottom-24 ${floatingCallData?.call?.alignment?.split('-')[1]}-5 z-50 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-r bg-[#FF69B4] text-white shadow-lg transition-transform duration-300 hover:shadow-2xl`}
                    aria-label="Call Us"
                >
                    {/* Optional pulsing ring effect */}
                    {/* <span className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-500 opacity-75 animate-ping"></span> */}

                    <Phone size={20} className="sm:size-6 relative z-10 w-6 h-6" />
                </Link >
            )
            }
        </>
    );
}