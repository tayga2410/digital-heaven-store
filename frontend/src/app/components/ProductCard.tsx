'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/slices/cartSlice';


const ProductCard: React.FC<Product> = ({ id, name, price, img}) => {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addItem({ id, name, price, img, quantity: 1 }));
      };

    return (
        <div className='product__card'>
            <img className='product__card-image' src={`http://localhost:4000/uploads/${img}`} alt={name} />
            <h2 className='product__card-title'>{name}</h2>
            <p className='product__card-price'>${price}</p>
            <button className='product__card-button' onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
};

export default ProductCard;
