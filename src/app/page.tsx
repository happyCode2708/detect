'use client';
import React, { useEffect, useState } from 'react';
import ProductTable from '@/components/product/ProductTable';
import { Button } from '@/components/ui/button';
import AddProductDialog from '@/components/product/AddProductDialog';
import DeleteProductDialog from '@/components/product/DeleteProductDialog';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const HomePage = () => {
  // const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );

  const queryClient = useQueryClient();

  const fetchProducts = async (searchTerm: string) => {
    const response = await fetch(`/api/product/list?ixoneID=${searchTerm}`, {
      method: 'POST',
    });

    if (!response.ok) {
      return Promise.reject('some thing went wrong');
    }

    const res = await response.json();

    return res;
  };
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', 'list', searchTerm],
    queryFn: async () => {
      return await fetchProducts(searchTerm);
    },
  });

  console.log('products', products);

  // useEffect(() => {

  //   fetchProducts();
  // }, [searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-4 flex justify-between align-middle'>
        <input
          type='text'
          placeholder='Search by Ixone ID'
          value={searchTerm}
          onChange={handleSearch}
          className='p-2 border border-gray-300 rounded'
        />
        <div className='flex space-x-1'>
          <DeleteProductDialog
            isOpen={isDeleteDialogOpen}
            toggleDialog={toggleDeleteProductDialog}
            handleDeleteProduct={handleDeleteSelected}
            disabled={Array.from(selectedProducts)?.length === 0}
          />
          <AddProductDialog isOpen={isDialogOpen} toggleDialog={toggleDialog} />
        </div>
      </div>
      <h1 className='text-2xl font-semibold mb-4'>Product List</h1>
      <ProductTable
        products={products || []}
        selectedProducts={selectedProducts}
        onProductSelect={handleProductSelect}
      />
    </div>
  );
};

export default HomePage;
