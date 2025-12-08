"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useVendor } from "@/context/VendorContext";
import ApiUrls from "../../api-endpoints/ApiUrls";
import { formatDate } from "@/lib/utils";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function CustomerReviews() {
  const { vendorId } = useVendor();
  const [reviews, setReviews] = useState<any[]>([]);

  const staticImages = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
    "https://randomuser.me/api/portraits/men/55.jpg",
    "https://randomuser.me/api/portraits/women/12.jpg",
    "https://randomuser.me/api/portraits/men/41.jpg",
    "https://randomuser.me/api/portraits/women/70.jpg",
    "https://randomuser.me/api/portraits/men/85.jpg",
  ];

  const reviewsGetApi = async () => {
    try {
      const res = await axios.get(`${ApiUrls?.testimonial}?vendor_id=${vendorId}`);
      if (res.data?.testimonials) {
        const reviewsWithImages = res.data.testimonials.map((review: any, index: number) => ({
          ...review,
          img: staticImages[index % staticImages.length],
        }));
        setReviews(reviewsWithImages);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  useEffect(() => {
    if (vendorId) {
      reviewsGetApi();
    }
  }, [vendorId]);

  // Determine how many slides we can show based on screen size
  const slidesToShow = reviews.length >= 4 ? 4 : reviews.length || 1;

  const settings = {
    dots: reviews.length > 1, // show dots only if more than 1 review
    infinite: reviews.length > slidesToShow, // disable infinite scroll if items are fewer
    autoplay: reviews.length > 1, // autoplay only if more than one slide
    autoplaySpeed: 3000,
    slidesToShow,
    slidesToScroll: 1,
    speed: 800,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, reviews.length),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, reviews.length),
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-20 bg-cusBgImage">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from happy customers who’ve made their moments special with our personalized and unique gifts.
          </p>
        </div>

        {/* Reviews */}
        {reviews.length > 0 ? (
          <Slider {...settings}>
            {reviews
              .filter((review: any) => review?.verified_status === true) // ✅ Only verified reviews
              .map((review: any) => (
                <div key={review.id} className="px-3">
                  <div className="bg-white p-6 rounded-xl shadow-md h-54 transition-transform duration-300 hover:-translate-y-2">
                    <div className="flex items-center mb-4">
                      {/* <img
                        src={review?.img}
                        alt={review?.title || "User"}
                        className="w-12 h-12 rounded-full mr-3 object-cover"
                      /> */}
                      <div>
                        <h4 className="font-semibold text-gray-800">{review?.title}</h4>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{review?.description}</p>
                    <p className="text-xs text-gray-400">{formatDate(review?.created_at)}</p>
                  </div>
                </div>
              ))}
          </Slider>
        ) : (
          <p className="text-center text-gray-500">No reviews available</p>
        )}

      </div>
    </section>
  );
}