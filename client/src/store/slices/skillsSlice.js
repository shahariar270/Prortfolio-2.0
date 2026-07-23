import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, AuthError } from '../../Pages/Admin/api'

const toErrorPayload = (err) => ({ message: err.message, isAuthError: err instanceof AuthError })

// condition-gated: if skills are already cached, dispatching this is a no-op
export const fetchSkills = createAsyncThunk(
    'skills/fetchSkills',
    async (_, { rejectWithValue }) => {
        try {
            return await api.skills()
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    },
    { condition: (_, { getState }) => !getState().skills.loaded }
)

export const adjustSkillLevel = createAsyncThunk(
    'skills/adjustLevel',
    async ({ id, delta }, { rejectWithValue }) => {
        try {
            return await api.adjustSkillLevel(id, delta)
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    }
)

export const createSkill = createAsyncThunk(
    'skills/createSkill',
    async (body, { rejectWithValue }) => {
        try {
            return await api.createSkill(body)
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    }
)

const skillsSlice = createSlice({
    name: 'skills',
    initialState: { items: [], loaded: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.items = action.payload
                state.loaded = true
            })
            .addCase(adjustSkillLevel.fulfilled, (state, action) => {
                const index = state.items.findIndex((skill) => skill._id === action.payload._id)
                if (index !== -1) state.items[index] = action.payload
            })
            .addCase(createSkill.fulfilled, (state, action) => {
                state.items.push(action.payload)
            })
    },
})

export default skillsSlice.reducer
