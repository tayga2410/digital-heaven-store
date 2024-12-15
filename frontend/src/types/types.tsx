'use client';

declare global {
    interface Product {
      id: string;
      name: string;
      price: number;
      img: string;
      category?: string;
    }
  }
  
  export {};