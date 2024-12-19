'use client';

declare global {
    interface Category {
        id: string;
        name: string;
        img?: string | File; 
        parentId?: string | null; 
        parent?: Category | null; 
        children?: Category[];
        specSchema?: Record<string, any> | null;
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
        specs?: Record<string, any> | null;
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
