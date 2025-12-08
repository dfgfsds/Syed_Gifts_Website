"use client";
import Link from "next/link";
import { useCategories } from "@/context/CategoriesContext";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FeaturedCategories() {
  const { categories }: any = useCategories();



  const [slidesToShow, setSlidesToShow] = useState(5);

  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidesToShow(1);
      } else if (width < 768) {
        setSlidesToShow(2);
      } else if (width < 1024) {
        setSlidesToShow(3);
      } else if (width < 1280) {
        setSlidesToShow(4);
      } else {
        setSlidesToShow(4);
      }
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const settings = {
    dots: true,
    speed: 800,
    slidesToShow,
    slidesToScroll: 1,
    // autoplay: categories?.data.length > 1,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    loop: true,
    infinite: categories?.data?.length > 1,
  };

  return (
    <section className="py-10 bg-catBgImage">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Syed Gifts is the official super stockist and nationwide distributor of premium gift products across India
          </p>
        </div>

        <Slider {...settings}>
          {categories?.data?.map((category: any) => (
            <div key={category.id} className="px-2">
              <Link
                href={`/categories/${category.id}`}
                className="block group flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300"
              >
                <div className="w-64 h-48 mb-4 overflow-hidden rounded-md mx-auto">
                  <img
                    src={
                      category?.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-center text-base sm:text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
              </Link>
            </div>
          ))}
        </Slider>

        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center text-[#a8822d] font-medium hover:underline text-sm sm:text-base"
          >
            View All Categories
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
