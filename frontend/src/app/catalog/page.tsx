'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/store/slices/productsSlice';
import { RootState } from '@/store/store';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/BreadCrumbs';

export default function CatalogPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts() as any); 
  }, [dispatch]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error}</p>;

  return (
    <section className="catalog">
      <Breadcrumbs categoryName="Каталог товаров" />
      <div className="catalog__products">
        {products.length === 0 ? (
          <p>No products found</p>
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
