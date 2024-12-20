'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumbs from '@/app/components/BreadCrumbs';
import Filters from '@/app/components/Filters';
import ProductCard from '@/app/components/ProductCard';
import { useMemo } from 'react';


export default function CatalogPage() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category'); 
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:4000/api/products');
        if (res.ok) {
          const data: Product[] = await res.json();
          setProducts(data); 
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('http://localhost:4000/api/categories');
        if (res.ok) {
          const data: Category[] = await res.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products.length) return []; 
  
    if (currentCategory) {
      return products.filter(
        (product) => product.category?.name === currentCategory
      );
    }
  
    return products;
  }, [currentCategory, products]);

  const currentCategoryData = categories.find((cat) => cat.name === currentCategory);

  if (loading) return <p>Загрузка каталога...</p>;
  if (products.length === 0) return <p>Продукты не найдены.</p>;

  return (
    <section className="catalog">
      <Breadcrumbs categoryName={currentCategory || 'Каталог'} />
      <div className="catalog__container">
        <aside className="catalog__filters">
          <Filters
            products={filteredProducts}
            category={currentCategoryData}
            onFilterChange={(filtered) => console.log('Filtered products:', filtered)} 
          />
        </aside>
        <div className="catalog__products">
          {filteredProducts.length === 0 ? (
            <p>Товары не найдены</p>
          ) : (
            filteredProducts.map((product) => (
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
      </div>
    </section>
  );
}
