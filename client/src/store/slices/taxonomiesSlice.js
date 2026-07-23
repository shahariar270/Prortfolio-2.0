import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, AuthError } from '../../Pages/Admin/api'

const toErrorPayload = (err) => ({ message: err.message, isAuthError: err instanceof AuthError })

// condition-gated: if taxonomies are already cached, dispatching this is a
// no-op. Fetches the full (unscoped) list once — Posts/Skills/Taxonomy pages
// all filter it client-side by kind, so one cache serves all three.
export const fetchTaxonomies = createAsyncThunk(
    'taxonomies/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await api.taxonomies()
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    },
    { condition: (_, { getState }) => !getState().taxonomies.loaded }
)

export const createTaxonomy = createAsyncThunk(
    'taxonomies/create',
    async ({ label, kind }, { rejectWithValue }) => {
        try {
            return await api.createTaxonomy(label, kind)
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    }
)

export const deleteTaxonomy = createAsyncThunk(
    'taxonomies/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.deleteTaxonomy(id)
            return id
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    }
)

const taxonomiesSlice = createSlice({
    name: 'taxonomies',
    initialState: { items: [], loaded: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaxonomies.fulfilled, (state, action) => {
                state.items = action.payload
                state.loaded = true
            })
            .addCase(createTaxonomy.fulfilled, (state, action) => {
                state.items.push(action.payload)
            })
            .addCase(deleteTaxonomy.fulfilled, (state, action) => {
                state.items = state.items.filter((tax) => tax._id !== action.payload)
            })
    },
})

export default taxonomiesSlice.reducer
