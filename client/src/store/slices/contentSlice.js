import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, AuthError } from '../../Pages/Admin/api'

const toErrorPayload = (err) => ({ message: err.message, isAuthError: err instanceof AuthError })

// singleton record — condition-gated so Hero/About/Contact can each dispatch
// this on mount without tripling the network call
export const fetchContent = createAsyncThunk(
    'content/fetchContent',
    async (_, { rejectWithValue }) => {
        try {
            return await api.content()
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    },
    { condition: (_, { getState }) => !getState().content.loaded }
)

export const updateContent = createAsyncThunk(
    'content/updateContent',
    async (body, { rejectWithValue }) => {
        try {
            return await api.updateContent(body)
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    }
)

const contentSlice = createSlice({
    name: 'content',
    initialState: { data: null, loaded: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContent.fulfilled, (state, action) => {
                state.data = action.payload
                state.loaded = true
            })
            .addCase(updateContent.fulfilled, (state, action) => {
                state.data = action.payload
            })
    },
})

export default contentSlice.reducer
