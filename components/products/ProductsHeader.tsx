import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {  Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown:any;
  sortOption: string;
  setSortOption: (value: string) => void;
}

export default function ProductsHeader({ value, onChange ,onKeyDown,sortOption,setSortOption}: SearchBarProps) {


  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      {/* <p className="text-muted-foreground">
        Showing <span className="font-medium text-foreground">8</span> of <span className="font-medium text-foreground">24</span> products
      </p> */}
      
      <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search products..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

      <div className="flex items-center gap-3">
        {/* <div className="flex items-center border rounded-md">
          <Button variant="ghost" size="icon" className="rounded-l-md rounded-r-none" aria-label="Grid view">
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-r-md rounded-l-none" aria-label="List view">
            <List className="h-4 w-4" />
          </Button>
        </div> */}
        
        <div className="w-[180px]">
        <Select value={sortOption} onValueChange={(value) => setSortOption(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              {/* <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}