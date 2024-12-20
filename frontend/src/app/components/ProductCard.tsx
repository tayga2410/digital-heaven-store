'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addItemCart } from '@/store/slices/cartSlice';
import { addItem, removeItem } from '@/store/slices/wishListSlice';
import { RootState } from '@/store/store';

const ProductCard: React.FC<Product> = ({ id, name, price, img }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const itemInWishlist = wishlist.some((item: Product) => item.id === id);
    setIsInWishlist(itemInWishlist);
  }, [wishlist, id]);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dispatch(addItemCart({ id, name, price, img, quantity: 1 }));
    alert('Товар добавлен корзину!')
  };

  const toggleWishlist = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const token = localStorage.getItem('token');

    if (isInWishlist) {
      dispatch(removeItem(id));

      if (token) {
        try {
          await fetch(`http://localhost:4000/api/wishlist/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Error removing from wishlist:', error);
        }
      }
    } else {
      dispatch(addItem({ id, name, price, img }));

      if (token) {
        try {
          await fetch(`http://localhost:4000/api/wishlist/${id}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, name, price, img }),
          });
        } catch (error) {
          console.error('Error adding to wishlist:', error);
        }
      }
    }
  };

  return (
    <div className='product__card'>
       <button
          className='product__wishlist-button'
          onClick={toggleWishlist}
          aria-label={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <img
            src={isInWishlist ? '/like-red.svg' : '/like.svg'}
            alt={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className='wishlist-icon'
          />
        </button>
      <Link href={`/product/${id}`} className='product__card-link'>
        <img
          className='product__card-image'
          src={`http://localhost:4000/uploads/${img}`}
          alt={name}
        />
        <h2 className='product__card-title'>{name}</h2>
        <p className='product__card-price'>${price}</p>
      </Link>
      <div className='product__card-actions'>
        <button className='product__card-button' onClick={handleAddToCart}>
          Добавить в корзину
        </button>
       
      </div>
    </div>
  );
};

export default ProductCard;
