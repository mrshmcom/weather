export const SET_SETTING = 'SET_SETTING';

export const setSetting = (setting) => {
  return {
    type: SET_SETTING,
    setting: setting,
  };
};
