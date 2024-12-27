'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeItem } from '@/store/slices/wishListSlice';
import Image from 'next/image';

const WishlistPage: React.FC = () => {
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const parsedWishlist = JSON.parse(savedWishlist);
      console.log('Loaded wishlist from localStorage:', parsedWishlist);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <div className="wishlist__page container">
      <h1>Избранное</h1>
      {wishlist.length === 0 ? (
        <p>Пока тут пусто!</p>
      ) : (
        <ul className="products__wrapper">
          {wishlist.map((item) => (
            <li key={item.id} className="product__card">
              <button
                className="product__wishlist-button"
                onClick={() => dispatch(removeItem(item.id))}
                aria-label={`Remove ${item.name} from Wishlist`}
              >
                <Image
                  src="/like-red.svg"
                  alt="Remove from Wishlist"
                  className="wishlist-icon"
                  width={30}
                  height={30}
                />
              </button>
              <Image
                src={`https://digital-heaven-store.onrender.com/uploads/${item.img}`}
                alt={item.name}
                className="product__card-image"
                width={160}
                height={160}
              />
              <h2 className="product__card-title">{item.name}</h2>
              <p className="product__card-price">${item.price}</p>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;
