'use client';
import React, { useEffect, useState } from 'react';
import ProductTable from '@/components/product/ProductTable';
import { Button } from '@/components/ui/button';
import ProductDialog from '@/components/product/AddProductDialog';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`/api/product/list?ixoneID=${searchTerm}`, {
        method: 'POST',
      });
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, [searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Array.from(selectedProducts);
    try {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      setProducts(
        products.filter((product) => !selectedProducts.has(product.id))
      );
      setSelectedProducts(new Set());
      alert('Selected products deleted successfully');
    } catch (error) {
      alert('Failed to delete selected products');
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
        <div>
          <ProductDialog isOpen={isDialogOpen} toggleDialog={toggleDialog} />
        </div>
      </div>
      <h1 className='text-2xl font-semibold mb-4'>Product List</h1>
      <ProductTable
        products={products}
        selectedProducts={selectedProducts}
        onProductSelect={handleProductSelect}
      />
    </div>
  );
};

export default HomePage;
