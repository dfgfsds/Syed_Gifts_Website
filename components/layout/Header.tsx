"use client"
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, User, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileMenu from './MobileMenu';
import logo from '../../public/img/new_logo.jpeg'
import { useEffect, useState } from 'react';
import { useCartItem } from '@/context/CartItemContext';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [getUserId, setUserId] = useState<string | null>(null);
  const { cartItem }: any = useCartItem();
  const pathname = usePathname();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  return (
    <header className="sticky top-0 bottom-40 z-50 w-full bg-white/80 backdrop-blur-md transition-all border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-6">
            <span className="text-2xl font-bold text-primary">
              {/* <span className="text-[#4D8B31]">Syed gifts</span> */}
              <Image src={logo} height={80} width={80} alt='Syed gifts logo' />
              {/* <span className="text-[#8BC34A]">Syed gifts</span> */}
            </span>
          </Link>

          {/* <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-[#4D8B31] transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-[#4D8B31] transition-colors">
              Shop
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-[#4D8B31] transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-[#4D8B31] transition-colors">
              About Us
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-[#4D8B31] transition-colors">
              Blogs
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-[#4D8B31] transition-colors">
              Contact
            </Link>
          </nav> */}

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-[#4D8B31] font-semibold' : 'hover:text-[#4D8B31]'
                }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors ${pathname.startsWith('/products') ? 'text-[#4D8B31] font-semibold' : 'hover:text-[#4D8B31]'
                }`}
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className={`text-sm font-medium transition-colors ${pathname.startsWith('/categories') ? 'text-[#4D8B31] font-semibold' : 'hover:text-[#4D8B31]'
                }`}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${pathname === '/about' ? 'text-[#4D8B31] font-semibold' : 'hover:text-[#4D8B31]'
                }`}
            >
              About Us
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors ${pathname.startsWith('/blog') ? 'text-[#4D8B31] font-semibold' : 'hover:text-[#4D8B31]'
                }`}
            >
              Blogs
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors ${pathname === '/contact' ? 'text-[#4D8B31] font-semibold' : 'hover:text-[#4D8B31]'
                }`}
            >
              Contact
            </Link>
          </nav>

        </div>

        <div className="flex items-center space-x-4">
          {/* <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button> */}

          <Link href={getUserId ? `/cart` : '/auth/login'}
            className={`text-sm font-medium transition-colors ${pathname === '/cart' ? 'text-[#4D8B31] font-semibold' : 'hover:text-[#4D8B31]'
              }`}
          >
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartItem?.data?.length ? (
                <span className="absolute -top-1 -right-1 bg-[#4D8B31] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItem?.data?.length}
                </span>
              ) : ('')}

            </Button>
          </Link>

          <Link href={getUserId ? `/profile` : '/auth/login'}
            className={`text-sm font-medium transition-colors ${pathname === '/profile' ? 'text-[#4D8B31] font-semibold' : 'hover:text-[#4D8B31]'
              }`}
          >
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}