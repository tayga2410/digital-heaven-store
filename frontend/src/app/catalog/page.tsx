'use client'; 

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '@/store/slices/productsSlice'; 
import { RootState } from '@/store/store'; 
import ProductCard from '../components/ProductCard'; 

async function getProducts() {
  const res = await fetch('http://localhost:4000/api/products', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export default function CatalogPage() {
  const dispatch = useDispatch(); 
  const products = useSelector((state: RootState) => state.products.products);

  useEffect(() => {
    const fetchAndStoreProducts = async () => {
      try {
        const productsData = await getProducts(); 
        dispatch(setProducts(productsData)); 
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchAndStoreProducts();
  }, [dispatch]); 

  return (
    <section className="catalog">
      <div className="catalog__products">
        {products.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              img={product.img}
            />
          ))
        )}
      </div>
    </section>
  );
}
