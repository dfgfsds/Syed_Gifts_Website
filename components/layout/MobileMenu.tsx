"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <span className="text-xl font-bold">
              <span className="text-[#4D8B31]">Syed </span> 
              <span className="text-[#8BC34A]">Gifts</span>
            </span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col mt-8 space-y-4">
          <MobileLink href="/" setOpen={setOpen}>Home</MobileLink>
          <MobileLink href="/products" setOpen={setOpen}>Shop</MobileLink>
          <MobileLink href="/categories" setOpen={setOpen}>Categories</MobileLink>
          <MobileLink href="/about" setOpen={setOpen}>About Us</MobileLink>
          <MobileLink href="/contact" setOpen={setOpen}>Contact</MobileLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function MobileLink({ 
  href, 
  children, 
  setOpen 
}: { 
  href: string; 
  children: React.ReactNode;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="block py-2 text-lg font-medium hover:text-[#4D8B31] transition-colors"
    >
      {children}
    </Link>
  );
}