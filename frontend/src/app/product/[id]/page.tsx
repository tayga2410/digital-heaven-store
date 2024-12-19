'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumbs from '@/app/components/BreadCrumbs';
import { useDispatch } from 'react-redux';
import { addItemCart } from '@/store/slices/cartSlice'; // Убедитесь, что этот путь правильный

export default function ProductPage() {
  const { id } = useParams(); 
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation(); 

    if (!product) return; // Проверяем, что продукт загружен

    dispatch(
      addItemCart({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: 1,
      })
    );
  };

  useEffect(() => {
    if (!id) return; 
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          console.error('Failed to fetch product details');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-page">
      <Breadcrumbs
        categoryName={product.category?.name || 'Каталог'}
        productName={product.name}
      />

      <img
        src={`http://localhost:4000/uploads/${product.img}`}
        alt={product.name}
        style={{ width: '300px', height: '300px', objectFit: 'cover' }}
      />
      <h1>{product.name}</h1>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>Brand: {product.brandName || 'No brand specified'}</p>

      {product.specs && Object.keys(product.specs).length > 0 && (
        <div>
          <h3>Specifications:</h3>
          <ul>
            {Object.entries(product.specs).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button
        className="product__card-button"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
