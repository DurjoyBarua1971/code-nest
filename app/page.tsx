'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useRouter } from 'next/navigation';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import createClientForBrowser from './lib/supabase/client';
import { signinWithEmailPassword, signupWithEmailPassword, signinWithGoogle } from './lib/action';

interface AuthFormInputs {
  email: string;
  password: string;
}

export default function AuthPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthFormInputs>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const router = useRouter();
  const supabase = createClientForBrowser();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router, supabase]);

  const onSubmit: SubmitHandler<AuthFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    setError(null);
    setSuccess(null);

    if (isLoginMode) {
      const result = await signinWithEmailPassword(null, formData);
      if (result.error) {
        setError(result.error);
      } else {
        console.log('Login successful:', result);
        reset();
        router.push('/dashboard');
      }
    } else {
      const result = await signupWithEmailPassword(null, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || 'Registration successful! Please check your email to verify.');
        reset();
        setTimeout(() => setIsLoginMode(true), 2000);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signinWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(null);
    setSuccess(null);
    reset();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLoginMode ? 'Login' : 'Register'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        
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
              {...register('password', {
                required: 'Password is required',
                minLength: isLoginMode ? undefined : { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <Button
            label={isLoginMode ? 'Login with Email' : 'Register'}
            type="submit"
            className="w-full p-button-primary"
          />
        </form>

        {isLoginMode && (
          <div className="mt-4">
            <Button
              label="Login with Google"
              icon="pi pi-google"
              className="w-full p-button-secondary"
              onClick={handleGoogleSignIn}
            />
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {isLoginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-500 hover:underline"
            >
              {isLoginMode ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}