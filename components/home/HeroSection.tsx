'use client';
import Banner1 from '../../public/img/banner1.jpg';
import Banner2 from '../../public/img/websiteBanner2.jpg';
import Banner3 from '../../public/img/websiteBanner3.jpg';
import Banner4 from '../../public/img/wensiteBanner4.jpg';
import Banner5 from '../../public/img/websiteBanner5.jpg';
import mobileBanner1 from '../../public/img/mobileBanner1.jpg'
import mobileBanner2 from '../../public/img/mobileBanner2.jpg'
import mobileBanner3 from '../../public/img/mobileBanner3.jpg'
import mobileBanner4 from '../../public/img/mobileBanner4.jpg'
import mobileBanner5 from '../../public/img/mobileBanner5.jpg'
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { baseUrl } from '@/api-endpoints/ApiUrls';
import { useVendor } from '@/context/VendorContext';


// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);


  // Refs for GSAP parallax animation
  const imgRefs = useRef([
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]);

  // 🧠 Fetch banners from API
  const bannerGetApi = async () => {
    try {
      const res = await axios.get(`${baseUrl}/banners/?vendorId=142`);
      setBanners(res.data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    bannerGetApi();
  }, []);

  // 📱 Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // 🌀 Auto slide every 5s
  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  // 🎞 GSAP animation setup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const images = imgRefs.current.map((ref, i) => ({
      ref,
      x: i % 2 === 0 ? -150 + i * 30 : 150 - i * 30,
      y: i % 2 === 0 ? 200 - i * 40 : -200 + i * 40,
      scale: 1.2 + i * 0.05,
      rotate: i % 2 === 0 ? 10 : -10,
      delay: i * 0.2,
    }));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-container',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
    });

    images.forEach(({ ref, x, y, scale, rotate, delay }) => {
      if (ref.current) {
        tl.to(
          ref.current,
          { x, y, scale, rotate, ease: 'power2.inOut', duration: 1.5 },
          delay
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      tl.kill();
    };
  }, []);

  // 🧭 Navigation buttons
  const nextSlide = () => {
    if (banners.length) {
      setCurrentIndex((current) => (current + 1) % banners.length);
    }
  };

  const prevSlide = () => {
    if (banners.length) {
      setCurrentIndex((current) => (current - 1 + banners.length) % banners.length);
    }
  };

  if (isMobile === null) return null;
  return (
    <>
      <div className="hero-container relative h-[70vh] md:h-[60vh] overflow-hidden">
        {banners.length > 0 &&
          banners.map((banner, index) => (
            <Link
              key={banner.id}
              href={banner.target_url || '#'}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div
                ref={imgRefs.current[index % imgRefs.current.length]}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${banner.image_url})`,
                }}
              />
            </Link>
          ))}

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>
    </>
  );
}