"use client";
import ProductPageClient from './ProductPageClient';


type ProductPageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: ProductPageProps) {
  return <ProductPageClient id={params?.id} />;
}