import {SET_LOCATION, SET_GEO} from '../action/Location';

const initialState = {
  location: false,
  geo: false,
};

const ForecastReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION:
      return {
        ...state,
        location: {
          ...action.location,
        },
      };

    case SET_GEO:
      return {
        ...state,
        geo: {
          ...action.geo,
        },
      };

    default:
      return state;
  }
};

export default ForecastReducer;
