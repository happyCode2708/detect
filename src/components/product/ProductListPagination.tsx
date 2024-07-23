'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
// import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export const ProductListPagination = ({ pagination }: { pagination: any }) => {
  const { currentPage, totalPages, totalProducts } = pagination || {};

  const startPage = currentPage ? Math.max(currentPage - 4, 0) : 1;
  const endPage = currentPage ? Math.min(currentPage + 4, totalPages || 1) : 1;

  const range = endPage - startPage;

  const showEllipsis = endPage != totalPages;

  const pageArray = Array.from({ length: range }, (_, i) => startPage + i + 1);

  return (
    <Pagination>
      <PaginationContent>
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationPrevious href={`/product?page=${currentPage - 1}}`} />
          </PaginationItem>
        )}

        {pageArray?.map((pageNumber: any) => {
          return (
            <Suspense key={pageNumber}>
              <PaginationNumber page={pageNumber} />;
            </Suspense>
          );
        })}

        {showEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage !== totalPages && (
          <PaginationItem>
            <PaginationNext href={`/product?page=${currentPage + 1}}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

const PaginationNumber = ({ page }: { page: number }) => {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page') || '1';
  const searchParam = searchParams.get('search');

  return (
    <Suspense>
      <PaginationItem>
        <PaginationLink
          href={`/product?search=${searchParam}&page=${page}`}
          isActive={parseInt(pageParam) === page}
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    </Suspense>
  );
};
