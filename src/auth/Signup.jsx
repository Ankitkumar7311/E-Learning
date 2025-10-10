// Signup.jsx
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Send, ShieldCheck, RotateCw, ArrowRight, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
const API = {
  initiateSignup: `${API_BASE}/VidyaSarthi/initiateSignup`,
  resendOtp: `${API_BASE}/VidyaSarthi/resendOtp`,
  verifyOtpAndSignup: `${API_BASE}/VidyaSarthi/verifyOtpAndSignup`,
};

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState('details'); // 'details' | 'otp' | 'success'
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
      // Prepare StudentDto payload (additional fields are optional on backend)
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || null,
        branch: data.branch || null,
        year: data.year || null,
        // Send studentId instead of regulation
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

      if (!res.ok) {
        throw new Error(body?.message || 'Failed to initiate signup');
      }

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
        // Backend expects: { email, otp }
        body: JSON.stringify({ email, otp }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || 'OTP verification failed');

      setStep('success');
      setMsg('Account created successfully');
      // Optional redirect after success
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (e) {
      setServerError(e.message || 'Verification failed');
    } finally {
      setBusy(false);
    }
  };

  const resetAll = () => {
    setStep('details');
    setBusy(false);
    setMsg('');
    setServerError('');
    setEmail('');
    setOtp('');
    setResendCooldown(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <button onClick={resetAll} className="text-sm text-gray-600 hover:underline">
            Reset
          </button>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700">
            {serverError}
          </div>
        )}
        {msg && (
          <div className="mb-4 p-3 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700">
            {msg}
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={handleSubmit(onSubmitDetails)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="Student name"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } })}
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="student@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="At least 6 characters"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone (optional)</label>
              <input
                type="tel"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 9998887777"
                {...register('phone')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Branch (optional)</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="CSE / ECE / ME etc."
                {...register('branch')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Year (optional)</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="1st / 2nd / 3rd / 4th"
                {...register('year')}
              />
            </div>

            {/* Student ID - required (replaces regulation) */}
            <div>
              <label className="block text-sm font-medium mb-1">Student ID</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., S12345"
                {...register('studentId', { required: 'Student ID is required', minLength: { value: 2, message: 'Student ID is too short' } })}
              />
              {errors.studentId && <p className="text-sm text-red-600 mt-1">{errors.studentId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Semester (optional)</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 5"
                {...register('semester')}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address (optional)</label>
              <textarea
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="Address"
                {...register('address')}
              />
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                Send OTP
              </button>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Verify Email</h2>
                <p className="text-sm text-gray-600">An OTP has been sent to the registered email</p>
              </div>
              <button onClick={resetAll} className="rounded-full p-1 hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
            />

            <label className="block text-sm font-medium">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="4–6 digit code"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={handleResendOtp}
                disabled={!canResend || busy}
                className="inline-flex items-center gap-2 text-indigo-600 hover:underline disabled:opacity-50"
              >
                <RotateCw className="w-4 h-4" />
                {canResend ? 'Resend OTP' : `Resend in ${resendCooldown}s`}
              </button>

              <button
                onClick={handleVerifyOtp}
                disabled={busy}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4" />
                Verify & Create Account
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold">Signup complete</h2>
            <p className="text-gray-600">Redirecting to sign in…</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="mt-2 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Go to Login
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
