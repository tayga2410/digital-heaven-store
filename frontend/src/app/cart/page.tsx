'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateQuantity, removeItem } from '@/store/slices/cartSlice';

export default function CartPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={`http://localhost:4000/uploads/${item.img}`} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>${item.price}</p>
                <div>
                  <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
                </div>
                <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h2>Total: ${totalAmount.toFixed(2)}</h2>
            <button>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
