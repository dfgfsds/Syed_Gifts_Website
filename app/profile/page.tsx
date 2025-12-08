"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileOrders from '@/components/profile/ProfileOrders';
import ProfileAddresses from '@/components/profile/ProfileAddresses';
import ProfileAccount from '@/components/profile/ProfileAccount';
import { useSearchParams } from 'next/navigation';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const defaultTab = tabParam === 'addresses' || tabParam === 'account' ? tabParam : 'orders';
  return (
    <div className="bg-[#F8F7F2] min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Tabs defaultValue={defaultTab} className="w-full">
            <div className="border-b">
              <div className="container px-6">
                <TabsList className="h-14 bg-transparent gap-4">
                  <TabsTrigger 
                    value="orders" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#4D8B31] data-[state=active]:text-[#4D8B31] rounded-none px-1"
                  >
                    Order History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="addresses" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#4D8B31] data-[state=active]:text-[#4D8B31] rounded-none px-1"
                  >
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger 
                    value="account" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#4D8B31] data-[state=active]:text-[#4D8B31] rounded-none px-1"
                  >
                    Account Info
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div className="p-6">
              <TabsContent value="orders" className="mt-0">
                <ProfileOrders />
              </TabsContent>
              
              <TabsContent value="addresses" className="mt-0">
                <ProfileAddresses />
              </TabsContent>
              
              <TabsContent value="account" className="mt-0">
                <ProfileAccount />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}