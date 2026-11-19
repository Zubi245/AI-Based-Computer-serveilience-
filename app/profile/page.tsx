'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Clock, Save, Edit, Lock, ChevronRight } from 'lucide-react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/router';
import LoadingButton from '@/components/LoadingButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const user = authService.getCurrentUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedUser = { ...user, name: data.name, email: data.email };
      localStorage.setItem('texvision_user_data', JSON.stringify(updatedUser));
      // eslint-disable-next-line no-alert
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setPasswordLoading(true);
    setPasswordSuccess(false);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordSuccess(true);
    } catch (error) {
      console.error('Password change error:', error);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Profile</h1>
          <p className="text-gray-400">Manage your account settings</p>
        </div>
        <LoadingButton onClick={() => router.push('/dashboard')}>
          <User className="w-4 h-4 mr-2" />
          Back to Dashboard
        </LoadingButton>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-2xl p-8 shadow-card"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 bg-info/20 rounded-full flex items-center justify-center mb-4 shadow-glow-red">
            <User className="w-12 h-12 text-info" />
          </div>
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
            user.role === 'administrator' ? 'bg-danger/20 text-danger border border-danger/30' :
            user.role === 'supervisor' ? 'bg-warning/20 text-warning border border-warning/30' :
            'bg-info/20 text-info border border-info/30'
          }`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus-ring-info/20"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-xs text-danger mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus-ring-info/20"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-danger mt-1">{errors.email.message}</p>
            )}
          </div>

          <LoadingButton type="submit" loading={loading} className="w-full mt-8">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </LoadingButton>
        </form>

        <div className="mt-8 border-t border-navy-700/50 pt-8">
          <h3 className="text-lg font-bold text-white mb-6">Change Password</h3>
          <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <input
                {...registerPassword('currentPassword')}
                type="password"
                className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus-ring-info/20"
                placeholder="Enter current password"
              />
              {passwordErrors.currentPassword && (
                <p className="text-xs text-danger mt-1">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                {...registerPassword('newPassword')}
                type="password"
                className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus-ring-info/20"
                placeholder="Enter new password"
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-danger mt-1">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                {...registerPassword('confirmPassword')}
                type="password"
                className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus-ring-info/20"
                placeholder="Confirm new password"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-danger mt-1">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <LoadingButton
              type="submit"
              loading={passwordLoading}
              className="w-full mt-4"
            >
              <Lock className="w-4 h-4 mr-2" />
              {passwordSuccess ? 'Password Changed!' : 'Change Password'}
            </LoadingButton>

            {passwordSuccess && (
              <p className="text-xs text-success mt-2 text-center">
                Password changed successfully
              </p>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
