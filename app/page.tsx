'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { useRouter } from 'next/navigation';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { supabase } from './lib/supabase';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <InputText
              id="email"
              type="email"
              className="w-full mt-1"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <InputText
              id="password"
              type="password"
              className="w-full mt-1"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <Button label="Login with Email" type="submit" className="w-full p-button-primary" />
        </form>

        <div className="mt-4">
          <Button
            label="Login with Google"
            icon="pi pi-google"
            className="w-full p-button-secondary"
            onClick={signInWithGoogle}
          />
        </div>
      </div>
    </div>
  );
}