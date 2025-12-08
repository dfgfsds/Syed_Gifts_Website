import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function ProductGallery({ product }: { product: any }) {
  const images = product?.image_urls || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    if (product && images.length > 0) {
      setActiveIndex(0);
    }
  }, [product]);

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        nextImage(); // swipe left
      } else {
        prevImage(); // swipe right
      }
    }
  };

  const activeImage = images[activeIndex];

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square overflow-hidden rounded-xl border border-border bg-[#F8F7F2] group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={activeImage || 'https://semantic-ui.com/images/wireframe/image.png'}
          alt={product?.name}
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
        />

        {/* Arrows */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white transition"
        >
          <ArrowLeft />
        </button>

        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white transition"
        >
          <ArrowRight />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {images.map((image: any, index: number) => (
          <button
            key={index}
            className={`aspect-square rounded-lg overflow-hidden border-2 ${activeIndex === index
                ? 'border-[#4D8B31]'
                : 'border-transparent hover:border-[#4D8B31]/50'
              }`}
            onClick={() => setActiveIndex(index)}
          >
            <img
              src={image}
              alt={`${product?.name} - View ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
