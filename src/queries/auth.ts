'use client';
import { useMutation } from '@tanstack/react-query';

export const useMutateLogin = () => {
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
  });
};

export const useMutateRegisterAccount = () => {
  return useMutation({
    mutationFn: async (formData: any) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Create account failed');
      }

      return response.json();
    },
  });
};
