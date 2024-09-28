// Include Both Helper File with needed methods
import {
  addNewGround as addNewGronudApi,
  addNewImage as addNewImageApi,
  bookSlot as bookSlotApi,
  deleteGroundImages as deleteGroundImageApi,
  deleteGround as deleteGroundtApi,
  getAllCountries as getAllCountriesApi,
  getAllGrounds as getAllGroundApi,
  getCitiesOfState as getCitiesOfStateApi,
  getGroundsBooking as getGroundsBookingApi,
  getGroundsSlot as getGroundsSlotApi,
  getGroundsSlotForBooking as getGroundsSlotForBookingApi,
  getIndividualGroundDetails as getIndividualGroundDetailsApi,
  getStatesOfCountry as getStatesOfCountryApi,
  updateGround as updateGroundApi,
  updateGroundsSlot as updateGroundsSlotApi,
} from '../../helpers/backend_helper';
import {
  LoaderOff,
  UpdatedImage,
  apiError,
  fetchAllCountries,
  fetchCities,
  fetchStates,
  groundCreatedSuccess,
  groundDeletedSuccess,
  groundFetchedSuccess,
  groundImageDeletedSuccess,
  groundUpdatedSuccess,
  resetGroundData,
  starteAddEditLoader,
  starteLoader,
} from './reducer';

export const getAllGroundsData = () => async (dispatch) => {
  try {
    dispatch(starteLoader());
    dispatch(resetGroundData());
    let response = await getAllGroundApi();

    if (response && response.status) {
      dispatch(groundFetchedSuccess(response));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const getGroundSlotData = (groundId) => async (dispatch) => {
  try {
    let response = await getGroundsSlotApi(groundId);

    if (response && response.status) {
      return response.data;
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const getGroundBookingData = (groundId) => async (dispatch) => {
  try {
    let response = await getGroundsBookingApi(groundId);

    if (response && response.status) {
      return response.data;
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const getGroundSlotForBookingData = (groundId) => async (dispatch) => {
  try {
    let response = await getGroundsSlotForBookingApi(groundId);

    if (response && response.status) {
      return response.data;
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const bookAvailableSlotByPartner =
  (bookingDetails) => async (dispatch) => {
    try {
      dispatch(starteLoader());
      let response = await bookSlotApi(bookingDetails);

      if (response && response.status) {
        dispatch(LoaderOff());
        return response.data;
      }
      dispatch(LoaderOff());
    } catch (error) {
      dispatch(LoaderOff());
      dispatch(apiError(error));
    }
  };

export const updateGroundSlotData = (updatedSlots) => async (dispatch) => {
  try {
    dispatch(starteAddEditLoader());
    let response = await updateGroundsSlotApi(updatedSlots);

    if (response && response.status) {
      dispatch(LoaderOff());
      return response.data;
    }
    dispatch(LoaderOff());
  } catch (error) {
    dispatch(LoaderOff());
    dispatch(apiError(error));
  }
};

export const updateGround = (category) => async (dispatch) => {
  try {
    dispatch(starteAddEditLoader());
    const response = await updateGroundApi(category);

    if (response.status) {
      dispatch(groundUpdatedSuccess(response.data));
      return true;
    } else {
      dispatch(apiError(response));
      return false;
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const deleteGround = (id) => async (dispatch) => {
  try {
    dispatch(starteAddEditLoader());
    const response = await deleteGroundtApi(id);

    if (response.status) {
      dispatch(groundDeletedSuccess(id));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const deleteImage = (id, groundId) => async (dispatch) => {
  try {
    dispatch(starteAddEditLoader());
    const response = await deleteGroundImageApi(id);
    dispatch(groundImageDeletedSuccess({ imgId: id, groundId: groundId }));

    if (response.status) {
      dispatch(LoaderOff());
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const addNewGround = (newGroundData) => async (dispatch) => {
  try {
    dispatch(starteAddEditLoader());
    const formData = new FormData();

    Object.keys(newGroundData).forEach((key) => {
      if (key !== 'photos') {
        formData.append(key, newGroundData[key]);
      }
    });

    newGroundData.photos.forEach((photo) => {
      formData.append('photos', photo);
    });
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const response = await addNewGronudApi(formData, headers);

    if (response.status) {
      dispatch(groundCreatedSuccess(response.data));
      return true;
    } else {
      dispatch(apiError(response));
      return false;
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const addNewImage =
  (newImage, indexToUpdate = null) =>
  async (dispatch) => {
    try {
      dispatch(starteAddEditLoader());
      const formData = new FormData();

      Object.keys(newImage).forEach((key) => {
        if (key !== 'photos') {
          formData.append(key, newImage[key]);
        }
      });

      newImage.photos.forEach((photo) => {
        formData.append('photos', photo);
      });
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      const response = await addNewImageApi(formData, headers);

      if (response.status) {
        const newImageData = {
          ...response.data[0],
          ground_id: newImage.ground_id,
        };
        if (indexToUpdate !== null) {
          dispatch(UpdatedImage(newImageData));
        }
        dispatch(LoaderOff());
        return newImageData;
      } else {
        dispatch(apiError(response));
      }
    } catch (error) {
      dispatch(apiError(error));
    }
  };
export const getAllCountries = () => async (dispatch) => {
  try {
    const response = await getAllCountriesApi();

    if (response.status) {
      const country = response.data.find(
        (country) => country?.name.toLowerCase() === 'india'
      );
      const transformedData = country
        ? [
            {
              label: country.name,
              value: country.id,
              phone_code: country.phone_code,
            },
          ]
        : [];
      dispatch(fetchAllCountries(transformedData));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};
export const getStatesOfCountry = (id) => async (dispatch) => {
  try {
    if (!id) {
      dispatch(fetchCities([]));
      return dispatch(fetchStates([]));
    }
    const response = await getStatesOfCountryApi({ country_id: id });
    if (response.status) {
      const transformedData = response.data.map((state) => ({
        label: state.name,
        value: state.id,
      }));
      dispatch(fetchStates(transformedData));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};
export const getCitiesOfState = (id) => async (dispatch) => {
  try {
    if (!id) {
      return dispatch(fetchCities([]));
    }
    const response = await getCitiesOfStateApi({ state_id: id });

    if (response.status) {
      const transformedData = response.data.map((city) => ({
        label: city.name,
        value: city.id,
      }));
      dispatch(fetchCities(transformedData));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};
export const getIndividualGroundData = (id) => async (dispatch) => {
  try {
    const response = await getIndividualGroundDetailsApi({ id: id });

    if (response.status) {
      return response.data;
    }
    return null;
  } catch (error) {
    dispatch(apiError(error));
  }
};
