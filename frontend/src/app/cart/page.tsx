'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateQuantity, removeItem } from '@/store/slices/cartSlice';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart container">
      {cartItems.length === 0 ? (
        <p>Ваша корзина пуста</p>
      ) : (
        <div className='cart__container'>
          <div className='cart__wrapper'>
            <h1 className='cart__title'>Корзина</h1>
            <div className='cart__item-container'>
              {cartItems.map((item) => (
                <div key={item.id} className="cart__item">
                  <Image className='cart__item-image' src={`https://digital-heaven-store.onrender.com/uploads/${item.img}`} alt={item.name} width={160} height={160} />
                  <div className='cart__item-description'>
                    <h3 className='cart__item-title'>{item.name}</h3>
                    <div className='cart__item-count'>
                      <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>-</button>
                      <span className='cart__item-quantity'>{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
                    </div>
                    <p className='cart__item-price'>${item.price}</p>
                    <button onClick={() => dispatch(removeItem(item.id))}>
                    <img src="/remove-button.svg" alt="" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart__summary">
            <h2>Информация по оплате</h2>
            <form className='cart__form' action="">
              <label className='cart__label'>Промокод / Скидка
                <input className='cart__input' type="text" placeholder='Введите код' />
              </label>
            </form>
            <span className='cart__total-amount'>Общая сумма: ${totalAmount.toFixed(0)}</span>
            <Link href="/payments" passHref>
      <button className='cart__checkout-button'>К оплате</button>
    </Link>
          </div>
        </div>
      )}
    </div>
  );
}
