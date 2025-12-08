"use client";
import { useEffect, useRef, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader, Smartphone, KeyRound } from 'lucide-react';
import axios from 'axios';
import url from '@/api-endpoints/ApiUrls';
import { getCartApi } from '@/api-endpoints/CartsApi';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import { useAuthRedirect } from '@/context/useAuthRedirect';
import { postSendSmsOtpUserApi, postVerifySmsOtpApi } from '@/api-endpoints/authendication';

type LoginType = 'EMAIL' | 'MOBILE';
type StepType = 'LOGIN' | 'OTP';

interface FormData {
  email?: string;
  password?: string;
  mobile?: string;
  otp?: string;
}

export default function LoginPage() {
  const [loginType, setLoginType] = useState<LoginType>('MOBILE');
  const [step, setStep] = useState<StepType>('LOGIN');
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { vendorId } = useVendor();
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  useAuthRedirect({ redirectIfAuthenticated: true });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const handleEmailLogin = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(url.signIn, {
        email: data.email,
        password: data.password,
        vendor_id: vendorId,
      });

      const userId = res?.data?.user_id;
      if (userId) {
        localStorage.setItem('userId', userId);
        const cartRes = await getCartApi(`user/${userId}`);
        if (cartRes) {
          localStorage.setItem('cartId', cartRes.data[0]?.id);
          router.push('/products');
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
          router.push('/products');
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

  // New state hooks added
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState(60);
  const otpRefs = useRef<HTMLInputElement[]>([]);

  // useEffect to handle resend timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'OTP' && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer, step]);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800">Sign in to your account</h2>
        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-md">
            <button
              onClick={() => {
                setLoginType('MOBILE');
                setStep('LOGIN');
                setError('');
              }}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${loginType === 'MOBILE'
                  ? 'bg-[#4d8b31] text-white shadow'
                  : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
              Mobile Login
            </button>
            <button
              onClick={() => {
                setLoginType('EMAIL');
                setStep('LOGIN');
                setError('');
              }}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${loginType === 'EMAIL'
                  ? 'bg-[#4d8b31] text-white shadow'
                  : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
              Email Login
            </button>
          </div>
        </div>

      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {loginType === 'EMAIL' && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="pl-10 block w-full border-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm my-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      type={passwordShow ? 'text' : 'password'}
                      {...register('password', { required: 'Password is required' })}
                      className="pl-10 block w-full  border-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {passwordShow ? (
                      <EyeOff className="absolute right-3 top-0.5 h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setPasswordShow(false)} />
                    ) : (
                      <Eye className="absolute right-3 top-0.5 h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setPasswordShow(true)} />
                    )}
                  </div>
                  {errors.password && <p className="text-red-500 text-sm py-1">{errors.password.message}</p>}
                </div>

                <div className="text-sm text-right">
                  <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
                </div>
              </>
            )}

            {loginType === 'MOBILE' && (
              <>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <div className="relative mt-1">
                    <Smartphone className="absolute left-3 top-1 h-5 w-5 text-gray-400" />
                    <input
                      id="mobile"
                      type="text"
                      maxLength={10}
                      {...register('mobile', {
                        required: 'Mobile number is required',
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: 'Enter a valid 10-digit number'
                        }
                      })}
                      className="pl-10 block w-full border-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {errors.mobile && <p className="text-red-500 text-sm py-1">{errors.mobile.message}</p>}
                </div>

                {step === 'OTP' && (
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3 top-1 h-5 w-5 text-gray-400" />
                      <input
                        id="otp"
                        type="text"
                        maxLength={6}
                        {...register('otp', {
                          required: 'OTP is required',
                          pattern: {
                            value: /^\d{6}$/,
                            message: 'Enter a valid 6-digit OTP'
                          }
                        })}
                        className="pl-10 block w-full border-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                onClick={() => {
                  if (resendTimer === 0) {
                    handleSendOtp({ mobile: watch('mobile') });
                    setResendTimer(60);
                    setOtpDigits(Array(6).fill(''));
                  }
                }}
                disabled={resendTimer > 0}
                className="mt-2 text-sm text-blue-600 hover:underline disabled:opacity-50"
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex gap-2 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4d8b31] hover:bg-green-700"
            >
              {loginType === 'EMAIL'
                ? 'Login'
                : step === 'LOGIN'
                  ? 'Send OTP'
                  : 'Verify OTP'} {loading && <Loader className="animate-spin" />}
            </button>

            {loginType === 'MOBILE' && step === 'OTP' && (
              <button
                type="button"
                onClick={() => {
                  setStep('LOGIN');
                  setValue('otp', '');
                }}
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                Change mobile number
              </button>
            )}

            <p className="text-sm text-center text-gray-500">
              Don’t have an account?{' '}
              <Link href="/auth/register" className="text-[#4d8b31] hover:text-green-600 font-medium">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
