import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ngoInfo } from '../../data/mock';
import { toast } from 'sonner';
import { authAPI } from '../../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.login(
        credentials.email,
        credentials.password
      );

      // ✅ Store token (matches axios interceptor)
      localStorage.setItem('admin_token', response.access_token);
      localStorage.setItem(
        'admin_user',
        JSON.stringify({
          email: credentials.email,
          role: 'admin'
        })
      );

      toast.success('Login successful');
      navigate('/admin/dashboard');

    } catch (error) {
      console.error('Admin login error:', error);

      const message =
        error?.response?.data?.detail ||
        'Invalid email or password';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-terracotta-900 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="pattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
          <rect width="100" height="100" fill="url(#pattern)" />
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-terracotta-500 to-ochre-500 rounded-2xl flex items-center justify-center shadow-2xl mb-4">
            <span className="text-white font-bold text-3xl font-heading">R</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-white">
            {ngoInfo.shortName}
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-stone-800">
                Welcome Back
              </h2>
              <p className="text-stone-500 mt-1">
                Sign in to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    placeholder="admin@rids.org"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in…' : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-terracotta-600 hover:text-terracotta-700"
              >
                ← Back to Website
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
          <p className="text-white/80 text-sm text-center">
            Login using admin credentials
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
