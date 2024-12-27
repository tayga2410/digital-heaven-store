import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import wishlistReducer from './slices/wishListSlice';
import categoriesReducer from './slices/categoriesSlice';
import searchReducer from './slices/searchSlice';

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem( value: string) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};


const isClient = typeof window !== 'undefined';
const storage = isClient
  ? createWebStorage('local')
  : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'auth', 'wishlist'],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  products: productsReducer,
  auth: authReducer,
  users: userReducer,
  wishlist: wishlistReducer,
  categories: categoriesReducer, 
  search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
