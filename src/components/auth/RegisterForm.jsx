import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setRegisterError('');
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setRegisterError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {registerError && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{registerError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Full Name
          </label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
            <input
              type="text"
              placeholder="e.g. Christopher Nolan"
              {...register('name', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className={`w-full pl-10 pr-4 py-2 bg-[#12130d] text-sm text-slate-100 placeholder-slate-500 rounded-xl border ${
                errors.name ? 'border-red-500 ring-1 ring-red-500/30' : 'border-amber-900/40'
              } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
            />
          </div>
          {errors.name && (
            <p className="text-[11px] text-amber-400 mt-1 pl-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
            <input
              type="email"
              placeholder="e.g. user@cinepass.com"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              className={`w-full pl-10 pr-4 py-2 bg-[#12130d] text-sm text-slate-100 placeholder-slate-500 rounded-xl border ${
                errors.email ? 'border-red-500 ring-1 ring-red-500/30' : 'border-amber-900/40'
              } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-amber-400 mt-1 pl-1">{errors.email.message}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Mobile Number (for SMS E-Tickets)
          </label>
          <div className="relative group">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
            <input
              type="tel"
              placeholder="+1 (555) 019-2834"
              {...register('phone', {
                required: 'Mobile phone is required for SMS ticket delivery',
                minLength: { value: 7, message: 'Please enter a valid phone number' }
              })}
              className={`w-full pl-10 pr-4 py-2 bg-[#12130d] text-sm text-slate-100 placeholder-slate-500 rounded-xl border ${
                errors.phone ? 'border-red-500 ring-1 ring-red-500/30' : 'border-amber-900/40'
              } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
            />
          </div>
          {errors.phone && (
            <p className="text-[11px] text-amber-400 mt-1 pl-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className={`w-full pl-10 pr-11 py-2 bg-[#12130d] text-sm text-slate-100 placeholder-slate-500 rounded-xl border ${
                errors.password ? 'border-red-500 ring-1 ring-red-500/30' : 'border-amber-900/40'
              } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-amber-400 mt-1 pl-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Confirm Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === passwordValue || 'Passwords do not match'
              })}
              className={`w-full pl-10 pr-11 py-2 bg-[#12130d] text-sm text-slate-100 placeholder-slate-500 rounded-xl border ${
                errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500/30' : 'border-amber-900/40'
              } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-amber-400 mt-1 pl-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 hover:text-slate-300 select-none">
            <input
              type="checkbox"
              {...register('terms', {
                required: 'Please agree to the Cinema Booking Terms of Service'
              })}
              className="mt-0.5 w-4 h-4 rounded-md bg-[#12130d] border-amber-900/60 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-950 cursor-pointer"
            />
            <span>
              I agree to the <span className="text-amber-400 hover:underline">Booking Terms</span> & <span className="text-amber-400 hover:underline">Privacy Policy</span>.
            </span>
          </label>
          {errors.terms && (
            <p className="text-[11px] text-amber-400 mt-1 pl-1">{errors.terms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Cinema Account</span>
              </>
            )}
          </button>
        </div>

        {/* Back to Login */}
        <div className="pt-2 text-center text-xs text-slate-400">
          <span>Already registered? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer"
          >
            Back to Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
