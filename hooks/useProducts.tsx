import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productService } from '../utils/api';

export const useProducts = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ['products', search],
    queryFn: ({ pageParam = 0 }) => 
      productService.fetchProducts({ 
        skip: pageParam, 
        limit: 20, 
        search 
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.products.length, 0);
      if (totalLoaded < lastPage.total) {
        return totalLoaded;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.fetchProductById(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.fetchCategories(),
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => productService.fetchProductsByCategory(category),
    enabled: !!category,
  });
};