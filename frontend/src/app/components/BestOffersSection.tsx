'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBestOffers } from '@/store/slices/productsSlice';
import ProductCard from './ProductCard';

export default function BestOffersSection() {
  const dispatch = useAppDispatch();
  const { bestOffers, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchBestOffers());
  }, [dispatch]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <section className="best-offers container">
      <h2 className='best-offers__title'>Лучшие предложения</h2>
      <div className="products__wrapper">
        {bestOffers.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            img={product.img}
            name={product.name}
            price={product.price}
            discount={product.discount}
          />
        ))}
      </div>
    </section>
  );
}
