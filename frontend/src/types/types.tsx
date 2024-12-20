'use client';

declare global {
  interface Category {
    id: string;
    name: string; 
    displayName?: string; 
    img?: string | File; 
    parentId?: string | null; 
    parent?: Category | null; 
    children?: Category[];
    specSchema?: Array<{ key: string; type: string }>; 
    products?: Product[];
  }

  interface Product {
    id: string;
    name: string;
    price: number;
    img: string | File; 
    categoryId?: string | null; 
    category?: Category | null; 
    brandName?: string | null; 
    createdAt?: string; 
    specs?: Array<{ key: string; type: string }>;
  }

  interface WishlistItem {
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
      img: string;
    };
  }
}

export {};
