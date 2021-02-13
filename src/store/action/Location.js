export const SET_LOCATION = 'SET_LOCATION';
export const SET_GEO = 'SET_GEO';

export const SetLocation = (location) => {
  return {
    type: SET_LOCATION,
    location: location,
  };
};

export const SetGeo = (geo) => {
  return {
    type: SET_GEO,
    geo: geo,
  };
};
