'use client';

import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { fetchCategories, selectCategories } from '../../store/slices/categoriesSlice';
import { RootState } from '@/store/store';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Categories() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const categories = useSelector(selectCategories);
  const { loading } = useSelector((state: RootState) => state.categories);

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }
  
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.9 }
    );
  
    observer.observe(sectionRef.current);
  
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/catalog?category=${encodeURIComponent(categoryName)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
    className="categories container"
    ref={sectionRef}
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    variants={containerVariants}
  >
    <h2>Категории</h2>
    {loading ? (
      <p>Загрузка категорий...</p>
    ) : (
      <motion.ul className="categories__list" variants={containerVariants}>
        {categories.map((category) => (
          <motion.li
            key={category.id}
            className="categories__item"
            onClick={() => handleCategoryClick(category.name)}
            variants={itemVariants}
          >
            <Image
              className="categories__image"
              src={`https://digital-heaven-store.onrender.com/uploads/${category.img}`}
              alt={category.displayName || 'No image'}
              width={48}
              height={48}
            />
            <span className="categories__name">{category.displayName}</span>
          </motion.li>
        ))}
      </motion.ul>
    )}
  </motion.section>
  );



}
