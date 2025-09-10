export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task: Task, { rejectWithValue, getState }: any) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      const response = await axios.put('http://localhost:8080/todos', task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update task');
    }
  }
);
// tasksSlice: Redux slice for managing tasks state and async actions.
// Handles fetching, updating, and deleting tasks with API integration.
// 2025-09-08
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Task } from '../components/TaskLine';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue, getState }: any) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      const response = await axios.get('http://localhost:8080/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: number, { rejectWithValue, getState }: any) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      await axios.delete(`http://localhost:8080/todo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks = state.tasks.map(t => t.id === action.payload.id ? action.payload : t);
      });
  },
});

export default tasksSlice.reducer;
