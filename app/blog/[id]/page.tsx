"use client";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getBlogsApi } from '@/api-endpoints/authendication';

const posts = [
  {
    id: '1',
    title: 'The Benefits of Switching to Natural Skincare',
    content: `
      <p>Natural skincare has been gaining popularity in recent years, and for good reason. Unlike conventional products that often contain synthetic ingredients and harsh chemicals, natural skincare products harness the power of plant-based ingredients to nourish and protect your skin.</p>

      <h2>Why Choose Natural Skincare?</h2>
      
      <p>There are several compelling reasons to make the switch to natural skincare:</p>
      
      <ul>
        <li>Gentle on Your Skin: Natural ingredients are less likely to cause irritation or adverse reactions</li>
        <li>Environmentally Friendly: Natural products often use sustainable ingredients and eco-friendly packaging</li>
        <li>Rich in Nutrients: Plant-based ingredients contain vitamins, minerals, and antioxidants</li>
        <li>No Harmful Chemicals: Avoid potentially harmful ingredients like parabens and synthetic fragrances</li>
      </ul>

      <h2>Key Ingredients to Look For</h2>
      
      <p>When shopping for natural skincare products, keep an eye out for these beneficial ingredients:</p>
      
      <ul>
        <li>Aloe Vera: Soothing and hydrating</li>
        <li>Jojoba Oil: Similar to skin's natural oils</li>
        <li>Green Tea: Rich in antioxidants</li>
        <li>Rosehip Oil: High in vitamin C</li>
      </ul>

      <h2>Making the Transition</h2>
      
      <p>When switching to natural skincare, it's important to transition gradually. Start by replacing one product at a time and pay attention to how your skin responds. Remember that natural products may work differently than conventional ones, so give your skin time to adjust.</p>
    `,
    image: 'https://images.pexels.com/photos/6621472/pexels-photo-6621472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2024-03-15',
    author: {
      name: 'Emma Rodriguez',
      avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      role: 'Skincare Expert'
    },
    category: 'Skincare',
    readTime: '5 min read'
  }
];


export default function BlogPost({ params }: { params: { id: string } }) {
  console.log(params?.id)

  const getBlogsData: any = useQuery({
    queryKey: ['getBlogsData', params?.id],
    queryFn: () => getBlogsApi(`${params?.id}`)
  })
  const post = getBlogsData?.data?.data?.blog
  console.log("Banner URL:", post);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {post?.banner_url && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${encodeURI(post.banner_url)}')` }}

          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}



        <div className="relative h-full max-w-3xl mx-auto px-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-white/90 mb-4">
            <span className="font-medium"> {post?.title && post.title.charAt(0).toUpperCase() + post.title.slice(1)}</span>
            <span>•</span>
            <span>{formatDate(post?.created_at)}</span>
            <span>•</span>
            <span>5 min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 capitalize">
            {post?.subtitle}
          </h1>

          {/* <div className="flex items-center mt-4">
                <img
                  src={`https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2}`}
                  alt={post?.author}
                  className="w-6 h-6 rounded-full mr-3"
                />
                <span className="text-sm font-medium text-gray-700">{post?.author}</span>
              </div> */}

          <div className="flex items-center">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2 "
              alt={post?.author}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="text-white">
              <div className="font-medium">{post?.author}</div>
              {/* <div className="text-sm text-white/90">{post?.author}</div> */}
            </div>
          </div>

        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Button
            asChild
            variant="ghost"
            className="mb-8 hover:bg-transparent hover:text-[#4D8B31]"
          >
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <article className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post?.content }} />
          </article>

          {/* Share Section */}
          {/* <div className="mt-12 pt-6 border-t">
            <div className="flex items-center gap-4">
              <span className="font-medium">Share this article:</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="hover:text-[#4D8B31]">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-[#4D8B31]">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-[#4D8B31]">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}