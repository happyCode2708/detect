import { useMutation, useQuery } from '@tanstack/react-query';

export const useQueryProductsFromTdc = (
  {
    ixoneIDs,
  }: {
    ixoneIDs: string[];
  },
  options: any
) => {
  return useQuery({
    queryKey: ['product', 'tdc', `${ixoneIDs}`],
    queryFn: async () => {
      const response = await fetch('/api/product/get-product-data-tdc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ixoneIDs }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
    retry: false,
    ...options,
  });
};

export const useMutateSaveCompareResult = () => {
  return useMutation({
    mutationFn: async ({
      ixoneid,
      compareResult,
    }: {
      ixoneid: string;
      compareResult: any;
    }) => {
      const response = await fetch('/api/product/save-compare-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ixoneid, compareResult }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
  });
};
