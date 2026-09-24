import api from "./axios";

export interface Product {
  id: number;
  name: string;
  sku: string;
  brand: string;
  model: string;
  price: number;
  quantity: number;
  category: string;
  specifications: string;
}

export interface ProductRequest {
  name: string;
  sku: string;
  brand: string;
  model: string;
  price: number;
  quantity: number;
  category: string;
  specifications: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/products");
  return response.data;
};

export const getProductById = async (
  id: number
): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const searchProducts = async (
  name: string
): Promise<Product[]> => {
  const response = await api.get<Product[]>("/products/search", {
    params: { name },
  });

  return response.data;
};

export const createProduct = async (
  product: ProductRequest
): Promise<Product> => {
  const response = await api.post<Product>("/products", product);
  return response.data;
};

export const updateProduct = async (
  id: number,
  product: ProductRequest
): Promise<Product> => {
  const response = await api.put<Product>(
    `/products/${id}`,
    product
  );

  return response.data;
};

export const deleteProduct = async (
  id: number
): Promise<void> => {
  await api.delete(`/products/${id}`);
};