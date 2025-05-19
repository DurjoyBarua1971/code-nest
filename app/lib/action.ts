'use server';

import { redirect } from 'next/navigation';
import { createClientForServer } from './supabase/server';

type FormState = {
  success: string | null;
  error: string | null;
};

const signInWith = (provider: 'google' | 'github') => async () => {
  const supabase = await createClientForServer();

  const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  redirect(data.url);
};

const signinWithGoogle = signInWith('google');
const signinWithGithub = signInWith('github');

const signOut = async () => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
  redirect('/');
};

const signupWithEmailPassword = async (_prev: FormState | null, formData: FormData): Promise<FormState> => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) {
    console.log('error', error);
    return {
      success: null,
      error: error.message,
    };
  }

  return {
    success: 'Registration successful!',
    error: null,
  };
};

const signinWithEmailPassword = async (_prev: FormState | null, formData: FormData): Promise<FormState> => {
  const supabase = await createClientForServer();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  console.log('data', data);
  console.log('error', error);

  if (error) {
    console.log('error', error);
    return {
      success: null,
      error: error.message,
    };
  } else {
    return {
      success: 'Login successful',
      error: null,
    }
  }
};

const sendResetPasswordEmail = async (_prev: FormState | null, formData: FormData): Promise<FormState> => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.resetPasswordForEmail(
    formData.get('email') as string,
  );

  if (error) {
    console.log('error', error);
    return {
      success: '',
      error: error.message,
    };
  }

  return {
    success: 'Please check your email',
    error: '',
  };
};

const updatePassword = async (_prev: FormState | null, formData: FormData): Promise<FormState> => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  });

  if (error) {
    console.log('error', error);
    return {
      success: '',
      error: error.message,
    };
  }

  return {
    success: 'Password updated',
    error: '',
  };
};

const signinWithMagicLink = async (_prev: FormState | null, formData: FormData): Promise<FormState> => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.signInWithOtp({
    email: formData.get('email') as string,
  });

  if (error) {
    console.log('error', error);
    return {
      success: null,
      error: error.message,
    };
  }

  return {
    success: 'Please check your email',
    error: null,
  };
};

const signinWithOtp = async (_prev: FormState | null, formData: FormData): Promise<FormState> => {
  const supabase = await createClientForServer();

  const email = formData.get('email') as string;

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) {
    console.log('error', error);
    return {
      success: null,
      error: error.message,
    };
  }

  redirect(`/verify-otp?email=${email}`);
};

const verifyOtp = async (prev: { email: string }, formData: FormData): Promise<FormState> => {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.verifyOtp({
    token: formData.get('token') as string,
    email: prev.email,
    type: 'email',
  });

  if (error) {
    console.log('error', error);
    return {
      success: null,
      error: error.message,
    };
  }

  redirect('/');
};

export {
  signinWithGoogle,
  signOut,
  signupWithEmailPassword,
  signinWithGithub,
  signinWithEmailPassword,
  sendResetPasswordEmail,
  updatePassword,
  signinWithMagicLink,
  signinWithOtp,
  verifyOtp,
};