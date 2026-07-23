import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './slices/postsSlice'
import skillsReducer from './slices/skillsSlice'
import taxonomiesReducer from './slices/taxonomiesSlice'
import analyticsReducer from './slices/analyticsSlice'

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        skills: skillsReducer,
        taxonomies: taxonomiesReducer,
        analytics: analyticsReducer,
    },
})
