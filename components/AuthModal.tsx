import React, { useState } from 'react';
import { X, Mail, Lock, Phone, User as UserIcon, Loader2, Calendar, Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onLogin: (data: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        id: '123',
        name: mode === 'login' 
          ? (loginMethod === 'email' ? 'Demo User' : 'Mobile User') 
          : `${formData.firstName} ${formData.lastName}`,
        email: formData.email || undefined,
        avatar: `https://ui-avatars.com/api/?name=${mode === 'login' ? 'User' : formData.firstName}+${mode === 'login' ? '' : formData.lastName}&background=fbbf24&color=000`
      });
      onClose();
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        id: 'google_123',
        name: 'Google User',
        avatar: 'https://ui-avatars.com/api/?name=Google+User&background=random'
      });
      onClose();
    }, 1500);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    // Reset form data optionally
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative bg-slate-900 border border-slate-700 w-full ${mode === 'register' ? 'max-w-xl' : 'max-w-md'} rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 shrink-0">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Google Button */}
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-slate-900 font-bold py-3 px-4 rounded flex items-center justify-center gap-3 transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Login Tabs */}
          {mode === 'login' && (
            <div className="flex mb-6 bg-slate-800 p-1 rounded-md">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 text-sm font-medium rounded-sm transition-all ${
                  loginMethod === 'email' 
                    ? 'bg-amber-400 text-black shadow-md' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 text-sm font-medium rounded-sm transition-all ${
                  loginMethod === 'phone' 
                    ? 'bg-amber-400 text-black shadow-md' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Phone Number
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Register: Name Fields */}
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">First Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                    <input 
                      name="firstName"
                      type="text"
                      required
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Last Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                    <input 
                      name="lastName"
                      type="text"
                      required
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Register: Extra Fields (DOB, Phone, Email) */}
            {mode === 'register' && (
               <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                    <input 
                      name="dob"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                    <input 
                      name="phone"
                      type="tel"
                      required
                      placeholder="+1234567890"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>
                </div>
               </>
            )}

            {/* Dynamic Email Input (Login: Email Tab OR Register: Email Field) */}
            {(mode === 'register' || (mode === 'login' && loginMethod === 'email')) && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                  <input 
                    name="email"
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Dynamic Phone Input (Login: Phone Tab) */}
            {mode === 'login' && loginMethod === 'phone' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                  <input 
                    name="phone"
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Register Only) */}
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                  <input 
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full bg-slate-800 border rounded p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-amber-400 focus:ring-amber-400'
                    }`}
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm font-medium animate-pulse">{error}</p>
            )}

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" /> Please wait...
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 text-center border-t border-slate-800 shrink-0">
          <p className="text-gray-400 text-sm">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleMode}
              className="text-amber-400 hover:text-amber-300 font-bold hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
