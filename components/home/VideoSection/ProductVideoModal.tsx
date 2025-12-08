import { postCartitemApi } from "@/api-endpoints/CartsApi";
import LoginModal from "@/app/auth/LoginModal/page";
import { useVendor } from "@/context/VendorContext";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProductVideoModal({ videoList, initialIndex, onClose }: any) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentVideo = videoList[currentIndex];
  const router = useRouter();
  const [getUserId, setUserId] = useState<string | null>(null);
  const [getCartId, setCartId] = useState<string | null>(null);
  const [getUserName, setUserName] = useState<string | null>(null);
  const [signInmodal, setSignInModal] = useState(false);
  const { vendorId } = useVendor();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedCartId = localStorage.getItem("cartId");
    const storedUserName = localStorage.getItem("userName");
    setUserId(storedUserId);
    setCartId(storedCartId);
    setUserName(storedUserName);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev: number) => (prev + 1) % videoList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev: number) => (prev === 0 ? videoList.length - 1 : prev - 1));
  };

  const handleAddCart = async (id: any, qty: any) => {
    const payload = {
      cart: getCartId,
      product: id,
      user: getUserId,
      vendor: vendorId,
      quantity: qty,
      created_by: getUserName ? getUserName : "user",
    };
    try {
      const response = await postCartitemApi(``, payload);
      if (response) {
        onClose();
        queryClient.invalidateQueries(["getCartitemsData"] as InvalidateQueryFilters);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Detects and converts YouTube / Shorts / youtu.be to embeddable link
  const getVideoEmbed = (url: string) => {
    if (!url) return null;

    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    if (url.includes("youtube.com/shorts/")) {
      return url.replace("shorts/", "embed/");
    }

    return null; // fallback → treat as normal MP4
  };

  const embedUrl = getVideoEmbed(currentVideo?.thumbnail_url);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-8 overflow-auto">
      <div className="bg-white rounded-sm shadow-lg w-full max-w-2xl flex flex-col md:flex-row relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
        >
          ×
        </button>

        {/* ✅ Left Video Section */}
        <div className="w-full md:w-1/2 bg-black relative">
          {embedUrl ? (
            <iframe
              className="w-full h-full object-cover"
              src={embedUrl}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video
              className="w-full h-full object-cover"
              src={currentVideo?.thumbnail_url}
              autoPlay
              loop
              muted
              controls
            />
          )}

          <button
            onClick={handlePrev}
            className="fixed top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-60 hover:bg-opacity-80 p-3 rounded-full z-50"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="fixed top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-60 hover:bg-opacity-80 p-3 rounded-full z-50"
          >
            <ArrowRight size={24} />
          </button>
          <button
            onClick={onClose}
            className="fixed top-10 right-6 transform -translate-y-1/2 text-white bg-black bg-opacity-60 hover:bg-opacity-80 p-1 rounded-full z-50"
          >
            X
          </button>
        </div>

        {/* ✅ Right Product Info Section */}
        <div className="w-full md:w-1/2 flex flex-col max-h-[90vh]">
          {/* Product Info */}
          <div className="mb-3 p-6">
            <img
              src={currentVideo?.product_details?.image_urls?.[0]}
              alt="Product"
              className="w-28 h-28 object-cover rounded-lg mb-3 mx-auto"
            />
            <h2 className="text-xl font-semibold">{currentVideo?.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-green-600">
                ₹{currentVideo?.product_details?.price}
              </span>
              {currentVideo?.product_details?.price ===
                currentVideo?.product_details?.originalPrice ||
                currentVideo?.product_details?.originalPrice === 0 ||
                currentVideo?.product_details?.originalPrice === "" ? (
                ""
              ) : (
                <span className="line-through text-gray-400 text-lg">
                  ₹{currentVideo?.product_details?.discount}
                </span>
              )}
            </div>
          </div>

          {/* Separator */}
          <div className="h-2 bg-gray-200"></div>

          {/* Description */}
          <div className="text-sm text-gray-600 p-6 overflow-y-auto max-h-[200px]">
            <div className="text-sm text-gray-700 leading-relaxed">
              <strong>Description:</strong>{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: currentVideo?.product_details?.description
                    ? currentVideo.product_details.description
                    : "",
                }}
              />
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex gap-3 p-6 mt-auto">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => {
                router.push(`/products/${currentVideo?.product}`);
              }}
            >
              More info
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                if (getUserId) {
                  handleAddCart(currentVideo?.product, 1);
                } else {
                  onClose();
                  setSignInModal(true);
                }
              }}
            >
              Add to cart
              <ShoppingCart />
            </button>
          </div>
        </div>
      </div>

      {signInmodal && (
        <LoginModal
          open={signInmodal}
          handleClose={() => setSignInModal(false)}
          vendorId={vendorId}
        />
      )}
    </div>
  );
}
