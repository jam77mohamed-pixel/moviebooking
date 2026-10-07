import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ onForgotPassword, onSuccess, onSwitchToRegister }) => {
  const { login, rememberedEmail } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: rememberedEmail || '',
      password: '',
      rememberMe: !!rememberedEmail
    }
  });

  const onSubmit = async (data) => {
    setAuthError('');
    setIsLoading(true);
    try {
      await login(data.email, data.password, data.rememberMe);
      if (onSuccess) onSuccess();
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (email, pass) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    setAuthError('');
  };

  return (
    <div className="w-full">
      
      {/* Error Alert */}
      {authError && (
        <div className="mb-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Single Main Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Email Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
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
              className={`w-full pl-10 pr-4 py-2.5 bg-[#12130d] text-sm text-slate-100 placeholder-slate-500 rounded-xl border ${
                errors.email ? 'border-red-500 ring-1 ring-red-500/30' : 'border-amber-900/40'
              } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-amber-400 mt-1 pl-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your account password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={`w-full pl-10 pr-11 py-2.5 bg-[#12130d] text-sm text-slate-100 placeholder-slate-500 rounded-xl border ${
                errors.password ? 'border-red-500 ring-1 ring-red-500/30' : 'border-amber-900/40'
              } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-amber-400 mt-1 pl-1">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300 select-none">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded-md bg-[#12130d] border-amber-900/60 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-950 cursor-pointer"
            />
            <span>Remember me</span>
          </label>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transform active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Sign In & Continue Booking</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

        {/* Switch to Register link */}
        <div className="pt-3 text-center text-xs text-slate-400">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer"
          >
            Create New Account
          </button>
        </div>

      </form>

    </div>
  );
};

export default LoginForm;
