import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  groundsData: [],
  countriesList: [],
  stateList: [],
  citiesList: [],
  error: '',
  loading: false,
  errorMsg: false,
  addEditLoading: false,
};

const GroundSlice = createSlice({
  name: 'Grounds',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action?.payload?.message;
      state.loading = false;
      state.addEditLoading = false;
      state.errorMsg = true;
    },
    groundFetchedSuccess(state, action) {
      state.groundsData = action.payload.data;
      state.loading = false;
      state.errorMsg = false;
    },
    fetchAllCountries(state, action) {
      state.countriesList = action.payload;
    },
    fetchStates(state, action) {
      state.stateList = action.payload;
    },
    fetchCities(state, action) {
      state.citiesList = action.payload;
    },
    starteLoader(state) {
      state.loading = true;
    },
    starteAddEditLoader(state) {
      state.addEditLoading = true;
    },
    groundUpdatedSuccess(state, action) {
      const updatedGround = action.payload;

      const index = state.groundsData.findIndex(
        (ground) => ground.id === updatedGround.id
      );

      if (index !== -1) {
        state.groundsData[index] = updatedGround;
      }
      state.addEditLoading = false;
      state.errorMsg = false;
    },
    groundDeletedSuccess(state, action) {
      const id = action.payload.id;
      state.groundsData = state.groundsData.filter(
        (ground) => ground.id !== id
      );
      state.addEditLoading = false;
      state.errorMsg = false;
    },
    groundImageDeletedSuccess(state, action) {
      const groundId = action.payload.groundId;
      const imgId = action.payload.imgId;

      const groundIndex = state.groundsData.findIndex(
        (ground) => ground.id === groundId
      );

      if (groundIndex !== -1) {
        state.groundsData[groundIndex].photos = state.groundsData[
          groundIndex
        ].photos.filter((photo) => photo.id !== imgId);
      }

      state.addEditLoading = false;
      state.errorMsg = false;
    },
    groundCreatedSuccess(state, action) {
      const newGround = action.payload;
      state.groundsData.push(newGround);
      state.addEditLoading = false;
      state.errorMsg = false;
    },
    resetGroundData(state) {
      state.groundsData = [];
    },
    LoaderOff(state) {
      state.addEditLoading = false;
      state.loading = false;
    },
    UpdatedImage(state, action) {
      const updatedImage = action.payload;
      const { ground_id, id, path } = updatedImage;
      const groundIndex = state.groundsData.findIndex(
        (ground) => ground.id === ground_id
      );
      if (groundIndex !== -1) {
        const photoIndex = state.groundsData[groundIndex].photos.findIndex(
          (photo) => photo.id === id
        );
        const updatedPhotos = state.groundsData[groundIndex].photos.map(
          (photo, index) => (index === photoIndex ? { ...photo, path } : photo)
        );
        const updatedGroundsData = state.groundsData.map((ground, index) =>
          index === groundIndex ? { ...ground, photos: updatedPhotos } : ground
        );
        return {
          ...state,
          groundsData: updatedGroundsData,
          addEditLoading: false,
          errorMsg: false,
        };
      }

      return state;
    },
  },
});
export const {
  apiError,
  groundFetchedSuccess,
  starteLoader,
  groundUpdatedSuccess,
  groundDeletedSuccess,
  groundCreatedSuccess,
  starteAddEditLoader,
  resetGroundData,
  LoaderOff,
  UpdatedImage,
  groundImageDeletedSuccess,
  fetchAllCountries,
  fetchStates,
  fetchCities,
} = GroundSlice.actions;

export default GroundSlice.reducer;
