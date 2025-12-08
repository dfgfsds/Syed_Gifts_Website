"use client";
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getBlogsApi } from '@/api-endpoints/authendication';
import { useVendor } from '@/context/VendorContext';

const posts = [
  {
    id: '1',
    title: 'The Benefits of Switching to Natural Skincare',
    excerpt: 'Discover why natural ingredients are better for your skin and the environment...',
    image: 'https://images.pexels.com/photos/6621472/pexels-photo-6621472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2024-03-15',
    author: {
      name: 'Emma Rodriguez',
      avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    category: 'Skincare'
  },
  {
    id: '2',
    title: 'Zero-Waste Living: A Beginner\'s Guide',
    excerpt: 'Simple steps to reduce your environmental impact and live more sustainably...',
    image: 'https://images.pexels.com/photos/5749147/pexels-photo-5749147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2024-03-10',
    author: {
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    category: 'Lifestyle'
  },
  {
    id: '3',
    title: 'Understanding Organic Food Labels',
    excerpt: 'Learn how to read and understand organic certifications and food labels...',
    image: 'https://images.pexels.com/photos/8105037/pexels-photo-8105037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2024-03-05',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/3785424/pexels-photo-3785424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    category: 'Food'
  }
];

export default function BlogPage() {
  const { vendorId } = useVendor();

  const getBlogsData: any = useQuery({
    queryKey: ['getBlogsData', vendorId],
    queryFn: () => getBlogsApi(`?vendor_id=${vendorId}`)
  })


  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/5748679/pexels-photo-5748679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Blog
            </h1>
            <p className="text-xl text-white/90">
              Discover thoughtful gifting ideas, trends, and inspirations to make every occasion memorable with Syed Gifts.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getBlogsData?.data?.data?.blogs?.map((post: any) => (
            <Link
              key={post?.id}
              href={`/blog/${post?.id}`}
              className="group block bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={post?.banner_url}
                  alt={post?.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-[#4D8B31]">
                    {post?.title}

                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post?.created_at)}
                  </span>
                </div>

                <h2 className="text-xl font-semibold mb-2 group-hover:text-[#4D8B31] transition-colors">
                  {post?.subtitle}

                </h2>

                <p className="text-muted-foreground mb-4">
                  {post?.content
                    ? `${post.content.replace(/<[^>]+>/g, '').slice(0, 70)}...`
                    : ''}
                </p>

                <div className="flex items-center">
                  <img
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2 "
                    alt={post?.author}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span className="text-sm font-medium">
                    {post?.author}
                  </span>
                </div>
                {/* <div className="flex items-center mt-4">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${post?.author || "A"}`}
                    alt={post?.author}
                    className="w-6 h-6 rounded-full mr-3"
                  />
                  <span className="text-sm font-medium text-gray-700">{post?.author}</span>
                </div> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}