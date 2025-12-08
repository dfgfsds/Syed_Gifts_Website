"use client";

import { Button } from '@/components/ui/button';
import { Loader, MapPin, Pencil, Plus, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddressForm from './AddressForm';
import { useEffect, useState } from 'react';
import { deleteAddressApi, getAddressApi } from '@/api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { patchUserSelectAddressAPi } from '@/api-endpoints/authendication';



export default function ProfileAddresses() {
  const [openModal, setOpenMoadl] = useState(false)
  const [userId, setUserId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editData, setEditData] = useState<any>('');
  const [deleteId, setDeleteId] = useState();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [getUserName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');

    setUserName(storedUserName);
    setUserId(storedUserId);
  }, []);


  const { data, isLoading }: any = useQuery({
    queryKey: ['getAddressData', userId],
    queryFn: () => getAddressApi(`user/${userId}`),
    enabled: !!userId
  })

  const confirmDelete = async () => {
    if (deleteId) {
      setLoading(true)
      const response = await deleteAddressApi(deleteId, { deleted_by: 'user' });
      if (response) {
        queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
        setDeleteModal(false);
        setLoading(false)
      }
    }
  };


  const handleSelectAddress = async (id: any) => {
    try {
      const upadetApi = await patchUserSelectAddressAPi(`user/${userId}/address/${id?.id}`, { updated_by: getUserName })
      if (upadetApi) {
        queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
      }
    } catch (error) {

    }
  }


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Addresses</h2>

        <Button className="bg-[#4D8B31] hover:bg-[#3e7026]"
          onClick={() => { setOpenMoadl(!openModal) }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>
      {data?.data?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.data?.map((address: any) => (
            <Card key={address.id} className="relative">
              {address?.selected_address && (
                <div className="absolute top-2 right-2">
                  <span className="bg-[#4D8B31]/10 text-[#4D8B31] text-xs font-medium px-2.5 py-0.5 rounded">
                    Default
                  </span>
                </div>
              )}

              <CardHeader className="pb-2">
                <CardTitle className='uppercase'>{address?.address_type}</CardTitle>
                <CardDescription>Shipping Address</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <span className='font-bold'>{address?.customer_name}</span><br />
                  {address?.contact_number}<br />
                  {address?.email_address}<br />
                  {address?.address_line1}<br />
                  {address?.address_line2 && <>{address?.address_line2}<br /></>}
                  {address?.city}, {address?.state} {address?.postal_code}<br />
                  {address?.country}
                </p>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="h-8"
                    onClick={() => { setOpenMoadl(!openModal), setEditData(address) }}

                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>

                  <Button variant="outline" size="sm" className="h-8 text-destructive hover:text-destructive"
                    onClick={() => { setDeleteModal(!deleteModal), setDeleteId(address?.id) }}
                  >
                    <Trash className="mr-1 h-3 w-3" />
                    Remove
                  </Button>

                  {!address?.selected_address && (
                    <Button variant="outline" size="sm" className="h-8 ml-auto"
                      onClick={() => handleSelectAddress(address)}

                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new address.</p>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/80 !bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white p-4 rounded-lg shadow-lg w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Delete Address</h2>
            </div>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete this address?
            </p>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => { setEditData(""), setLoading(false), setDeleteModal(!deleteModal) }}
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={loading}
                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 gap-2 flex"
              >
                Confirm Delete {loading ? (<Loader className='animate-spin' />) : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      <AddressForm
        openModal={openModal}
        handleClose={() => setOpenMoadl(!openModal)}
        editData={editData}
      />
    </div>
  );
}