import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
  products: Product[];
  bestOffers: Product[]; 
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  bestOffers: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://digital-heaven-store.onrender.com/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchBestOffers = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchBestOffers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://digital-heaven-store.onrender.com/api/best-offers");
      if (!response.ok) {
        throw new Error("Failed to fetch best offers");
      }
      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
    
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      .addCase(fetchBestOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestOffers.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.bestOffers = action.payload; 
      })
      .addCase(fetchBestOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch best offers';
      });
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productsSlice.actions;

export default productsSlice.reducer;
