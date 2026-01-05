
const BASE_URL = 'https://dummyjson.com';

import { Product } from '../data/types';

export interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const fetchProducts = async (params?: {
  skip?: number;
  limit?: number;
  search?: string;
}): Promise<{ products: Product[]; total: number }> => {
  try {
    const { skip = 0, limit = 30, search = '' } = params || {};
    
    let url = `${BASE_URL}/products?skip=${skip}&limit=${limit}`;
    
    if (search) {
      url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&skip=${skip}&limit=${limit}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      products: data.products,
      total: data.total,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch products');
  }
};

export const fetchProductById = async (productId: number): Promise<Product> => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch product');
  }
};

export const fetchProductsByCategory = async (
  category: string,
  params?: { skip?: number; limit?: number }
): Promise<{ products: Product[]; total: number }> => {
  try {
    const { skip = 0, limit = 30 } = params || {};
    const response = await fetch(
      `${BASE_URL}/products/category/${encodeURIComponent(category)}?skip=${skip}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products by category: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      products: data.products,
      total: data.total,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch products by category');
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    const categories = await response.json();
    
    return categories;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch categories');
  }
};

export const productService = {
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
  fetchCategories,
};