import { createSlice } from '@reduxjs/toolkit';

const institutionSlice = createSlice({
  name: 'institution',
  initialState: {
    institutions: [],
    selectedInstitution: null,
    loading: false,
    error: null,
  },
  reducers: {
    setInstitutions: (state, action) => {
      state.institutions = action.payload;
    },
    setSelectedInstitution: (state, action) => {
      state.selectedInstitution = action.payload;
    },
  },
});

export const { setInstitutions, setSelectedInstitution } =
  institutionSlice.actions;

export default institutionSlice.reducer;
