import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Send, ShieldCheck, RotateCw, ArrowRight, X, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
const API = {
  initiateSignup: `${API_BASE}/VidyaSarthi/initiateSignup`,
  resendOtp: `${API_BASE}/VidyaSarthi/resendOtp`,
  verifyOtpAndSignup: `${API_BASE}/VidyaSarthi/verifyOtpAndSignup`,
};

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState('details');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [serverError, setServerError] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const canResend = useMemo(() => resendCooldown <= 0, [resendCooldown]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      branch: '',
      year: '',
      studentId: '',
      address: '',
      semester: '',
    },
  });

  const onSubmitDetails = async (data) => {
    setServerError('');
    setMsg('');
    setBusy(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || null,
        branch: data.branch || null,
        year: data.year || null,
        studentId: data.studentId,
        address: data.address || null,
        semester: data.semester || null,
        imageData: null,
      };

      const res = await fetch(API.initiateSignup, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(body?.message || 'Failed to initiate signup');

      setEmail(data.email);
      setStep('otp');
      setMsg('OTP sent to email');
      setResendCooldown(30);
    } catch (e) {
      setServerError(e.message || 'Signup initiation failed');
    } finally {
      setBusy(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !email) return;
    setMsg('');
    setServerError('');
    setBusy(true);
    try {
      const res = await fetch(API.resendOtp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || 'Failed to resend OTP');

      setMsg('New OTP sent');
      setResendCooldown(30);
    } catch (e) {
      setServerError(e.message || 'Resend failed');
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async () => {
    setMsg('');
    setServerError('');
    if (!otp || otp.trim().length < 4) {
      setServerError('Enter the OTP received via email');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(API.verifyOtpAndSignup, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || 'OTP verification failed');

      setStep('success');
      setMsg('Account created successfully');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (e) {
      setServerError(e.message || 'Verification failed');
    } finally {
      setBusy(false);
    }
  };

  // ✅ Proper reset — clears inputs and resets UI
  const resetAll = () => {
    reset(); // clears all react-hook-form fields
    setStep('details');
    setBusy(false);
    setMsg('');
    setServerError('');
    setEmail('');
    setOtp('');
    setResendCooldown(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6 overflow-y-auto">
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/40 transition-all duration-500 hover:shadow-indigo-200">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-black tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-pink-500" />
            Create Your Account
          </h1>
          <button
            onClick={resetAll}
            className="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-all"
          >
            Reset Form
          </button>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl border border-red-300 bg-red-100 text-red-700 flex items-center gap-2 shadow-sm">
            <X className="w-5 h-5" />
            <span>{serverError}</span>
          </div>
        )}
        {msg && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-300 bg-emerald-100 text-emerald-700 flex items-center gap-2 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>{msg}</span>
          </div>
        )}

        {/* STEP 1: Details */}
        {step === 'details' && (
          <form
            onSubmit={handleSubmit(onSubmitDetails)}
            className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 animate-fadeIn"
          >
            {[
              { label: 'Full Name', name: 'name', required: true, placeholder: 'Enter your full name' },
              { label: 'Email Address', name: 'email', required: true, placeholder: 'you@example.com' },
              { label: 'Password', name: 'password', required: true, placeholder: 'At least 6 characters', type: 'password' },
              { label: 'Phone (optional)', name: 'phone', placeholder: '9998887777' },
              { label: 'Branch (optional)', name: 'branch', placeholder: 'CSE / ECE / ME' },
              { label: 'Year (optional)', name: 'year', placeholder: '1st / 2nd / 3rd / 4th' },
              { label: 'Student ID', name: 'studentId', required: true, placeholder: 'e.g., S12345' },
              { label: 'Semester (optional)', name: 'semester', placeholder: 'e.g., 5' },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-semibold mb-1 text-gray-700">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  className="w-full bg-blue-100 border-2 border-blue-400 rounded-xl px-4 py-2 text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400"
                  {...register(field.name, field.required ? { required: `${field.label} is required` } : {})}
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-600 mt-1">{errors[field.name].message}</p>
                )}
              </div>
            ))}

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Address (optional)</label>
              <textarea
                rows={3}
                placeholder="Enter your address"
                className="w-full bg-blue-100 border-2 border-blue-400 rounded-xl px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400"
                {...register('address')}
              />
            </div>

            <div className="md:col-span-3 mt-8 flex justify-center">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-10 py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform duration-300 disabled:opacity-50 shadow-lg shadow-indigo-300/50"
              >
                {busy ? <RotateCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {busy ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 'otp' && (
          <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center text-center relative">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
              <p className="text-sm text-gray-600 mt-1 max-w-sm">
                An OTP has been sent to your email. Enter it below to complete registration.
              </p>
              <button
                onClick={resetAll}
                className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full bg-gray-100 border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 4–6 digit code"
                className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <button
                onClick={handleResendOtp}
                disabled={!canResend || busy}
                className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors disabled:opacity-50"
              >
                <RotateCw className="w-4 h-4" />
                {canResend ? 'Resend OTP' : `Resend in ${resendCooldown}s`}
              </button>

              <button
                onClick={handleVerifyOtp}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 text-white px-10 py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform duration-300 disabled:opacity-50 shadow-lg shadow-emerald-300/50"
              >
                {busy ? <RotateCw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {busy ? 'Verifying...' : 'Verify & Create Account'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="text-center space-y-4 py-10 animate-fadeIn">
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce shadow-md">
              <ShieldCheck className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Success!</h2>
            <p className="text-lg text-gray-600">Your account has been created successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-10 py-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-lg shadow-indigo-300/50"
            >
              Go to Login
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
