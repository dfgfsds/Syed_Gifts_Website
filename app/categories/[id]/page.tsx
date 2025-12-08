// ❌ No 'use client' here
import ApiUrls from "@/api-endpoints/ApiUrls";
import axios from "axios";
import CategoryPageClient from "./CategoryPageClient";

// // Called at build-time to pre-render static paths
// export async function generateStaticParams() {
//   const res = await axios.get(ApiUrls.categories);
//   const categories = res.data;

//   return categories.map((category: any) => ({
//     id: category.id.toString(), // Always return string
//   }));
// }

export default function Page({ params }: { params: { id: string } }) {
  return <CategoryPageClient id={params.id} />;
}
