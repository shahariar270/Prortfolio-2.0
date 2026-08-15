import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, AuthError } from '../../Pages/Admin/api'

const toErrorPayload = (err) => ({ message: err.message, isAuthError: err instanceof AuthError })

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

export const fetchHeroContent = createAsyncThunk(
    'content/fetchHero',
    async (_, { rejectWithValue }) => {
        try {
            return await api.heroContent()
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    },
    {
        condition: (_, { getState }) => {
            const c = getState().content
            return !c.heroLoaded && c.heroStatus !== 'loading'
        },
    }
)

export const fetchAboutContent = createAsyncThunk(
    'content/fetchAbout',
    async (_, { rejectWithValue }) => {
        try {
            return await api.aboutContent()
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    },
    {
        condition: (_, { getState }) => {
            const c = getState().content
            return !c.aboutLoaded && c.aboutStatus !== 'loading'
        },
    }
)

export const fetchContactContent = createAsyncThunk(
    'content/fetchContact',
    async (_, { rejectWithValue }) => {
        try {
            return await api.contactContent()
        } catch (err) {
            return rejectWithValue(toErrorPayload(err))
        }
    },
    {
        condition: (_, { getState }) => {
            const c = getState().content
            return !c.contactLoaded && c.contactStatus !== 'loading'
        },
    }
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
    initialState: {
        data: null,
        loaded: false,
        hero: null,
        heroLoaded: false,
        heroStatus: 'idle',
        about: null,
        aboutLoaded: false,
        aboutStatus: 'idle',
        contact: null,
        footer: null,
        contactLoaded: false,
        contactStatus: 'idle',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContent.fulfilled, (state, action) => {
                state.data = action.payload
                state.hero = action.payload?.hero || null
                state.about = action.payload?.about || null
                state.contact = action.payload?.contact || null
                state.footer = action.payload?.footer || null
                state.loaded = true
            })
            .addCase(fetchHeroContent.pending, (state) => {
                state.heroStatus = 'loading'
            })
            .addCase(fetchHeroContent.fulfilled, (state, action) => {
                state.hero = action.payload
                state.heroLoaded = true
                state.heroStatus = 'succeeded'
            })
            .addCase(fetchHeroContent.rejected, (state) => {
                state.heroStatus = 'failed'
            })
            .addCase(fetchAboutContent.pending, (state) => {
                state.aboutStatus = 'loading'
            })
            .addCase(fetchAboutContent.fulfilled, (state, action) => {
                state.about = action.payload
                state.aboutLoaded = true
                state.aboutStatus = 'succeeded'
            })
            .addCase(fetchAboutContent.rejected, (state) => {
                state.aboutStatus = 'failed'
            })
            .addCase(fetchContactContent.pending, (state) => {
                state.contactStatus = 'loading'
            })
            .addCase(fetchContactContent.fulfilled, (state, action) => {
                state.contact = action.payload?.contact || null
                state.footer = action.payload?.footer || null
                state.contactLoaded = true
                state.contactStatus = 'succeeded'
            })
            .addCase(fetchContactContent.rejected, (state) => {
                state.contactStatus = 'failed'
            })
            .addCase(updateContent.fulfilled, (state, action) => {
                state.data = action.payload
                state.hero = action.payload?.hero || null
                state.about = action.payload?.about || null
                state.contact = action.payload?.contact || null
                state.footer = action.payload?.footer || null
            })
    },
})

export default contentSlice.reducer
