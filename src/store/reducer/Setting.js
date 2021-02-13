import {SET_SETTING} from '../action/Setting';

const initialState = {
  setting: false,
};

const SettingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SETTING:
      return {
        ...state,
        setting: {
          ...action.setting,
        },
      };

    default:
      return state;
  }
};

export default SettingReducer;
