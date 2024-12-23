'use client';

import { useEffect, useState } from 'react';
import { fetchProducts } from '@/store/slices/productsSlice';
import ProductCard from './ProductCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const TABS = ["Новое поступление", "Бестселлеры", "Набирающие популярность"];

export default function ProductsSection() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const [activeTab, setActiveTab] = useState(TABS[0]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = (tab: string) => {
    if (tab === "Новое поступление") {
      return products
        .filter((product) => product.createdAt)
        .sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        )
        .slice(0, 8);
    }
  
    if (tab === "Бестселлеры") {
      return products.filter((product) => product.isBestseller).slice(0, 8);
    }
  
    if (tab === "Набирающие популярность") {
      return products.filter((product) => product.isTrending).slice(0, 8);
    }
  
    return [];
  };
  
  

  return (
    <section className="products container">
      <div className="products__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`products__tab ${tab === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="products__wrapper">
          {filteredProducts(activeTab).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              img={product.img}
              name={product.name}
              price={product.price.toFixed(0)}
              discount={product.discount}
            />
          ))}
        </div>
      )}
    </section>
  );
}
