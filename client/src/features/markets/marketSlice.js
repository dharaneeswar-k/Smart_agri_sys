import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/markets/';
const PRICE_URL = 'http://localhost:5000/api/prices/';
const initialState = {
    markets: [],
    prices: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};
export const getMarkets = createAsyncThunk('markets/getAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const getPrices = createAsyncThunk('prices/getAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get(PRICE_URL);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMarkets.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMarkets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.markets = action.payload;
            })
            .addCase(getMarkets.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getPrices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPrices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.prices = action.payload;
            })
            .addCase(getPrices.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});
export const { reset } = marketSlice.actions;
export default marketSlice.reducer;
