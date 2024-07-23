'use client';
import React, { Suspense, useEffect, useState } from 'react';
import ProductTable from '@/components/product/ProductTable';
import { Button } from '@/components/ui/button';
import AddProductDialog from '@/components/product/AddProductDialog';
import DeleteProductDialog from '@/components/product/DeleteProductDialog';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutationExportCompareResult } from '@/queries/home';
import { FluidContainer } from '@/components/container/FluidContainer';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SkeletonSection } from '@/components/loading/SkeletonLoading';

const ProductListPage = () => {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search') as string;
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );

  const queryClient = useQueryClient();
  const mutateExportCompareResult = useMutationExportCompareResult();

  useEffect(() => {
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParam]);

  useEffect(() => {
    if (pageParam === null && searchParam === null) {
      router.push('/product?search=&page=1');
    }
  }, [pageParam, searchParam]);

  const fetchProducts = async (searchParam: string) => {
    const response = await fetch(
      `/api/product/list?search=${searchParam}&page=${pageParam}`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      return Promise.reject('some thing went wrong');
    }

    const res = await response.json();

    return res;
  };

  const {
    data: productData,
    isLoading: loadingProductList,
    isError,
  } = useQuery({
    queryKey: ['product', 'list', searchParam],
    queryFn: async () => {
      return await fetchProducts(searchParam);
    },
  });

  const products = productData?.data;
  const pagination = productData?.pagination;

  const handleSearch = () => {
    router.push(`/product?search=${searchTerm}&page=1`);
  };

  const onChangeSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  const toggleDeleteProductDialog = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Array.from(selectedProducts);
    try {
      const res = await fetch('/api/product/delete-products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (!res.ok) {
        toast({
          title: 'Something went wrong',
          description: 'Fail to delete product',
          variant: 'destructive',
          duration: 2000,
        });

        return;
      }

      queryClient.invalidateQueries({ queryKey: ['product', 'list'] });

      toast({
        title: 'Successfully',
        description: 'Deleted Products',
        variant: 'success',
        duration: 2000,
      });

      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Fail to delete product',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  const handleExportCompareResult = () => {
    const payload = {};

    mutateExportCompareResult.mutate(payload, {
      onError: (e) => {
        console.log('e', e);
      },
      onSuccess: (res) => {
        const { message } = res;
        toast({
          title: 'Info',
          description: message,
          variant: 'success',
          duration: 2000,
        });
      },
    });
  };

  const handleProductSelect = (id: string) => {
    setSelectedProducts((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  if (loadingProductList) return;

  return (
    <Suspense>
      <FluidContainer>
        <div className='py-4'>
          {loadingProductList ? (
            <SkeletonSection />
          ) : (
            <>
              <div className='mb-4 flex justify-between align-middle'>
                <Input
                  type='text'
                  placeholder='Search by Ixone ID'
                  value={searchTerm}
                  onChange={onChangeSearchTerm}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className='max-w-[400px]'
                />

                <div className='flex space-x-1'>
                  {process.env.NODE_ENV !== 'production' && (
                    <Button
                      variant='secondary'
                      onClick={handleExportCompareResult}
                    >
                      Export compare result
                    </Button>
                  )}
                  <DeleteProductDialog
                    isOpen={isDeleteDialogOpen}
                    toggleDialog={toggleDeleteProductDialog}
                    handleDeleteProduct={handleDeleteSelected}
                    disabled={Array.from(selectedProducts)?.length === 0}
                  />
                  <AddProductDialog
                    isOpen={isDialogOpen}
                    toggleDialog={toggleDialog}
                  />
                </div>
              </div>
              <h1 className='text-2xl font-semibold mb-4'>Product List</h1>
              <ProductTable
                products={products || []}
                selectedProducts={selectedProducts}
                onProductSelect={handleProductSelect}
                pagination={pagination}
              />
            </>
          )}
        </div>
      </FluidContainer>
    </Suspense>
  );
};

export default ProductListPage;
