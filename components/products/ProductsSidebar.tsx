import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { useCategories } from '@/context/CategoriesContext';

export default function ProductsSidebar({ selectedCategory, setSelectedCategory }: any) {
  const { categories }: any = useCategories();
  const handleCheckboxChange = (categoryId: any) => {
    setSelectedCategory((prev:any) =>
      prev === categoryId ? '' : categoryId
    );
  };


  return (
    <div className="bg-[#F8F7F2] p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <Accordion type="multiple" defaultValue={['category', 'price', 'badges']}>
        <AccordionItem value="category">
          <AccordionTrigger className="text-base font-medium">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {categories.data?.slice(0,30)?.map((category: any) => (
                <div key={category.id} className="flex items-center gap-2">
                  <Checkbox id={`category-${category.id}`}
                    checked={selectedCategory === category.id}
                    onCheckedChange={() => handleCheckboxChange(category.id)}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider defaultValue={[0, 100]} min={0} max={100} step={1} />
              <div className="flex justify-between">
                <span className="text-sm">$0</span>
                <span className="text-sm">$100</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem> */}

        {/* <AccordionItem value="badges">
          <AccordionTrigger className="text-base font-medium">Product Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {['Organic', 'Vegan', 'Cruelty-Free', 'Non-GMO', 'Gluten-Free', 'Biodegradable'].map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <Checkbox id={`badge-${badge}`} />
                  <label 
                    htmlFor={`badge-${badge}`} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {badge}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem> */}

        {/* <AccordionItem value="rating">
          <AccordionTrigger className="text-base font-medium">Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <Checkbox id={`rating-${rating}`} />
                  <label 
                    htmlFor={`rating-${rating}`} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {rating} Stars & Above
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem> */}
      </Accordion>
    </div>
  );
}