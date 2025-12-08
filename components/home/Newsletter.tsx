"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Newsletter() {
  return (
    <section className="py-20 bg-[#4D8B31] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Sustainable Community</h2>
          <p className="text-white/80 mb-8">
            Subscribe to our newsletter to receive eco-friendly tips, exclusive offers, and updates on new products.
          </p>
          
          <form 
            className="flex flex-col sm:flex-row gap-3" 
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-white/20 text-white placeholder:text-white/60 border-white/30 focus-visible:ring-white"
              required
            />
            <Button type="submit" className="bg-white text-[#4D8B31] hover:bg-white/90">
              Subscribe
            </Button>
          </form>
          
          <p className="mt-4 text-sm text-white/70">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
}