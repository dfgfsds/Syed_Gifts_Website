'use client';
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail, X, Smartphone, KeyRound, Loader } from "lucide-react";
import Link from "next/link";
import { getCartApi } from "@/api-endpoints/CartsApi";
import { postSendSmsOtpUserApi, postVerifySmsOtpApi } from "@/api-endpoints/authendication";

interface FormData {
  email?: string;
  password?: string;
  mobile?: string;
  otp?: string;
}

type LoginType = 'EMAIL' | 'MOBILE';
type StepType = 'LOGIN' | 'OTP';

export default function LoginModal({ open, handleClose, vendorId }: any) {
  if (!open) return null;

  const [loginType, setLoginType] = useState<LoginType>('MOBILE');
  const [step, setStep] = useState<StepType>('LOGIN');
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();

  // Resend OTP countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'OTP' && resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer, step]);

  const handleEmailLogin = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const res: any = await axios.post("https://ecomapi.ftdigitalsolutions.org/user_login/", {
        email: data.email,
        password: data.password,
        vendor_id: vendorId
      });
      const userId = res?.data?.user_id;
      if (userId) {
        localStorage.setItem('userId', userId);
        const cartRes = await getCartApi(`user/${userId}`);
        if (cartRes) {
          localStorage.setItem('cartId', cartRes.data[0]?.id);
          handleClose();
          window.location.reload();
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Email login failed');
    }
    setLoading(false);
  };

  const handleSendOtp = async (data: FormData) => {
    setValue("otp", "");
    setLoading(true);
    setError('');
    try {
      const res = await postSendSmsOtpUserApi({
        contact_number: data.mobile,
        vendor_id: vendorId,
      });
      if (res?.data?.token) {
        setStep('OTP');
        setToken(res.data.token);
      } else {
        setError('Failed to send OTP');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const res = await postVerifySmsOtpApi({
        otp: data.otp,
        token: token,
        login_type: "user",
        vendor_id: vendorId,
      });
      const userId = res?.data?.user_id;
      if (userId) {
        localStorage.setItem('userId', userId);
        const cartRes = await getCartApi(`user/${userId}`);
        if (cartRes) {
          localStorage.setItem('cartId', cartRes.data[0]?.id);
          handleClose();
          window.location.reload();
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'OTP verification failed');
    }
    setLoading(false);
  };

  const onSubmit = (data: FormData) => {
    if (loginType === 'EMAIL') {
      handleEmailLogin(data);
    } else if (loginType === 'MOBILE') {
      if (step === 'LOGIN') {
        handleSendOtp(data);
      } else {
        handleVerifyOtp(data);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 !bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sign in to your account</h2>
          <X onClick={handleClose} className="cursor-pointer" />
        </div>

        {/* Switch between Email / Mobile */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-md">
            <button
              onClick={() => { setLoginType('MOBILE'); setStep('LOGIN'); setError(''); }}
              className={`px-4 py-1 rounded-full ${loginType === 'MOBILE' ? 'bg-[#4d8b31] text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Mobile Login
            </button>
            <button
              onClick={() => { setLoginType('EMAIL'); setStep('LOGIN'); setError(''); }}
              className={`px-4 py-1 rounded-full ${loginType === 'EMAIL' ? 'bg-[#4d8b31] text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Email Login
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {loginType === 'EMAIL' && (
            <>
              <div>
                <label>Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div>
                <label>Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={passwordShow ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required' })}
                    className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {passwordShow ? (
                    <EyeOff onClick={() => setPasswordShow(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" />
                  ) : (
                    <Eye onClick={() => setPasswordShow(true)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" />
                  )}
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-[#4d8b31] hover:text-green-500 text-sm">Forgot password?</Link>
              </div>
            </>
          )}

          {loginType === 'MOBILE' && (
            <>
              <div>
                <label>Mobile Number</label>
                <div className="relative mt-1">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    maxLength={10}
                    {...register('mobile', {
                      required: 'Mobile number is required',
                      pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' }
                    })}
                    className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
              </div>

              {step === 'OTP' && (
                <div>
                  <label>Enter OTP</label>
                  <div className="relative mt-1">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      maxLength={6}
                      {...register('otp', {
                        required: 'OTP is required',
                        pattern: { value: /^\d{6}$/, message: 'Enter valid 6-digit OTP' }
                      })}
                      className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
                </div>
              )}
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {step === 'OTP' && (
            <button
              type="button"
              disabled={resendTimer > 0}
              onClick={() => {
                if (resendTimer === 0) {
                  handleSendOtp({ mobile: watch('mobile') });
                  setResendTimer(60);
                }
              }}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center gap-2 py-2 px-4 rounded-md text-white bg-[#4d8b31] hover:bg-green-700"
          >
            {loginType === 'EMAIL'
              ? 'Login'
              : step === 'LOGIN'
                ? 'Send OTP'
                : 'Verify OTP'} {loading && <Loader className="animate-spin h-4 w-4" />}
          </button>

          {loginType === 'MOBILE' && step === 'OTP' && (
            <button
              type="button"
              onClick={() => { setStep('LOGIN'); setValue('otp', ''); }}
              className="text-sm text-blue-600 hover:underline"
            >
              Change mobile number
            </button>
          )}

          <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-medium text-[#4d8b31] hover:text-green-500">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
