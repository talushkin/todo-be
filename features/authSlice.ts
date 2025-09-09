import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  username: string | null;
  email: string | null;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
  username: typeof window !== 'undefined' ? localStorage.getItem('username') : null,
  email: typeof window !== 'undefined' ? localStorage.getItem('email') : null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', credentials);
      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('username', credentials.username); // Store username in localStorage
        localStorage.setItem('email', response.data.data.email); // Store email in localStorage
        return response.data.data.token;
      } else {
        // Custom error handling based on backend response
        if (response.data?.error && response.data.error.includes('password')) {
          return rejectWithValue('Username exists, but password is invalid');
        }
        return rejectWithValue(response.data?.error || 'Wrong credentials');
      }
    } catch (error: any) {
      // Custom error handling for backend error response
      if (error.response?.data?.error && error.response.data.error.includes('password')) {
        return rejectWithValue('Username exists, but password is invalid');
      }
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.username = null;
      state.email = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
        state.error = null;
        if (typeof window !== 'undefined') {
          state.username = localStorage.getItem('username');
          state.email = localStorage.getItem('email');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
