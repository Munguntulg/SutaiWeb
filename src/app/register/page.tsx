'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/queries';
import { useAuthStore } from '@/store/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Нэр 2-оос дээш тэмдэгт байх ёстой'),
  email: z.string().email('Зөв и-мэйл оруулна уу'),
  password: z.string().min(6, 'Нууц үг 6-аас дээш тэмдэгт байх ёстой'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Нууц үгнүүд таарахгүй байна',
  path: ['password_confirmation'],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const res = await authApi.register(data);
      login(res.data.token, res.data.user);
      router.push('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const msg =
        Object.values(e.response?.data?.errors || {}).flat()[0] ||
        e.response?.data?.message ||
        'Бүртгүүлэх алдаа гарлаа';
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Бүртгүүлэх</h1>
          <p className="text-gray-500 text-sm mb-8">Шинэ бүртгэл үүсгэнэ үү</p>

          {serverError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Нэр" id="name" placeholder="Таны нэр" error={errors.name?.message} {...register('name')} />
            <Input label="И-мэйл" type="email" id="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <Input label="Нууц үг" type="password" id="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            <Input label="Нууц үг давтах" type="password" id="password_confirmation" placeholder="••••••••" error={errors.password_confirmation?.message} {...register('password_confirmation')} />
            <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
              Бүртгүүлэх
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Бүртгэл байна уу?{' '}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Нэвтрэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
