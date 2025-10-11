// Login.jsx
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, ArrowRight, X, Send, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
const API = {
  login: `${API_BASE}/VidyaSarthi/loginAcc`,
  initiateForgot: `${API_BASE}/VidyaSarthi/initiateForgotPassword`,
  resendForgot: `${API_BASE}/VidyaSarthi/resendForgotOtp`,
  verifyForgotAndReset: `${API_BASE}/VidyaSarthi/verifyForgotOtpAndReset`,
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Forgot Password state
  const [fpOpen, setFpOpen] = useState(false);
  const [fpStep, setFpStep] = useState('email'); // 'email' | 'otp' | 'reset'
  const [fpEmail, setFpEmail] = useState('');
  const [fpOtp, setFpOtp] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [fpMsg, setFpMsg] = useState('');
  const [fpBusy, setFpBusy] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const canResend = useMemo(() => resendCooldown <= 0, [resendCooldown]);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      // AuthContext.login already maps email -> username for backend compatibility
      const finalAuthState = await login({ email: data.email, password: data.password });

      // Optional direct navigation if not handled elsewhere
      const role = (finalAuthState?.role || '').toString().toLowerCase();
      const user = finalAuthState?.user || {};

      if (role === 'admin') {
        navigate('/admin/dashboard', { state: { adminId: user.id || user.adminId, email: user.email } });
      } else if (role === 'teacher') {
        navigate('/teacher/dashboard', { state: { facultyId: user.facultyId, email: user.email } });
      } else if (role === 'student') {
        navigate('/student/dashboard', { state: { studentId: user.studentId, email: user.email } });
      } else {
        navigate('/', { state: { email: user.email } });
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 1 — send OTP
  const handleStartForgot = async () => {
    setFpMsg('');
    if (!fpEmail || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(fpEmail)) {
      setFpMsg('Please enter a valid email address');
      return;
    }
    setFpBusy(true);
    try {
      const res = await fetch(API.initiateForgot, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body?.message || 'Failed to send OTP');
      }
      setFpMsg('OTP sent to email');
      setFpStep('otp');
      setResendCooldown(30); // seconds
    } catch (e) {
      setFpMsg(e.message || 'Failed to send OTP');
    } finally {
      setFpBusy(false);
    }
  };

  // Forgot Password: resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setFpMsg('');
    setFpBusy(true);
    try {
      const res = await fetch(API.resendForgot, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body?.message || 'Failed to resend OTP');
      }
      setFpMsg('New OTP sent');
      setResendCooldown(30);
    } catch (e) {
      setFpMsg(e.message || 'Failed to resend OTP');
    } finally {
      setFpBusy(false);
    }
  };

  // Forgot Password: Step 2 — verify OTP & reset
  const handleVerifyAndReset = async () => {
    setFpMsg('');
    if (!fpOtp || fpOtp.trim().length < 4) {
      setFpMsg('Enter the OTP received via email');
      return;
    }
    if (!fpNewPassword || fpNewPassword.length < 6) {
      setFpMsg('Password must be at least 6 characters');
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      setFpMsg('Passwords do not match');
      return;
    }

    setFpBusy(true);
    try {
      const res = await fetch(API.verifyForgotAndReset, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fpEmail,
          otp: fpOtp,
          newPassword: fpNewPassword,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body?.message || 'Failed to reset password');
      }
      setFpMsg('Password reset successful — please sign in');
      // auto close after short delay
      setTimeout(() => {
        setFpOpen(false);
        setFpStep('email');
        setFpOtp('');
        setFpNewPassword('');
        setFpConfirmPassword('');
        setResendCooldown(0);
      }, 1200);
    } catch (e) {
      setFpMsg(e.message || 'Failed to reset password');
    } finally {
      setFpBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden">

        <div className="absolute -top-16 -left-16 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-yellow-500 text-white p-12 flex-col justify-center items-center md:items-start text-center md:text-left">
          <h1 className="font-julius text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
            Welcome to Syllabridge Dashboard.
          </h1>
          <p className="font-montserrat text-indigo-200 max-w-md">
            Enter credentials to access a personalized workspace.
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <div className="relative h-full bg-white/60 backdrop-blur-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
              <p className="text-gray-600 mt-2">Access your Account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => { setFpOpen(true); setFpStep('email'); setFpMsg(''); }}
                className="text-sm text-indigo-600 hover:underline text-right block"
              >
                Forgot password?
              </button>

              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-gradient-to-r from-blue-600 to-yellow-600 text-white py-3 rounded-lg font-semibold hover:from-yellow-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {fpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setFpOpen(false)}
              className="absolute top-3 right-3 rounded-full p-1 hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold">Reset Password</h2>
              <p className="text-sm text-gray-600">Follow the steps to reset the password</p>
            </div>

            {fpStep === 'email' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                {fpMsg && <p className="text-sm text-gray-700">{fpMsg}</p>}
                <button
                  onClick={handleStartForgot}
                  disabled={fpBusy}
                  className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" /> Send OTP
                </button>
              </div>
            )}

            {fpStep === 'otp' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                <input
                  type="text"
                  value={fpOtp}
                  onChange={(e) => setFpOtp(e.target.value)}
                  placeholder="Enter the 4–6 digit code"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleResendOtp}
                    disabled={!canResend || fpBusy}
                    className="text-sm text-indigo-600 hover:underline disabled:opacity-50"
                  >
                    {canResend ? 'Resend OTP' : `Resend in ${resendCooldown}s`}
                  </button>
                  <button
                    onClick={() => setFpStep('reset')}
                    className="text-sm text-gray-700 hover:underline"
                  >
                    Continue
                  </button>
                </div>
                {fpMsg && <p className="text-sm text-gray-700">{fpMsg}</p>}
              </div>
            )}

            {fpStep === 'reset' && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={fpNewPassword}
                    onChange={(e) => setFpNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    value={fpConfirmPassword}
                    onChange={(e) => setFpConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {fpMsg && <p className="text-sm text-gray-700">{fpMsg}</p>}
                <button
                  onClick={handleVerifyAndReset}
                  disabled={fpBusy}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" /> Reset Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
