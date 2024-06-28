'use client';
import { useMutation } from '@tanstack/react-query';

export const useMutateLogin = () => {
  return useMutation({
    mutationFn: async (formData: any) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json();
    },
  });
};
