export const SET_FORECAST = 'SET_FORECAST';

export const SetForecast = (forecast) => {
  return {
    type: SET_FORECAST,
    forecast: forecast,
  };
};
