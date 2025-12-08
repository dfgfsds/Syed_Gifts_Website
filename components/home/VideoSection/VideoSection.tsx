"use client";
import React, { useEffect, useRef, useState } from "react";
import ProductVideoModal from "./ProductVideoModal";
import axios from "axios";
import { baseUrl } from "@/api-endpoints/ApiUrls";
import { useVendor } from "@/context/VendorContext";

export default function VideoSection() {
  const [videoList, setVideoList] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { vendorId } = useVendor();

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${baseUrl}/videos/vendor/142/`);
      setVideoList(res.data.videos || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider) return;
    setIsDragging(true);
    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeft(slider.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  // ✅ Convert YouTube / Shorts to embeddable link
  const getVideoEmbed = (url: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    if (url.includes("youtube.com/shorts/")) return url.replace("shorts/", "embed/");
    return null;
  };

  // ✅ Don't render if there are no videos
  if (!videoList.length) return null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-center mb-4">Shop By Videos</h2>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-4 cursor-grab active:cursor-grabbing scrollbar-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        {videoList.map((video, index) => {
          const embedUrl = getVideoEmbed(video.thumbnail_url);

          return (
            <div
              key={index}
              className="relative min-w-[220px] rounded-lg shadow-md overflow-hidden"
              onClick={() => setSelectedIndex(index)}
            >
              {embedUrl ? (
                <iframe
                  className="w-full h-[350px] object-cover"
                  src={embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={video.thumbnail_url}
                  className="w-full h-[350px] object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}

              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white p-2 text-sm">
                <p className="font-semibold">{video.title}</p>
                <div className="flex items-center gap-2">
                  <span>₹{video?.product_details?.price}</span>
                  {video?.price === video?.originalPrice ||
                    video?.originalPrice === 0 ||
                    video?.originalPrice === "" ? (
                    ""
                  ) : (
                    <span className="line-through text-gray-300 text-xs">
                      ₹{video.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedIndex !== null && (
        <ProductVideoModal
          videoList={videoList}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );
}
