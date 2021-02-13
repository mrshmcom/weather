import {SET_FORECAST} from '../action/Forecast';

const initialState = {
  forecast: false,
};

const ForecastReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FORECAST:
      return {
        ...state,
        forecast: {
          ...action.forecast,
        },
      };

    default:
      return state;
  }
};

export default ForecastReducer;
