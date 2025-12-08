"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import { updateUserAPi } from '@/api-endpoints/authendication';
import { useVendor } from '@/context/VendorContext';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function ProfileAccount() {
  const { user }: any = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const queryClient = useQueryClient();
  const { vendorId } = useVendor();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();


  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.data?.name || '',
        email: user?.data?.email || '',
        phone: user?.data?.contact_number || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const updateApi = await updateUserAPi(`/${user?.data?.id}`,
        { ...formData, updated_by: user?.data?.name ? user?.data?.name:'user', role: 3, vendor: vendorId })
      if (updateApi) {
        alert('User updated successfully');
        queryClient.invalidateQueries(['gerUserData'] as InvalidateQueryFilters);

      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
    localStorage.clear();
    }
    setOpenModal(false); 
    // setTimeout(() => {
    //   window.location.reload();
    // }, 300);
    router.push('/auth/login');
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name"  type="text" value={formData?.name} onChange={handleChange} />
            </div>


            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData?.email} onChange={handleChange} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={formData?.phone} onChange={handleChange} />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={handleUpdate} className="ml-auto bg-[#4D8B31] hover:bg-[#3e7026]">
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button className="ml-auto bg-[#4D8B31] hover:bg-[#3e7026]">
            Update Password
          </Button>
        </CardFooter>
      </Card> */}

      {/* <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Manage your email notifications</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Order confirmations</p>
              <p className="text-sm text-muted-foreground">Receive emails for order updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4D8B31]"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Promotions and deals</p>
              <p className="text-sm text-muted-foreground">Receive emails about new products and sales</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4D8B31]"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Account updates</p>
              <p className="text-sm text-muted-foreground">Receive emails about your account activity</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4D8B31]"></div>
            </label>
          </div>
        </CardContent>
      </Card> */}

      <div className="flex justify-between items-center pt-2">
        <Button 
        className='bg-red-600 hover:bg-red-700 text-white'
                onClick={() => setOpenModal(true)}
        >
          Logout
        </Button>
      </div>
      {openModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to sign out?</p>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}