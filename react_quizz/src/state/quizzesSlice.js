import { createSlice } from '@reduxjs/toolkit';
import  Quizzes  from './state'

const initialState = Quizzes

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    setQuizzesAction(state, action) {
      state.quizzes = action.payload;
    },
    addQuizAction(state, action) {
      state.quizzes.push(action.payload);
    },
    deleteQuizAction(state, action) {
      state.quizzes = state.quizzes.filter(q => q.id !== action.payload);
    },
    updateQuizAction(state, action) {
      const index = state.quizzes.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
    },
    setQuestionsAction(state, action) {
      state.questions = [...state.questions, ...action.payload];
    }
  }
});

export const { addQuizAction, deleteQuizAction, updateQuizAction, setQuestionsAction, setQuizzesAction } = quizzesSlice.actions;
export default quizzesSlice.reducer;