import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './slices/postsSlice'
import skillsReducer from './slices/skillsSlice'
import projectsReducer from './slices/projectsSlice'
import taxonomiesReducer from './slices/taxonomiesSlice'
import analyticsReducer from './slices/analyticsSlice'

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        skills: skillsReducer,
        projects: projectsReducer,
        taxonomies: taxonomiesReducer,
        analytics: analyticsReducer,
    },
})
