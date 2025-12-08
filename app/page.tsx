import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import BestSellers from '@/components/home/BestSellers';
import OurProcess from '@/components/home/OurProcess';
import CustomerReviews from '@/components/home/CustomerReviews';
import Newsletter from '@/components/home/Newsletter';
import VideoSection from '@/components/home/VideoSection/VideoSection';

export default function Home() {
  return (
    <div className="flex flex-col w-full mt-3">
      <HeroSection />
      <FeaturedCategories />
      <BestSellers />
      <VideoSection />
      <OurProcess />
      <CustomerReviews />
      {/* <Newsletter /> */}
    
    </div>
  );
}