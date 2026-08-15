import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, AuthError } from '../../Pages/Admin/api'

const toErrorPayload = (err) => ({ message: err.message, isAuthError: err instanceof AuthError })

// Fetch published posts for public view
export const fetchPublicPosts = createAsyncThunk(
    'posts/fetchPublicPosts',
    async (_, { rejectWithValue }) => {
        try {
            return await api.posts()
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    },
    { condition: (_, { getState }) => !getState().posts.publicLoaded && getState().posts.publicStatus !== 'loading' }
)

// Fetch all posts (published & draft) for admin
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

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (id, { rejectWithValue }) => {
        try {
            await api.deletePost(id)
            return id
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        items: [],
        loaded: false,
        publicItems: [],
        publicLoaded: false,
        publicStatus: 'idle',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicPosts.pending, (state) => {
                state.publicStatus = 'loading'
            })
            .addCase(fetchPublicPosts.fulfilled, (state, action) => {
                state.publicItems = action.payload
                state.publicLoaded = true
                state.publicStatus = 'succeeded'
            })
            .addCase(fetchPublicPosts.rejected, (state) => {
                state.publicStatus = 'failed'
            })
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
            .addCase(deletePost.fulfilled, (state, action) => {
                state.items = state.items.filter((post) => post._id !== action.payload)
                state.publicItems = state.publicItems.filter((post) => post._id !== action.payload)
            })
    },
})

export default postsSlice.reducer
