import { configureStore } from "@reduxjs/toolkit";
import VocabSlice from "./reducers/VocabSlice";
import CategorySlice from "./reducers/CategorySlice";
import AuthSlice from "./reducers/AuthSlice";

export const store = configureStore({
  reducer: {
    vocab: VocabSlice,
    category: CategorySlice,
    auth: AuthSlice,
  },
});
