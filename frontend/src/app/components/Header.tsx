'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Nav from './Nav';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setQuery, fetchSearchResults, clearResults } from '@/store/slices/searchSlice';
import { debounce } from 'lodash';

export default function Header() {
  const dispatch = useAppDispatch();
  const { query, results } = useAppSelector((state) => state.search);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleDebouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.trim()) {
        dispatch(fetchSearchResults(value));
      } else {
        dispatch(clearResults());
      }
    }, 300),
    [dispatch]
  );

  const handleSearchInput = (value: string) => {
    dispatch(setQuery(value));
    handleDebouncedSearch(value);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      dispatch(clearResults());
      setIsSearchOpen(false);
    }, 200);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.header__search-panel') && !target.closest('.header__search-icon')) {
      setIsSearchOpen(false);
      dispatch(clearResults());
    }
  };

  useEffect(() => {
    if (isSearchOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSearchOpen]);

  return (
    <header className="header">
      <div className="header__container">
        <span className="header__logo">Digital Heaven</span>
        <button
          className="header__search-icon"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          aria-label="Search"
        >
          <img src="/Search.png" alt="Search" width={30} height={30} />
        </button>

        {isSearchOpen && (
          <div className="header__search-panel">
            <div className="header__form">
              <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={(e) => handleSearchInput(e.target.value)}
                onBlur={handleSearchBlur}
                className="header__search-input"
              />
              {results.length > 0 && (
                <ul className="header__search-dropdown">
                  {results.slice(0, 5).map((product) => (
                    <li key={product.id} className="header__search-item">
                      <Link href={`/product/${product.id}`}>
                        <div className="header__search-item-content">
                          <img
                            src={`http://localhost:4000/uploads/${product.img}`}
                            alt={product.name}
                            className="header__search-item-img"
                          />
                          <span>{product.name}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        <Nav />
        <ul className="header__icons">
          <li>
            <Link href="/wishlist">
              <img src="/header/wishlist-icon.svg" alt="Wishlist" width={25} height={22} />
            </Link>
          </li>
          <li>
            <Link href="/cart">
              <img src="/header/cart-icon.svg" alt="Cart" width={25} height={22} />
            </Link>
          </li>
          <li>
            <Link href="/auth">
              <img src="/header/cabinet-icon.svg" alt="Cabinet" width={17} height={22} />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
