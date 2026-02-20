import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import marketReducer from '../features/markets/marketSlice';
import listingReducer from '../features/listings/listingSlice';
import orderReducer from '../features/orders/orderSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        market: marketReducer,
        listing: listingReducer,
        order: orderReducer,
    },
});
