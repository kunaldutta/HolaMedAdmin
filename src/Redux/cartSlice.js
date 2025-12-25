import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('https://developersdumka.in/ourmarket/Medicine/getUserCartDetails.php?customer_id=16');
        console.log('Cart items fetched successfully:', response.data.status);
        if (response.data.status === 'success') {
            console.log('Cart items fetched successfully:', response.data.data);
            return response.data.data;
        } else {
            return rejectWithValue(response.data.message);
        }
    } catch (error) {
        return rejectWithValue('Failed to load cart items');
    }
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ id, amount }, { rejectWithValue, getState }) => {
    const state = getState();
    
    const updatedItem = state.cart.cartItems.find(item => item.cart_id === id);
    if (!updatedItem) return rejectWithValue('Item not found');
    
    const newQuantity = Math.max(1, parseInt(updatedItem.quantity, 10) + amount);

    try {
        const response = await axios.post('https://developersdumka.in/ourmarket/Medicine/updateCartItem.php', {
            cart_id: id,
            customer_id: '16',
            quantity: newQuantity,
        });

        if (response.data.success) {
            console.log('matchedCartItem ===cart', id);
            return { id, quantity: newQuantity };
        } else {
            return rejectWithValue(response.data.message);
        }
    } catch (error) {
        return rejectWithValue('Error updating cart');
    }
});

export const deleteItem = createAsyncThunk('cart/deleteItem', async (cart_id, { rejectWithValue }) => {
    try {
        const response = await axios.post('https://developersdumka.in/ourmarket/Medicine/deleteCartItem.php', {
            cart_id,
            customer_id: '16',
        });
        console.log('response ==delete', response.data);
        if (response.data.success) {
            return cart_id;
        } else {
            return rejectWithValue('Failed to delete item');
        }
    } catch (error) {
        return rejectWithValue(
        error.message === 'Network Error'
          ? 'No network connection. Please check your internet.'
          : error.message
      );
    }
});

// Slice
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        loading: false,
        error: null,
        updateLoading: false,
    },
    reducers: {
        clearCart(state) {
            state.cartItems = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateQuantity.pending, (state) => {
                state.updateLoading = true;
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                state.updateLoading = false;
                const item = state.cartItems.find(item => item.cart_id === action.payload.id);
                if (item) {
                    item.quantity = action.payload.quantity;
                }
            })
            .addCase(updateQuantity.rejected, (state) => {
                state.updateLoading = false;
            })
            .addCase(deleteItem.pending, (state) => {
                state.updateLoading = true;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.cartItems = state.cartItems.filter(item => item.cart_id !== action.payload);
            })
            .addCase(deleteItem.rejected, (state) => {
                state.updateLoading = false;
            });
    }
});
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
