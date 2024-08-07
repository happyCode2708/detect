'use client';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useMutateUploadFile = () => {
  return useMutation({
    mutationFn: async (formData: any) => {
      const response = await fetch('/api/upload/process-image', {
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

export const useMutateProductExtraction = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch('/api/upload/process-product-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const res = (await response.json()) as any;

      const { isSuccess } = res;

      if (!response.ok || isSuccess === false) {
        throw new Error('Network response was not ok');
      }

      return res;
    },
  });
};

export const useMutateRevalidateProductData = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch('/api/upload/revalidate-product-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

export const useMutateGetCompareResultWithTdc = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch('/api/product/get-compare-result-tdc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

export const useMutationExportCompareResult = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch('/api/product/export-compare-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

export const useQueryProductDetail = ({ productId }: { productId: string }) => {
  return useQuery({
    queryKey: ['product', 'id', `${productId}`],
    queryFn: async (payload: any) => {
      const response = await fetch(`/api/product/${productId}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
    retry: false,
  });
};
