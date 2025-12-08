"use client"
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import Img1 from '../../public/img/img-1.png'; // Leaf top-left
import Img2 from '../../public/img/img-2.png'; // Leaf top-right
import Img3 from '../../public/img/img-3.png'; // Leaf mid-right
import Img5 from '../../public/img/img-1.png'; // Lime
import Img7 from '../../public/img/img-2.png'; // Pear
import logo from '../../public/img/logo.jpeg'
import { getVendorDeliveryDetailsApi } from '@/api-endpoints/authendication';
import { useQuery } from '@tanstack/react-query';
import { useVendor } from '@/context/VendorContext';
import { FaLinkedin } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ApiUrls from '@/api-endpoints/ApiUrls';
import { useUser } from '@/context/UserContext';

export default function Footer() {
  const { vendorId } = useVendor();
  const router = useRouter();
  const [testimonialData, setTestimonialData] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getUserId, setUserId] = useState<string | null>(null);
  const { user, setUser }: any = useUser();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' })

  const getVendorDeliveryDetailsData: any = useQuery({
    queryKey: ['getVendorDeliveryDetailsData', vendorId],
    queryFn: () => getVendorDeliveryDetailsApi(`${vendorId}`),
    enabled: !!vendorId
  })
  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  const testimonialGetApi = async () => {
    try {
      const res: any = await axios.get(`${ApiUrls?.testimonial}?user_id=${user?.data?.id}&vendor_id=${vendorId}`);
      if (res?.data) {
        setTestimonialData(res?.data?.testimonials);
      } else {
        console.warn('Unexpected API response:', res.data);
      }
    } catch (error) {
      console.log('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    testimonialGetApi();
  }, [user?.data?.id]);

  const handleFormChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post(`${ApiUrls?.testimonial}`, { ...form, vendor: vendorId, verified_status: false, created_by: user?.data?.name ? user?.data?.name : 'user', user: getUserId })
      setSubmitted(true)
      setTimeout(() => {
        testimonialGetApi();
        setIsModalOpen(false)
        setForm({ title: '', description: '' })
        setSubmitted(false)
      }, 1500)
    } catch (err) {
      console.error(err)
      alert('Error submitting testimonial')
    }
  }
  const socialMediaData = getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.social_media_icon;
  return (
    <footer className="relative bg-[#F8F7F2] border-t border-border overflow-hidden">
      {!testimonialData?.length && (
        <section className="bg-white py-16 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold  mb-4">    What Our Customers Say!</h2>
            <p className="text-gray-600 mb-8">
              We love to hear from our customers. Share your experience with us!
            </p>

            <button
              onClick={() => {
                getUserId ?
                  setIsModalOpen(true)
                  :
                  router.push('/auth/login');
              }}
              className="px-6 py-3 bg-[#d5a773] text-white font-medium rounded-lg hover:bg-[#e5ba8a] transition mb-6"
            >
              Write a Testimonial
            </button>
          </div>
        </section>
      )}
      <div className="container mx-auto px-4 py-12 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              <Image src={logo} height={150} width={150} alt='Syed gifts logo' />
            </h3>

            <div className="flex space-x-4">
              <span className='flex gap-3 mt-2'>
                {socialMediaData?.facebook?.url && socialMediaData?.facebook?.status === true && (
                  <a
                    href={socialMediaData?.facebook?.url}
                    target='_blank' className="bg-slate-100 p-2 hover:scale-110 transition-transform rounded-full text-[#000] ">
                    <Facebook size={16} />
                  </a>
                )}
                {socialMediaData?.twitter?.url && socialMediaData?.twitter?.status === true && (
                  <a
                    href={socialMediaData?.twitter?.url}
                    target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                    <Twitter size={16} />
                  </a>
                )}
                {socialMediaData?.youtube?.url && socialMediaData?.youtube?.status === true && (
                  <a
                    href={socialMediaData?.youtube?.url}
                    target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                    <Youtube size={16} />
                  </a>
                )}
                {socialMediaData?.instagram?.url && socialMediaData?.instagram?.status === true && (
                  <a
                    href={socialMediaData?.instagram?.url}
                    target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                    <Instagram size={16} />
                  </a>
                )}
                {socialMediaData?.linkedin?.url && socialMediaData?.linkedin?.status === true && (
                  <a
                    href={socialMediaData?.linkedin?.url}
                    target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                    <FaLinkedin size={16} />
                  </a>
                )}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-muted-foreground hover:text-[#4D8B31]">All Products</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-[#4D8B31]">Categories</Link></li>
              {/* <li><Link href="/bestsellers" className="text-muted-foreground hover:text-[#4D8B31]">Best Sellers</Link></li> */}
              {/* <li><Link href="/new" className="text-muted-foreground hover:text-[#4D8B31]">New Arrivals</Link></li> */}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-[#4D8B31]">Our Story</Link></li>
              {/* <li><Link href="/sustainability" className="text-muted-foreground hover:text-[#4D8B31]">Sustainability</Link></li> */}
              <li><Link href="/blog" className="text-muted-foreground hover:text-[#4D8B31]">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-[#4D8B31]">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Policy Pages</h4>
            <ul className="space-y-2">
              <li><Link href="/shipping-policy" className="text-muted-foreground hover:text-[#a8822d]">Shipping & Delivery</Link></li>
              <li><Link href="/cancellation-policy" className="text-muted-foreground hover:text-[#a8822d]">Cancellation & Refund</Link></li>
              <li><Link href="/terms-conditions" className="text-muted-foreground hover:text-[#a8822d]">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-[#a8822d]">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center relative z-10">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Syed gifts. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/visa.svg" alt="Visa" className="h-6 w-auto opacity-70" />
            <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mastercard.svg" alt="Mastercard" className="h-6 w-auto opacity-70" />
            <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/paypal.svg" alt="PayPal" className="h-6 w-auto opacity-70" />
            <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/applepay.svg" alt="Apple Pay" className="h-6 w-auto opacity-70" />
          </div>
        </div>
      </div>

      {/* Static decorative images without animation */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
        {/* <div className="absolute top-20 left-4 w-20">
          <Image src={Img1} alt="Leaf 1" width={80} height={80} />
        </div> */}
        <div className="absolute top-0 right-6 w-24 animate-bounce">
          <Image src={Img2} alt="Leaf 2" width={90} height={90} />
        </div>
        <div className="absolute bottom-10 right-10 w-16 animate-bounce">
          <Image src={Img3} alt="Leaf 3" width={70} height={70} />
        </div>
        <div className="absolute bottom-5 left-10 w-24 animate-bounce">
          <Image src={Img5} alt="Lime" width={100} height={100} />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 animate-bounce">
          <Image src={Img7} alt="Pear" width={120} height={120} />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-[9999] overflow-auto ">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mt-24 p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h3 className="text-2xl font-semibold mb-4 text-center">Share Your Feedback</h3>

            {submitted ? (
              <div className="text-center text-green-600 font-medium py-6">
                ✅ Thank you for your feedback!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="Your Name"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#d5a773] outline-none"
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Write your testimonial..."
                  rows={4}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#d5a773] outline-none"
                />
                <button type="submit" className="w-full py-3 bg-[#d5a773] text-white rounded-lg hover:bg-[#e5ba8a] transition">Submit</button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}



