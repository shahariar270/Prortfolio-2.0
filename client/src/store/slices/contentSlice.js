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
    {
        condition: (_, { getState }) => {
            const state = getState().content
            return !state.loaded && state.contentStatus !== 'loading'
        },
    }
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
            return !c.heroLoaded && !c.loaded && c.heroStatus !== 'loading' && c.contentStatus !== 'loading'
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
            return !c.aboutLoaded && !c.loaded && c.aboutStatus !== 'loading' && c.contentStatus !== 'loading'
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
            return !c.contactLoaded && !c.loaded && c.contactStatus !== 'loading' && c.contentStatus !== 'loading'
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

const DEFAULT_HERO = {
    status: 'Available for work · Jhenaidah, Bangladesh',
    headline: 'I build web applications with a focus on Engineering Fundamentals.',
    highlight: 'Engineering Fundamentals.',
    bio: 'WordPress developer transitioning into full stack software development. I build modern web applications using React, Node.js, Express, and MongoDB. My focus is on creating fast, scalable, and user-friendly web applications using clean architecture and software engineering principles.',
    roles: ['Founder @ Novakrift', 'Creator of Hisabox', 'MERN Stack Engineer', 'AI-Driven Developer'],
    stats: [
        { value: '10+', label: 'Core skills' },
        { value: '4', label: 'Shipped projects' },
        { value: '4', label: 'AI copilots' },
        { value: '24h', label: 'Response' },
    ],
}

const DEFAULT_ABOUT = {
    bio: "I'm a software developer whose professional journey began in 2018 with digital work, office productivity tools, content writing, and marketing. Around 2021–2022, I transitioned into software development and began expanding my skills across different programming languages, frameworks, and platforms. I worked as a web application developer specializing in WordPress customization and plugin development, and modern JavaScript-based technologies. I work with technologies including PHP, Laravel, C#, JavaScript, TypeScript, React, Next.js, and Node.js, depending on the project and its requirements. I'm interested in building practical web solutions, extending existing platforms through custom development, and creating digital products that solve real problems. I also continue to explore platforms like Shopify and AI-assisted development tools to expand my engineering skill set. My approach is grounded in understanding requirements, choosing appropriate technologies, writing maintainable code, and strengthening my engineering fundamentals behind the applications I build.",
    experience: [
        {
            title: 'Founder & Full-Stack Engineer',
            company: 'Novakrift',
            period: 'Present',
            points: ['Building high-performance MERN web platforms and scalable web products like Hisabox.'],
        },
    ],
    education: [
        { degree: 'B.Sc. in Computer Science & Engineering', status: 'currently pursuing' },
    ],
}

const DEFAULT_CONTACT = {
    intro: "Have a product to ship — or a codebase that needs AI-era velocity? Send a message; I reply within 24 hours.",
    email: 'dev.shahariar.official@gmail.com',
    phone: '+880 1410-270766',
    location: 'Jhenaidah, Bangladesh',
    social: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shahariar270/', icon: 'st-icon--linkedin' },
        { label: 'GitHub', href: 'https://github.com/shahariar270', icon: 'st-icon--github' },
        { label: 'Facebook', href: 'https://www.facebook.com/shahariar270/', icon: 'st-icon--facebook' },
    ],
}

const contentSlice = createSlice({
    name: 'content',
    initialState: {
        data: null,
        loaded: false,
        contentStatus: 'idle',
        hero: DEFAULT_HERO,
        heroLoaded: false,
        heroStatus: 'idle',
        about: DEFAULT_ABOUT,
        aboutLoaded: false,
        aboutStatus: 'idle',
        contact: DEFAULT_CONTACT,
        footer: '© 2026 Shahariar — Founder of Novakrift.',
        contactLoaded: false,
        contactStatus: 'idle',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContent.pending, (state) => {
                state.contentStatus = 'loading'
                if (!state.heroLoaded) state.heroStatus = 'loading'
                if (!state.aboutLoaded) state.aboutStatus = 'loading'
                if (!state.contactLoaded) state.contactStatus = 'loading'
            })
            .addCase(fetchContent.fulfilled, (state, action) => {
                const c = action.payload
                state.data = c
                if (c) {
                    if (c.hero) {
                        state.hero = { ...c.hero, resumeUrl: c.resumeUrl || c.hero?.resumeUrl || state.hero?.resumeUrl || '/resume.pdf' }
                    }
                    if (c.about) {
                        state.about = c.about
                    }
                    if (c.contact) {
                        state.contact = c.contact
                    }
                    if (c.footer) {
                        state.footer = c.footer
                    }
                }
                state.loaded = true
                state.heroLoaded = true
                state.aboutLoaded = true
                state.contactLoaded = true
                state.contentStatus = 'succeeded'
                state.heroStatus = 'succeeded'
                state.aboutStatus = 'succeeded'
                state.contactStatus = 'succeeded'
            })
            .addCase(fetchContent.rejected, (state) => {
                state.contentStatus = 'failed'
                state.heroStatus = 'failed'
                state.aboutStatus = 'failed'
                state.contactStatus = 'failed'
            })
            .addCase(fetchHeroContent.pending, (state) => {
                state.heroStatus = 'loading'
            })
            .addCase(fetchHeroContent.fulfilled, (state, action) => {
                if (action.payload) {
                    state.hero = action.payload
                }
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
                if (action.payload) {
                    state.about = action.payload
                }
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
                if (action.payload?.contact) {
                    state.contact = action.payload.contact
                }
                if (action.payload?.footer) {
                    state.footer = action.payload.footer
                }
                state.contactLoaded = true
                state.contactStatus = 'succeeded'
            })
            .addCase(fetchContactContent.rejected, (state) => {
                state.contactStatus = 'failed'
            })
            .addCase(updateContent.fulfilled, (state, action) => {
                const c = action.payload
                state.data = c
                if (c) {
                    if (c.hero) {
                        state.hero = { ...c.hero, resumeUrl: c.resumeUrl || c.hero?.resumeUrl || state.hero?.resumeUrl || '/resume.pdf' }
                    }
                    if (c.about) {
                        state.about = c.about
                    }
                    if (c.contact) {
                        state.contact = c.contact
                    }
                    if (c.footer) {
                        state.footer = c.footer
                    }
                }
                state.loaded = true
                state.heroLoaded = true
                state.aboutLoaded = true
                state.contactLoaded = true
            })
    },
})

export default contentSlice.reducer
