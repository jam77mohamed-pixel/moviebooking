import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, KeyRound, Mail, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { resetPassword } = useAuth();
  const [step, setStep] = useState(1); // 1: Email, 2: Verification & New Password, 3: Success
  const [targetEmail, setTargetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  if (!isOpen) return null;

  const newPasswordValue = watch('newPassword');

  const handleEmailSubmit = async (data) => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      // Simulate checking email and generating verification code
      await new Promise((res) => setTimeout(res, 500));
      setTargetEmail(data.email);
      setStep(2);
    } catch (err) {
      setErrorMsg(err.message || 'Error locating user account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (data) => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await resetPassword(targetEmail, data.newPassword);
      setStep(3);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setStep(1);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#161710] border border-amber-900/40 rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Account Recovery</h3>
              <p className="text-xs text-slate-400">Step {step} of 3</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSubmit(handleEmailSubmit)} className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Enter your registered CinePass email address. We will verify your account and allow you to configure a new secure password.
              </p>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="e.g. malik@cinema.com"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#12130d] text-sm text-slate-200 placeholder-slate-500 rounded-xl border ${
                    errors.email ? 'border-red-500' : 'border-amber-900/40'
                  } focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Verification Code & New Password */}
        {step === 2 && (
          <form onSubmit={handleSubmit(handlePasswordReset)} className="mt-5 space-y-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              Recovery code sent to <strong className="text-white">{targetEmail}</strong>. (Simulation: Enter <strong>123456</strong> or any 6 digits).
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                6-Digit Security Code
              </label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                defaultValue="123456"
                {...register('code', { required: 'Verification code is required' })}
                className="w-full text-center tracking-widest text-lg font-mono py-2 bg-[#12130d] text-slate-200 rounded-xl border border-amber-900/40 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className={`w-full px-3.5 pr-10 py-2.5 bg-[#12130d] text-sm text-slate-200 rounded-xl border ${
                    errors.newPassword ? 'border-red-500' : 'border-amber-900/40'
                  } focus:border-amber-500 focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-[11px] text-red-400 mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (value) =>
                      value === newPasswordValue || 'Passwords do not match'
                  })}
                  className={`w-full px-3.5 pr-10 py-2.5 bg-[#12130d] text-sm text-slate-200 rounded-xl border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-amber-900/40'
                  } focus:border-amber-500 focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-400 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 3 && (
          <div className="mt-5 text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Password Updated!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Your password has been successfully reset. You can now log into your CinePass account with your new credentials.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  handleClose();
                  onSwitchToLogin && onSwitchToLogin();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                Proceed to Sign In
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordModal;
