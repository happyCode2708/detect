'use client';
import { useMutation } from '@tanstack/react-query';

export const useMutateUploadFile = () => {
  return useMutation({
    mutationFn: async (formData: any) => {
      const response = await fetch('/api/upload/gemini', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};
