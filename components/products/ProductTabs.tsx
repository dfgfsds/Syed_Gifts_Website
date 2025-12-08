"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product } from '@/lib/data';

export default function ProductTabs({ product }: { product: Product }) {
  return (
    <Tabs defaultValue="description" className="mb-16">
      <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex h-auto p-0 bg-transparent gap-2">
        <TabsTrigger 
          value="description" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-[#4D8B31] data-[state=active]:text-[#4D8B31] rounded-none"
        >
          Description
        </TabsTrigger>
        <TabsTrigger 
          value="ingredients" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-[#4D8B31] data-[state=active]:text-[#4D8B31] rounded-none"
        >
          Ingredients
        </TabsTrigger>
        <TabsTrigger 
          value="reviews" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-[#4D8B31] data-[state=active]:text-[#4D8B31] rounded-none"
        >
          Reviews ({product?.reviews})
        </TabsTrigger>
      </TabsList>
      
      <div className="mt-6 border-t border-border pt-6">
        <TabsContent value="description" className="mt-0">
          <div className="prose max-w-none">
            <p>{product?.description}</p>
            <h4 className="text-lg font-semibold mt-4">Key Features</h4>
            <ul>
              {product?.badges?.map((badge) => (
                <li key={badge}>{badge}</li>
              ))}
              <li>Ethically sourced ingredients</li>
              <li>Sustainable packaging</li>
              <li>No artificial preservatives</li>
            </ul>
            <h4 className="text-lg font-semibold mt-4">How to Use</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel augue eget nisl tempor 
              fermentum eu vel nisi. Donec rhoncus augue quis risus auctor, eget tincidunt dolor elementum.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="ingredients" className="mt-0">
          <div className="prose max-w-none">
            <p>
              All of our ingredients are sourced ethically and sustainably. We believe in complete 
              transparency about what goes into our products.
            </p>
            <h4 className="text-lg font-semibold mt-4">Full Ingredient List</h4>
            <p>
              Aloe Barbadensis Leaf Juice*, Cocos Nucifera Oil*, Helianthus Annuus Seed Oil*, 
              Butyrospermum Parkii Butter*, Cetearyl Alcohol, Glyceryl Stearate, Glycerin*, 
              Simmondsia Chinensis Seed Oil*, Rosa Canina Fruit Oil*, Calendula Officinalis Flower Extract*.
            </p>
            <p className="text-sm text-muted-foreground mt-4">*Certified Organic Ingredients</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-0">
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border-b border-border pb-6 last:border-0">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#4D8B31]/10 flex items-center justify-center text-[#4D8B31] font-medium">
                      {['JD', 'SM', 'AR'][index]}
                    </div>
                    <div>
                      <div className="font-medium">{['Jane Doe', 'Sam Miller', 'Alex Rodriguez'][index]}</div>
                      <div className="text-sm text-muted-foreground">
                        {['March 12, 2023', 'February 28, 2023', 'April 5, 2023'][index]}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-4 w-4 ${i < [5, 4, 5][index] ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {[
                    "This product exceeded my expectations! The quality is outstanding, and I love that it's eco-friendly. Will definitely purchase again.",
                    "Great product, but I wish it came in more size options. The quality is excellent though, and shipping was fast.",
                    "Absolutely love this! It's become an essential part of my daily routine. Sustainable and effective - exactly what I was looking for."
                  ][index]}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}