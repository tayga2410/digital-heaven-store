'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addItemCart } from '@/store/slices/cartSlice';
import { addItem, removeItem } from '@/store/slices/wishListSlice';
import { RootState } from '@/store/store';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ProductCard: React.FC<Product> = ({ id, name, price, img, discount = 0 }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const itemInWishlist = wishlist.some((item: Product) => item.id === id);
    setIsInWishlist(itemInWishlist);
  }, [wishlist, id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dispatch(addItemCart({ id, name, price: discountedPrice, img, quantity: 1 }));
    alert('Товар добавлен в корзину!');
  };

  const toggleWishlist = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const token = localStorage.getItem('token');

    if (isInWishlist) {
      dispatch(removeItem(id));
      if (token) {
        try {
          await fetch(`https://digital-heaven-store.onrender.com/api/wishlist/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error('Error removing from wishlist:', error);
        }
      }
    } else {
      dispatch(addItem({ id, name, price: discountedPrice, img }));
      if (token) {
        try {
          await fetch(`https://digital-heaven-store.onrender.com/api/wishlist/${id}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, name, price: discountedPrice, img }),
          });
        } catch (error) {
          console.error('Error adding to wishlist:', error);
        }
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5 },
    },
    hover: { scale: 1.05 },
  };

  return (
    <motion.div
      className="product__card"
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover="hover"
    >
      <div className='product__features'>
        {discount > 0 && (
          <span className="product__card-badge">-{discount}%</span>
        )}
        <button
          className="product__wishlist-button"
          onClick={toggleWishlist}
          aria-label={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Image
            src={isInWishlist ? '/like-red.svg' : '/like.svg'}
            alt={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className="wishlist-icon"
            width={30}
            height={30}
          />
        </button>
      </div>
      <Link href={`/product/${id}`} className="product__card-link">
        <Image
          className="product__card-image"
          src={`https://digital-heaven-store.onrender.com/uploads/${img}`}
          alt={name}
          width={160}
          height={160}
        />
        <h2 className="product__card-title">{name}</h2>
        {discount ? (
          <p className="product__card-price">
            <span className="product__card-original-price">${price}</span>
            <span className="product__card-discounted-price">${discountedPrice.toFixed(0)}</span>
          </p>
        ) : (
          <p className="product__card-price">${price}</p>
        )}
      </Link>
      <div className="product__card-actions">
        <button className="product__card-button" onClick={handleAddToCart}>
          Добавить в корзину
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
