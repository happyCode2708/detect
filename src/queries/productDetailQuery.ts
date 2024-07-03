import { useMutation, useQuery } from '@tanstack/react-query';

export const useQueryProductsFromTdc = ({
  ixoneIDs,
}: {
  ixoneIDs: string[];
}) => {
  return useQuery({
    queryKey: ['product', 'tdc'],
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
  });
};
