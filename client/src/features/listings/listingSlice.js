import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/listings/';
const initialState = {
    listings: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};
export const getListings = createAsyncThunk('listings/getAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const getMyListings = createAsyncThunk('listings/getMy', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(API_URL + 'my', config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const createListing = createAsyncThunk('listings/create', async (listingData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL, listingData, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const buyListing = createAsyncThunk('listings/buy', async ({ id, amount }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL + id + '/buy', { amount }, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const updateListing = createAsyncThunk('listings/update', async ({ id, listingData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(API_URL + id, listingData, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const deleteListing = createAsyncThunk('listings/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        await axios.delete(API_URL + id, config);
        return id;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const listingSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getListings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getListings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.listings = action.payload;
            })
            .addCase(getListings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMyListings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyListings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.listings = action.payload;
            })
            .addCase(getMyListings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createListing.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createListing.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.listings.push(action.payload);
            })
            .addCase(createListing.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateListing.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateListing.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.listings.findIndex((listing) => listing._id === action.payload._id);
                if (index !== -1) {
                    state.listings[index] = action.payload;
                }
            })
            .addCase(updateListing.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteListing.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteListing.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.listings = state.listings.filter((listing) => listing._id !== action.payload);
            })
            .addCase(deleteListing.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});
export const { reset } = listingSlice.actions;
export default listingSlice.reducer;
