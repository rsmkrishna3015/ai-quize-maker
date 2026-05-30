/* eslint-disable */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchQuestions = createAsyncThunk(
    'quizze/fetchQuestions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/quizer') /*fetch('http://127.0.0.1:8000/quizer') fetch('http://localhost:5000/questions') */
            if (!response.ok) {
                throw new Error('Failed to fetch questions')
            }
            const data = await response.json()
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const initialState = {
    questionIndex: 0,
    selectedAnswers: {},
    questions: [],
    loading: false,
    error: null,
    completed:false,
    isQuestionAnswered:false
}

const quizzeSlice = createSlice({
    name:"quizze",
    initialState:initialState,
    reducers:{
        nextQuestion(state, action){
            state.questionIndex = state.questionIndex + action.payload;
            state.isQuestionAnswered = false;
        },
        prevQuestion(state, action){
            state.questionIndex = state.questionIndex - action.payload;
        },
        selectedAnswer(state, action){
            const {currQstIndex, answerIndex} = action.payload;
            state.selectedAnswers[currQstIndex] = answerIndex;
            state.isQuestionAnswered = true;
        },
        submitQuiz(state, action){
            state.completed = true;
        },
        reset(state) {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.loading = false
                state.questions = action.payload
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { nextQuestion, prevQuestion, selectedAnswer, submitQuiz, reset } = quizzeSlice.actions

export default quizzeSlice.reducer