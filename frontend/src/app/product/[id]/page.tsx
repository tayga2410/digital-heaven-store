'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumbs from '@/app/components/BreadCrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { addItemCart } from '@/store/slices/cartSlice';
import { addItem, removeItem } from '@/store/slices/wishListSlice';
import { RootState } from '@/store/store';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlist.some((item) => item.id === id);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    alert('Предмет добавлен в корзину')

    if (!product) return;

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

  const handleToggleWishlist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    if (!product) return;

    if (isInWishlist) {
      dispatch(removeItem(product.id));
    } else {
      dispatch(
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
        })
      );
    }
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

  if (loading) return <p>Загрузка продуктов</p>;
  if (!product) return <p>Продукт не найден</p>;

  return (
    <div className="product-page">
      <Breadcrumbs
        categoryName={product.category?.name || 'Каталог'}
        productName={product.name}
      />
      <div className="product-page__container">
        <img
          src={`http://localhost:4000/uploads/${product.img}`}
          alt={product.name}
          className="product-page__image"
        />
        <div className="product-page__info">
          <h1>{product.name}</h1>
          <p>Цена: ${product.price}</p>

          {product.specs && product.specs.length > 0 && (
            <div>
              <h3>Подробнее о товаре</h3>
              <ul className="product-page__list">
                {product.specs.map((spec: { key: string; type: string }, index: number) => (
                  <li className="product-page__item" key={index}>
                    <span className="product-page__specs">{spec.key}</span> {spec.type || 'Не указано'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="product-page__actions">
            <button
              className="product__card-button product__card-button--wishlist"
              onClick={handleToggleWishlist}
            >
              {isInWishlist ? 'Удалить из избранного' : 'Добавить в избранное'}
            </button>
            <button className="product__card-button" onClick={handleAddToCart}>
              Добавить в корзину
            </button>
          </div>
          <ul className='product-page__icons'>
            <li className='product-page__icon'>
              <img src="/delivery.png" alt="" />
              <div className='product-page__icons-text-wrapper'>
                <p className='product-page__text'>Доставка</p>
                <span className='product-page__icons-subtext'>1 - 2 дня</span>
              </div>
            </li>
            <li className='product-page__icon'>
              <img src="/guaranteed.png" alt="" />
              <div className='product-page__icons-text-wrapper'>
                <p className='product-page__text'>В наличии</p>
                <span className='product-page__icons-subtext'>Да</span>
              </div>

            </li>
            <li className='product-page__icon'>
              <img src="/stock.png" alt="" />
              <div className='product-page__icons-text-wrapper'>
                <p className='product-page__text'>Гарантия</p>
                <span className='product-page__icons-subtext'>1 год</span>
              </div>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
}
