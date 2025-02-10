import { createSlice } from "@reduxjs/toolkit";

const LOCAL_STORAGE_KEY = "CategoryList";

const initialState = {
  CategoryList: localStorage.getItem(LOCAL_STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    : [],
};

const StoreCategoryListRedux = createSlice({
  name: "CategoryList",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const { category } = action.payload;

      if (!category) return;
      const isDuplicate = state.CategoryList.some(
        (item) => item.category === category
      );
      if (isDuplicate) return;

      state.CategoryList.push({
        category: category,
        id: Date.now(),
      });

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(state.CategoryList)
      );
    },

    deleteList: (state, action) => {
      const { id } = action.payload;

      state.CategoryList = state.CategoryList.filter((item) => item.id !== id);

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(state.CategoryList)
      );
    },
  },
});

export const { addCategory, deleteList } = StoreCategoryListRedux.actions;
export default StoreCategoryListRedux.reducer;
