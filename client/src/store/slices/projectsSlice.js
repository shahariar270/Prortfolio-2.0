import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, AuthError } from '../../Pages/Admin/api'

const toErrorPayload = (err) => ({ message: err.message, isAuthError: err instanceof AuthError })

// condition-gated: if projects are already cached, dispatching this is a no-op
export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            return await api.projects()
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    },
    { condition: (_, { getState }) => !getState().projects.loaded && getState().projects.status !== 'loading' }
)

export const saveProject = createAsyncThunk(
    'projects/saveProject',
    async ({ id, body }, { rejectWithValue }) => {
        try {
            return id ? await api.updateProject(id, body) : await api.createProject(body)
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    }
)

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (id, { rejectWithValue }) => {
        try {
            await api.deleteProject(id)
            return id
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    }
)

const projectsSlice = createSlice({
    name: 'projects',
    initialState: { items: [], loaded: false, status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.items = action.payload
                state.loaded = true
                state.status = 'succeeded'
            })
            .addCase(fetchProjects.rejected, (state) => {
                state.status = 'failed'
            })
            .addCase(saveProject.fulfilled, (state, action) => {
                const index = state.items.findIndex((project) => project._id === action.payload._id)
                if (index !== -1) state.items[index] = action.payload
                else state.items.push(action.payload)
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.items = state.items.filter((project) => project._id !== action.payload)
            })
    },
})

export default projectsSlice.reducer
