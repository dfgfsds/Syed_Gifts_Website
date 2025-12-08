'use client';

import { useCategories } from "@/context/CategoriesContext";
import { useProducts } from "@/context/ProductsContext";
import { useRouter } from "next/navigation";
import emptyBox from '../../../public/img/empty-box.png'
import Image from "next/image";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
export default function CategoryPageClient({ id }: { id: string }) {
    const { categories, isLoading }: any = useCategories();
    const router = useRouter();

    const category = categories?.data?.find(
        (cat: any) => cat.id.toString() === id
    );
    const { products }: any = useProducts();

    const findCategory = categories?.data?.find((item: any) => item?.id === Number(id));
    const filteredProducts = products?.data?.filter((item: any) => item?.category === Number(id)) || [];

    if (isLoading) return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col animate-pulse">
                        <div className="aspect-square bg-green-200"></div>
                        <div className="p-4 flex flex-col flex-1 gap-2">
                            <div className="h-4 bg-green-200 rounded w-3/4"></div>
                            <div className="h-3 bg-green-200 rounded w-1/2"></div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 bg-green-200 rounded w-16"></div>
                                    <div className="h-3 bg-green-200 rounded w-12"></div>
                                </div>
                                <div className="h-8 w-16 bg-green-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    if (!filteredProducts && filteredProducts?.length === 0) return (
        <>
            <Image
                src={emptyBox ?? "https://semantic-ui.com/images/wireframe/image.png"}
                alt="Empty"
                className='size-24 mx-auto'
                width={400}
                height={300}
            />
            <div className='text-center text-green-500 font-bold'>No products found in this category.</div>
        </>
    )

    return (
        <div className="bg-[#D6FFD7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
                <div className="flex mt-auto mb-auto !cursor-pointer"
                    onClick={() => router.back()}
                >
                    <ArrowLeft />
                    <h1>Back</h1>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 my-4">
                    {findCategory?.name || "Category Not Found"}
                </h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {filteredProducts.map((product: any) => (
                        <div
                            key={product.id}
                            onClick={() => router.push(`/products/${product.id}`)}
                            className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <div className="aspect-square overflow-hidden relative">
                                <img
                                    src={product?.image_urls ? product?.image_urls?.[0] : "https://semantic-ui.com/images/wireframe/image.png"}
                                    alt={product?.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                />
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <h2 className="uppercase !text-lg sm:text-base font-semibold  line-clamp-1 text-[#346e1c]">
                                    {product?.name?.slice(0, 20)}
                                </h2>

                                <div className="mt-1">
                                    {/* <span className="font-semibold line-through text-gray-500 text-sm">{formatPrice(product?.discount)}</span><br /> */}
                                    <span className="text-[#346e1c] font-medium">{formatPrice(product?.price)}</span>
                                    {product?.price === product?.discount || product?.discount === 0 || product?.discount === '' ?
                                        ('') : (
                                            <>
                                                <span className="ml-2 line-through text-gray-500 font-medium text-sm">{formatPrice(product?.discount)}</span>

                                            </>
                                        )}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
