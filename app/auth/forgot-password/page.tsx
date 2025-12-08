"use client";
import { getCheckEmailApi, postSendOtpAPi, postSendOtpVerifyAPi, updateUserAPi } from '@/api-endpoints/authendication';
import { useVendor } from '@/context/VendorContext';
import { Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [timer, setTimer] = useState(60);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const inputsRef = useRef<HTMLInputElement[]>([]);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
       const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [emailLoader, setEmailLoader] = useState(false);
    const [otpErrorMessage, setOtpErrorMessage] = useState('');
    const [optLoader, setOtpLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordLoader, setPasswordLoader] = useState(false);
      const { vendorId } = useVendor();

      // useEffect(() => {
      //   const storedId = localStorage.getItem('forgetuserId');
      //   setUserId(storedId);
      // }, []);
    useEffect(() => {
      if (showModal && timer > 0) {
        const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(countdown);
      }
    }, [showModal, timer]);
  
    const handleEmailSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage('');
      setEmailLoader(true)
      try {
        const updateApi = await getCheckEmailApi(`?email=${email}&vendor_id=${vendorId}`);
  
        if (updateApi?.data?.id) {
          const sendOtp = await postSendOtpAPi({ email: updateApi?.data?.email,vendor_id:vendorId });
  
          if (sendOtp) {
            setEmailLoader(false);
            setToken(sendOtp?.data?.token);
            setShowModal(true);
            setTimer(60);
            setOtp(Array(6).fill(''));
            setTimeout(() => inputsRef.current[0]?.focus(), 100);
          }
        } else {
          setErrorMessage("You're not a user, please create an account.");
          setEmailLoader(false);
        }
      } catch (error) {
        setErrorMessage("You're not a user, please create an account.");
        setEmailLoader(false);
      }
    };
  
  
    const handleOtpChange = (val: string, idx: number) => {
      if (!/^\d*$/.test(val)) return;
      const newOtp = [...otp];
      newOtp[idx] = val;
      setOtp(newOtp);
      if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
    };
  
    const handleBackspace = (e: React.KeyboardEvent, idx: number) => {
      if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
    };
  
    const handleOtpSubmit = async () => {
      setOtpLoader(true);
      setOtpErrorMessage('');
      const finalOtp = otp.join('');
      if (finalOtp.length === 6) {
        try {
          const updateApi = await postSendOtpVerifyAPi({
            token,
            otp: finalOtp,
            vendor_id: vendorId,
            login_type: 'user',
          });
  
          if (updateApi?.data?.user_id) {
            if (typeof window !== 'undefined') {
              setUserId(updateApi?.data?.user_id);
            localStorage.setItem('forgetuserId', updateApi?.data?.user_id);
            setOtpLoader(false);
            setShowModal(false);
            setShowPasswordReset(true);
            }
          }
        } catch (error: any) {
          const errMsg =
            error?.response?.data?.error || 'Failed to verify OTP. Please try again.';
          setOtpErrorMessage(errMsg);
          setOtpLoader(false);
        }
      } else {
        setOtpLoader(false);
        setOtpErrorMessage('Please enter a valid 6-digit OTP.');
      }
    };
  
    const handlePasswordReset = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
  
      setPasswordLoader(true);
      try {
        const updateApi = await updateUserAPi(`/${userId}`, {
          password: newPassword,
          updated_by: "user",
          role: 3,
          vendor: vendorId,
        });
  
        if (updateApi) {
        router.push('/auth/login');
          setShowPasswordReset(false);
          setEmail('');
          setNewPassword('');
          setConfirmPassword('');
        }
      } catch (error) {
        console.error('Password reset failed:', error);
        // Optional: Show error toast or alert
      } finally {
        setPasswordLoader(false);
      }
    };
  
  
  
    const sendOtpToEmail = async () => {
      setErrorMessage('');
      try {
        const updateApi = await getCheckEmailApi(`?email=${email}&vendor_id=${vendorId}`);
        if (updateApi?.data?.id) {
          const sendOtp = await postSendOtpAPi({ email: updateApi?.data?.email ,vendor_id:vendorId});
          if (sendOtp) {
            setToken(sendOtp?.data?.token);
            setShowModal(true);
            setTimer(60);
            setOtp(Array(6).fill(''));
            setTimeout(() => inputsRef.current[0]?.focus(), 100);
          }
        } else {
          setErrorMessage("You're not a registered user. Please create an account.");
        }
      } catch (error: any) {
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 p-2">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div>
      {!showPasswordReset && (
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                disabled={emailLoader}
                className={`pl-10 block w-full rounded-md border ${errorMessage ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 ${emailLoader ? 'cursor-not-allowed bg-gray-100' : ''
                  }`}
              />

            </div>
          </div>
          {errorMessage && (
            <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full gap-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4d8b31] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={emailLoader}
          >
            Send OTP {emailLoader ? (<Loader2 className='animate-spin' />) : ''}
          </button>
        </form>
      )}

      {/* OTP Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
            <h2 className="text-lg font-bold text-center mb-2">Enter OTP</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              We sent a 6-digit OTP to <strong>{email}</strong>
            </p>

            <div className="flex justify-center gap-2 mb-4">
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={val}
                  ref={(el) => {
                    if (el) inputsRef.current[idx] = el;
                  }}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleBackspace(e, idx)}
                  className="w-10 h-12 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <div className="text-center text-sm text-gray-500 mb-4 cursor-pointer">
              {timer === 0 ? (
                <>
                  <span className="cursor-pointer text-green-400 font-bold" onClick={sendOtpToEmail}>Resend</span>
                </>
              ) : (
                <>
                  Resend: <span className="font-semibold cursor-pointer" 
                  // onClick={handleEmailSubmit}
                  >{timer} s</span>
                </>
              )}
            </div>
            {otpErrorMessage && (
              <p className="text-sm text-red-600 text-center mb-4">{otpErrorMessage}</p>
            )}

            <div className="flex justify-between">
              <button
                onClick={handleOtpSubmit}
                className="w-full cursor-pointer  bg-[#4d8b31] text-white py-2 rounded hover:bg-green-700"
                disabled={optLoader}
              >
                <div className='flex gap-2 justify-center'>
                  Verify OTP   {optLoader ? (<Loader2 className='animate-spin' />) : ''}
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Password Reset Form */}
      {showPasswordReset && (
        <form onSubmit={handlePasswordReset} className="space-y-5 mt-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-8 right-3 text-gray-500 cursor-pointer"
            >
              {showPassword ? <EyeOff className='' /> : <Eye />}
            </span>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${confirmPassword?.length && newPassword !== confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-8 right-3 text-gray-500 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </span>

          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-sm text-red-600 text-center mb-4">Passwords do not match. Please enter matching passwords.</p>

          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:cursor-not-allowed"
            disabled={passwordLoader}
          >
            <div className="flex gap-2 justify-center items-center">
              Reset Password {passwordLoader && <Loader2 className="animate-spin" />}
            </div>
          </button>

        </form>
      )}
    </div>
        </div>
      </div>
    </div>
  );
}