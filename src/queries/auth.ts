'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useMutateLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: any) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json();
    },
    onSuccess: () => {
      router.push('/');
    },
  });
};

export const useMutateRegisterAccount = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (formData: any) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // if (!response.ok) {
      //   throw new Error('Create account failed');
      // }

      return response.json();
    },
    onSuccess: () => {
      router.push('/');
    },
  });
};
