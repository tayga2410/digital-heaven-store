'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Breadcrumbs from '@/app/components/BreadCrumbs';
import Filters from '@/app/components/Filters';
import ProductCard from '@/app/components/ProductCard';

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [finalFilteredProducts, setFinalFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      setLoadingProducts(true);
      try {
        const res = await fetch('https://digital-heaven-store.onrender.com/api/products');
        if (res.ok) {
          const data: Product[] = await res.json();
          setProducts(data);
          setFinalFilteredProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      setLoadingCategories(true);
      try {
        const res = await fetch('https://digital-heaven-store.onrender.com/api/categories');
        if (res.ok) {
          const data: Category[] = await res.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
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

  const currentCategoryData = useMemo(() => {
    return categories.find(
      (cat) =>
        cat.displayName?.toLowerCase() === currentCategory?.toLowerCase() ||
        cat.name.toLowerCase() === currentCategory?.toLowerCase()
    );
  }, [categories, currentCategory]);

  const handleCategoryClick = (category: string) => {
    router.push(`/catalog?category=${encodeURIComponent(category)}`);
  };

  if (loadingProducts || loadingCategories) return <p>Загрузка каталога...</p>;
  if (products.length === 0) return <p>Продукты не найдены.</p>;

  return (
    <section className="catalog container">
      <Breadcrumbs
        categoryName={currentCategoryData?.displayName || 'Каталог'}
      />

      <div className="catalog__categories-navigation">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className={`catalog__category-button ${
              currentCategory === category.name ? 'active' : ''
            }`}
          >
            {category.displayName || category.name}
          </button>
        ))}
      </div>

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
