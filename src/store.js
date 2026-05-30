import { configureStore } from '@reduxjs/toolkit'
import quizzeReducer from './slices/QuizzeSlice'

const store = configureStore({
    reducer:{
        quizze: quizzeReducer
    }
})

export default store;