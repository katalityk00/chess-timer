import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import preferenceReducer from './slices/preferencesSlice';

export const store = configureStore({
  reducer: {
    preference: preferenceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;