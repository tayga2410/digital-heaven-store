'use client';

import React, { useEffect } from 'react';
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
    <div className="wishlist__page container">
      <h1>Избранное</h1>
      {wishlist.length === 0 ? (
        <p>Пока тут пусто!</p>
      ) : (
        <ul className="wishlist__items">
          {wishlist.map((item) => (
            <li key={item.id} className="product__card">
              <button
                className="product__wishlist-button"
                onClick={() => dispatch(removeItem(item.id))}
                aria-label={`Remove ${item.name} from Wishlist`}
              >
                <img
                  src="/like-red.svg"
                  alt="Remove from Wishlist"
                  className="wishlist-icon"
                />
              </button>
              <img
                src={`http://localhost:4000/uploads/${item.img}`}
                alt={item.name}
                className="product__card-image"
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
