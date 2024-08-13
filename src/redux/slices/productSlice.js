import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await fetch('https://dummyjson.com/products');
    return response.json();
  });

  const productSlice = createSlice({
    name: 'products',
    initialState: {
      items: [],
      status: null,
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchProducts.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload.products;
        })
        .addCase(fetchProducts.rejected, (state) => {
          state.status = 'failed';
        });
    },
  });
  
  export default productSlice.reducer;