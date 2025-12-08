import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader, X } from 'lucide-react';
import { postAddressCreateApi, updateAddressApi } from '../../api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';


interface AddressFormProps {
  openModal: boolean;
  handleClose: () => void;
  editData: any;
}

export default function AddressForm({ openModal, handleClose, editData }: AddressFormProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');

    setUserId(storedUserId);
    setUserName(storedUserName);
  }, []);

  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<any>({
    defaultValues: {
      customer_name: editData?.customer_name || '',
      address_line1: editData?.address_line1 || '',
      address_line2: editData?.address_line2 || '',
      address_type: editData?.address_type || '',
      city: editData?.city || '',
      state: editData?.state || '',
      postal_code: editData?.postal_code || '',
      country: editData?.country || '',
      landmark: editData?.landmark || '',
    }
  });

  // Use useEffect to update form values when `editData` changes
  useEffect(() => {
    if (editData) {
      setValue('name', editData?.customer_name || '');
      setValue('address_line1', editData?.address_line1 || '');
      setValue('address_line2', editData?.address_line2 || '');
      setValue('address_type', editData?.address_type || '');
      setValue('city', editData?.city || '');
      setValue('state', editData?.state || '');
      setValue('postal_code', editData?.postal_code || '');
      setValue('country', editData?.country || '');
      setValue('landmark', editData?.landmark || '');
      setValue('contact_number', editData?.contact_number || '');
      setValue('email_address', editData?.email_address || '');
    }
  }, [editData, setValue]);

  // Return null if the modal is not open
  if (!openModal) return null;

  // Form submission handler
  const onFormSubmit = async (data: any) => {
    setLoading(true);
    const formattedData = {
      user: userId,
      customer_name: data.customer_name,
      address_line1: data.address_line1,
      address_line2: data.address_line2,
      contact_number: data.contact_number,
      email_address: data.email_address,
      address_type: data.address_type,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country,
      landmark: data.landmark,
      ...(editData
        ? { updated_by: userName || 'user' }
        : { created_by: userName || 'user' }),
      // selected_address: true,
      // is_primary: true,
    };
    if (editData) {
      try {
        const response = await updateAddressApi(`${editData?.id}`, formattedData);
        if (response) {
          queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
          handleClose();
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    } else {
      try {
        const response = await postAddressCreateApi('', formattedData);
        if (response) {
          queryClient.invalidateQueries(['postGoalType'] as InvalidateQueryFilters);
          handleClose();
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

  };

  return (
    // <div className="fixed inset-0 bg-black/80 !bg-opacity-75 flex justify-center items-center z-50">
    //   <div
    //     className="bg-white p-6 rounded-lg shadow-lg w-auto"
    //     onClick={(e) => e.stopPropagation()}
    //   >
    //     <div className="flex justify-between">
    //       <h2 className="text-xl font-semibold mb-4">Add Your Address</h2>
    //       <span onClick={() => { handleClose(), reset() }} className="cursor-pointer">
    //         <X className='cursor-pointer' />
    //       </span>
    //     </div>
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">
            {editData ? "Edit Address" : "Add Your Address"}
          </h2>
          <span onClick={() => { handleClose(), reset(); }} className="cursor-pointer">
            <X className="cursor-pointer" />
          </span>
        </div>


        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-black">Name</label>
              <Controller
                control={control}
                name="customer_name"
                render={({ field }) => (
                  <input
                    {...field}
                    id="customer_name"
                    required
                    className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="email_address" className="block text-sm font-medium text-black">Email</label>
              <Controller
                control={control}
                name="email_address"
                render={({ field }) => (
                  <input
                    {...field}
                    id="email_address"
                    required
                    className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="address_line1" className="block text-sm font-medium text-black">Address Line 1</label>
              <Controller
                control={control}
                name="address_line1"
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="address_line1"
                    required
                    className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="address_line2" className="block text-sm font-medium text-black">Address Line 2</label>
              <Controller
                control={control}
                name="address_line2"
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="address_line2"
                    required
                    className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="contact_number" className="block text-sm font-medium text-black">Contact</label>
              <Controller
                control={control}
                name="contact_number"
                render={({ field }) => (
                  <input
                    {...field}
                    id="contact_number"
                    required
                    className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            {/* </div>

          <div className="grid grid-cols-2 gap-4"> */}
            <div>
              <label htmlFor="address_type" className="block text-sm font-medium text-black">Address Type</label>
              <Controller
                control={control}
                name="address_type"
                render={({ field }) => (
                  <input
                    {...field}
                    id="address_type"
                    required
                    className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-black">City</label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <input
                    {...field}
                    id="city"
                    required
                    className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-black">State</label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <input
                    {...field}
                    id="state"
                    required
                    className="mt-1 block p-1 w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-black">Pin Code</label>
              <Controller
                control={control}
                name="postal_code"
                render={({ field }) => (
                  <input
                    {...field}
                    type='number'
                    id="postal_code"
                    maxLength={6}
                    required
                    className="mt-1 block p-1 w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            {/* </div>

          <div className="grid grid-cols-2 gap-4"> */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-black">Country</label>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <input
                    {...field}
                    id="country"
                    required
                    className="mt-1 block p-1 w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="landmark" className="block text-sm font-medium text-black">Landmark</label>
              <Controller
                control={control}
                name="landmark"
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="landmark"
                    className="mt-1 block p-1 border w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => { handleClose(), reset() }}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer px-4 py-2 bg-[#4D8B31] hover:bg-[#3e7026] text-white rounded-md text-sm font-medium  disabled:opacity-50 flex gap-2"
            >
              Save {loading ? (<Loader className="animate-spin" size={20} />) : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
