import { configureStore } from '@reduxjs/toolkit';

import quizzesReducer from './quizzesSlice';

export const store = configureStore({
  reducer: {
    quizzes: quizzesReducer,
  },
});