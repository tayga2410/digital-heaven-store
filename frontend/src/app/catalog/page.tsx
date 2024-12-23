'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumbs from '@/app/components/BreadCrumbs';
import Filters from '@/app/components/Filters';
import ProductCard from '@/app/components/ProductCard';

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [finalFilteredProducts, setFinalFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:4000/api/products');
        if (res.ok) {
          const data: Product[] = await res.json();
          setProducts(data);
          setFinalFilteredProducts(data);
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

  const categoryFilteredProducts = useMemo(() => {
    if (!currentCategory) return products;

    const matchedCategory = categories.find(
      (cat) =>
        cat.displayName?.toLowerCase() === currentCategory.toLowerCase() ||
        cat.name.toLowerCase() === currentCategory.toLowerCase()
    );

    if (!matchedCategory) return [];

    return products.filter(
      (product) => product.categoryId === matchedCategory.id
    );
  }, [products, categories, currentCategory]);


  const handleFilterChange = useCallback((filtered: Product[]) => {
    setFinalFilteredProducts((prev) => {
      if (
        filtered.length === prev.length &&
        filtered.every((f, i) => f.id === prev[i]?.id)
      ) {
        return prev;
      }
      return filtered;
    });
  }, []);


  const currentCategoryData = categories.find(
    (cat) => cat.name === currentCategory
  );

  if (loading) return <p>Загрузка каталога...</p>;
  if (products.length === 0) return <p>Продукты не найдены.</p>;

  return (
    <section className="catalog container">
      <Breadcrumbs categoryName={currentCategory || 'Каталог'} />

      <div className="catalog__container">
        <Filters
          products={categoryFilteredProducts}
          category={currentCategoryData}
          onFilterChange={handleFilterChange}
        />
        <div className="catalog__products">
          {finalFilteredProducts.length === 0 ? (
            <p>Товары не найдены</p>
          ) : (
            finalFilteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                img={product.img}
                discount={product.discount}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
