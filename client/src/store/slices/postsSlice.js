import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, AuthError } from '../../Pages/Admin/api'

const toErrorPayload = (err) => ({ message: err.message, isAuthError: err instanceof AuthError })

// condition-gated: if posts are already cached, dispatching this is a no-op
// (no network call, no pending/fulfilled action)
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (_, { rejectWithValue }) => {
        try {
            return await api.allPosts()
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    },
    { condition: (_, { getState }) => !getState().posts.loaded }
)

export const togglePostPublish = createAsyncThunk(
    'posts/togglePublish',
    async (id, { rejectWithValue }) => {
        try {
            return await api.togglePublish(id)
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    }
)

export const savePost = createAsyncThunk(
    'posts/savePost',
    async ({ id, body }, { rejectWithValue }) => {
        try {
            return id ? await api.updatePost(id, body) : await api.createPost(body)
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState: { items: [], loaded: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.items = action.payload
                state.loaded = true
            })
            .addCase(togglePostPublish.fulfilled, (state, action) => {
                const index = state.items.findIndex((post) => post._id === action.payload._id)
                if (index !== -1) state.items[index] = action.payload
            })
            .addCase(savePost.fulfilled, (state, action) => {
                const index = state.items.findIndex((post) => post._id === action.payload._id)
                if (index !== -1) state.items[index] = action.payload
                else state.items.unshift(action.payload)
            })
    },
})

export default postsSlice.reducer
