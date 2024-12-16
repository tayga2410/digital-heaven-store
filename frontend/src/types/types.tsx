'use client';

declare global {
    interface Product {
      id: string;
      name: string;
      price: number;
      img?: string | File;
      categoryId: string | null;
    }

    interface Category {
      id: string;
      name: string;
      img?: string | File; 
    }
  }
  
  export {};