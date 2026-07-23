import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, AuthError } from '../../Pages/Admin/api'

const toErrorPayload = (err) => ({ message: err.message, isAuthError: err instanceof AuthError })

// condition-gated per range key: switching back to a previously-viewed range
// (7d/30d/90d) reuses the cached summary instead of refetching.
export const fetchAnalytics = createAsyncThunk(
    'analytics/fetchSummary',
    async (range, { rejectWithValue }) => {
        try {
            const data = await api.analyticsSummary(range)
            return { range, data }
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    },
    { condition: (range, { getState }) => !getState().analytics.byRange[range]?.loaded }
)

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: { byRange: {} },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAnalytics.fulfilled, (state, action) => {
            state.byRange[action.payload.range] = { data: action.payload.data, loaded: true }
        })
    },
})

export default analyticsSlice.reducer
