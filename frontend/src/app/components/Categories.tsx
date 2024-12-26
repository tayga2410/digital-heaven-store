'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'; 
import { useAppDispatch } from '@/store/hooks';
import { fetchCategories, selectCategories } from '../../store/slices/categoriesSlice';
import Image from 'next/image';

export default function Categories() {
  const dispatch = useAppDispatch();
  const router = useRouter(); 
  const categories = useSelector(selectCategories);
  const { loading, error } = useSelector((state: any) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return <p>Загрузка категорий...</p>;
  }

  if (error) {
    return <p>Ошибка загрузки категорий: {error}</p>;
  }

  if (categories.length === 0) {
    return <p>Категории отсутствуют.</p>;
  }

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/catalog?category=${encodeURIComponent(categoryName)}`); 
  };

  return (
    <section className="categories container">
      <h2>Категории</h2>
      <ul className="categories__list">
        {categories.map((category) => (
          <li
            key={category.id}
            className="categories__item"
            onClick={() => handleCategoryClick(category.name)} 
          >
            <Image
              className="categories__image"
              src={`http://localhost:4000/uploads/${category.img}`}
              alt={category.displayName}
              width={48}
              height={48}
            />
            <span className="categories__name">{category.displayName}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
