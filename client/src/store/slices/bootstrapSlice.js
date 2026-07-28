import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, AuthError } from '../../Pages/Admin/api'

const toErrorPayload = (err) => ({ message: err.message, isAuthError: err instanceof AuthError })

// Powers the public site (Hero/About/Contact/Skills/Projects/Blog), which all
// mount at once on every route since Editorial always renders every section.
// Gated on both `loaded` and `status` (not just `loaded`, unlike the other
// slices) because those sections' effects all fire in the same synchronous
// render pass — condition-checking `loaded` alone would let every one of
// them slip through before the first request resolves.
export const fetchBootstrap = createAsyncThunk(
    'bootstrap/fetch',
    async (_, { rejectWithValue }) => {
        try {
            return await api.bootstrap()
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    },
    {
        condition: (_, { getState }) => {
            const state = getState().bootstrap
            return !state.loaded && state.status !== 'loading'
        },
    }
)

const bootstrapSlice = createSlice({
    name: 'bootstrap',
    initialState: {
        content: null,
        skills: [],
        projects: [],
        posts: [],
        status: 'idle',
        loaded: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBootstrap.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchBootstrap.fulfilled, (state, action) => {
                state.content = action.payload.content
                state.skills = action.payload.skills
                state.projects = action.payload.projects
                state.posts = action.payload.posts
                state.status = 'succeeded'
                state.loaded = true
            })
            .addCase(fetchBootstrap.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload?.message
            })
    },
})

export default bootstrapSlice.reducer
