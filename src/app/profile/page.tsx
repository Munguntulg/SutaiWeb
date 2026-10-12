'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { profileApi } from '@/lib/queries';
import { useAuthStore } from '@/store/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, Lock, LogOut } from 'lucide-react';
import Link from 'next/link';

const profileSchema = z.object({
  name: z.string().min(2, 'Нэр 2-оос дээш тэмдэгт байх ёстой'),
  email: z.string().email('Зөв и-мэйл оруулна уу'),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Хуучин нууц үг оруулна уу'),
  password: z.string().min(8, 'Шинэ нууц үг 8-аас дээш тэмдэгт байх ёстой'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Нууц үгнүүд таарахгүй',
  path: ['password_confirmation'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: user ? { name: user.name, email: user.email } : undefined,
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileForm) => {
    setProfileMsg('');
    setProfileError('');
    try {
      const res = await profileApi.updateProfile(data);
      setUser(res.data.data);
      setProfileMsg('Профайл амжилттай шинэчлэгдлээ');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setProfileError(e.response?.data?.message || 'Алдаа гарлаа');
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setPwMsg('');
    setPwError('');
    try {
      await profileApi.changePassword(data);
      setPwMsg('Нууц үг амжилттай солигдлоо');
      passwordForm.reset();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setPwError(e.response?.data?.message || 'Алдаа гарлаа');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Профайл</h1>
        <div className="flex items-center gap-3">
          <Link href="/orders">
            <Button variant="outline" size="sm">Захиалгууд</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 flex items-center gap-1.5">
            <LogOut className="w-4 h-4" /> Гарах
          </Button>
        </div>
      </div>

      {/* Profile form */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-indigo-600" /> Мэдээлэл засах
        </h2>
        {profileMsg && <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">{profileMsg}</div>}
        {profileError && <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">{profileError}</div>}
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <Input
            label="Нэр"
            id="name"
            error={profileForm.formState.errors.name?.message}
            {...profileForm.register('name')}
          />
          <Input
            label="И-мэйл"
            type="email"
            id="email"
            error={profileForm.formState.errors.email?.message}
            {...profileForm.register('email')}
          />
          <Button type="submit" loading={profileForm.formState.isSubmitting}>
            Хадгалах
          </Button>
        </form>
      </div>

      {/* Password form */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-indigo-600" /> Нууц үг солих
        </h2>
        {pwMsg && <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">{pwMsg}</div>}
        {pwError && <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">{pwError}</div>}
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Хуучин нууц үг"
            type="password"
            id="current_password"
            error={passwordForm.formState.errors.current_password?.message}
            {...passwordForm.register('current_password')}
          />
          <Input
            label="Шинэ нууц үг"
            type="password"
            id="password"
            error={passwordForm.formState.errors.password?.message}
            {...passwordForm.register('password')}
          />
          <Input
            label="Шинэ нууц үг давтах"
            type="password"
            id="password_confirmation"
            error={passwordForm.formState.errors.password_confirmation?.message}
            {...passwordForm.register('password_confirmation')}
          />
          <Button type="submit" loading={passwordForm.formState.isSubmitting}>
            Нууц үг солих
          </Button>
        </form>
      </div>
    </div>
  );
}
