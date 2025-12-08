"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function OrderSuccessModal() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/profile"); 
    }, 4000); 

    return () => clearTimeout(timer); 
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 text-center animate-fadeIn">
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="Success"
          className="w-20 h-20 mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-green-600 mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600">
          You will be redirected to the orders page shortly.
        </p>
      </div>
    </div>
  );
}

export default OrderSuccessModal;
