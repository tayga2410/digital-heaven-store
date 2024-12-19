'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeItem } from '@/store/slices/wishListSlice';

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
    <div className="wishlist-page">
      <h1>My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your Wishlist is empty.</p>
      ) : (
        <ul className="wishlist-items">
          {wishlist.map((item) => (
            <li key={item.id} className="wishlist-item">
              <img
                src={`http://localhost:4000/uploads/${item.img}`}
                alt={item.name}
                className="wishlist-item__image"
              />
              <h2 className="wishlist-item__name">{item.name}</h2>
              <p className="wishlist-item__price">${item.price.toFixed(2)}</p>
              <button
                className="wishlist-item__remove"
                onClick={() => dispatch(removeItem(item.id))}
              >
                Remove from Wishlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;
