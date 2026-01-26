"use client";

import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { deleteCartitemsApi, updateCartitemsApi } from "@/api-endpoints/CartsApi";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { baseUrl } from "@/api-endpoints/ApiUrls";

interface CartItemProps {
  product: any;
  onUpdate: any;
  quantity: number;
}

export default function CartItem({ product, quantity: initialQuantity, onUpdate }: CartItemProps) {
  const queryClient = useQueryClient();


  const [isGiftWrap, setIsGiftWrap] = useState(product?.is_gift_wrap_opted || false);
  const [customInstruction, setCustomInstruction] = useState(product?.custom_instruction || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpdateCart = async (id: any, type: any, qty: any) => {
    try {
      if (qty === 1 && type === "decrease") {
        const updateApi = await deleteCartitemsApi(`${id}`);
        if (updateApi) queryClient.invalidateQueries(["getCartitemsData"] as InvalidateQueryFilters);
        if (onUpdate) onUpdate();
      } else {
        const response = await updateCartitemsApi(`${id}/${type}/`);
        if (response) queryClient.invalidateQueries(["getCartitemsData"] as InvalidateQueryFilters);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error("Error updating cart");
    }
  };

  const handleRemoveItem = async (id: any) => {
    try {
      const updateApi = await deleteCartitemsApi(`${id}`);
      if (updateApi) queryClient.invalidateQueries(["getCartitemsData"] as InvalidateQueryFilters);
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
  };

  // ✅ Gift Wrap + Custom Instruction API Update
  const handleGiftWrapUpdate = async (field: string, value: any) => {
    try {
      setLoading(true);
      const res = await axios.put(`${baseUrl}/api/cart_items/${product?.cartId}/`, {
        is_gift_wrap_opted: field === "is_gift_wrap_opted" ? value : isGiftWrap,
        custom_instruction: field === "custom_instruction" ? value : customInstruction,
        updated_by: "user",
        product: product?.id,
      });
      if (res) {
        if (onUpdate) onUpdate();
        setLoading(false);
        queryClient.invalidateQueries(["getCartitemsData"] as InvalidateQueryFilters);
        toast.success("Cart item updated!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update gift wrap or instruction");
    }
  };
  const onRemoveImage = async (cartImageId: number, index: number) => {
    //     /cart-item-images-delete/5/?index=1&media_type=image
    // Request=DELETE

    try {
      const response = await axios.delete(
        `${baseUrl}/cart-item-images-delete/${cartImageId}/?index=${index}&media_type=image`
      );

      if (response.status === 200) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleUploadRef = async (images: File[]) => {
    try {
      setUploading(true); // 🔥 start loading
      const formData = new FormData();
      formData.append("cart_item", product?.cartId ?? "");
      if (product?.uploadImages?.image_urls?.length > 0) {
        formData.append("updated_by", "user");
      } else {
        formData.append("created_by", "user");
      }
      images.forEach((file) => {
        formData.append("images", file); // ✅ multiple image upload
      });
      const response = await axios.post(`${baseUrl}/cart-item-images/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }

      console.log("Upload success:", response.data);
    } catch (error) {
      toast.error("Please add item to Cart!")
    } finally {
      setUploading(false); // 🔥 stop loading
    }
  };

  console.log(product)
  return (
    <div className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
      <div className="w-full sm:w-24 h-24 bg-white rounded-md overflow-hidden flex-shrink-0">
        <img
          src={
            product?.image_urls?.[0] ||
            product?.product_variant_image_urls?.[0] ||
            "https://semantic-ui.com/images/wireframe/image.png"
          }
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-grow">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">
              {product?.name || product?.product_variant_title || product?.product_size || ""}
            </h3>
            {product.variants && product.variants.length > 0 && (
              <p className="text-sm text-muted-foreground">Size: {product.variants[0].size}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => handleRemoveItem(product?.cartId)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quantity Controls */}
        <div className="flex justify-between items-end mt-2">
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => handleUpdateCart(product?.cartId, "decrease", product?.cartQty)}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <div className="w-10 text-center text-sm font-medium">{product?.cartQty}</div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => handleUpdateCart(product?.cartId, "increase", "")}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="font-semibold">{formatPrice(product?.price * product?.cartQty)}</div>
        </div>

        {/* 🟢 Gift Wrap and Custom Instruction Section */}
        <div className="mt-4 space-y-3 border-t pt-3">
          {/* ✅ Custom Tailwind Toggle Switch */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Gift Wrap</label>
            <div
              className={`relative inline-flex h-6 m-1 w-11 cursor-pointer rounded-full transition-colors ${isGiftWrap ? "bg-[#4D8B31]" : "bg-gray-300"
                }`}
              onClick={() => {
                const newValue = !isGiftWrap;
                setIsGiftWrap(newValue);
                handleGiftWrapUpdate("is_gift_wrap_opted", newValue);
              }}
            >
              <span
                className={`inline-block h-5 w-5 mt-[2px] transform rounded-full bg-white transition-transform ${isGiftWrap ? "translate-x-5" : "translate-x-0.5"
                  }`}
              />
            </div>
            {product?.gift_wrap_price ? <span>₹{product?.gift_wrap_price}</span> : <span></span>}
          </div>

          {product?.is_custom_message_required === true && (
            <>
              {product?.required_data_for_product && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold text-gray-800">
                    Required Data for this Product
                  </p>
                  <div className="rounded-md border border-dashed border-[#a5291b] bg-red-50 p-3">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {product?.required_data_for_product}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Custom Instruction</label>
                <textarea
                  value={customInstruction}
                  onChange={(e) => {
                    setCustomInstruction(e.target.value);
                  }}
                  onBlur={() => handleGiftWrapUpdate("custom_instruction", customInstruction)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1 outline-none focus:ring-2 focus:ring-[#a5291b]"
                  placeholder="Add a message or instruction..."
                  rows={2}
                />
              </div>
            </>
          )}


        </div>

        {product?.is_custom_image_required === true && (
          <>
            {/* 🖼️ Uploaded Images Section */}
            {product?.uploadImages && product?.uploadImages.image_urls.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h3>
                <div className="flex flex-wrap gap-3">
                  {product?.uploadImages?.image_urls?.map((img: any, i: number) => (
                    <div key={img.id} className="relative inline-block">
                      <img
                        src={img}
                        alt="Uploaded"
                        className="w-32 h-32 object-cover rounded-lg border shadow"
                      />
                      <button
                        onClick={() => onRemoveImage(product?.uploadImages?.id, i)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No images uploaded yet.</p>
            )}
            {/* 📤 Upload Button (always visible) */}
            {product?.uploadImages?.image_urls?.length === product?.custom_image_limit ?
              "" :
              (
                <button
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.multiple = true; // ✅ Allow multiple uploads
                    input.accept = "image/*";
                    input.onchange = (e: any) => {
                      const files = Array.from(e.target.files);
                      handleUploadRef(files as File[]);
                    };
                    input.click();
                  }}
                  disabled={uploading}
                  className={`mt-3 px-6 py-3 rounded-lg text-white 
    ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                >
                  {uploading ? "Uploading..." : "Upload Your Designs"}
                </button>
              )}
          </>)}
      </div>
    </div>
  );
}

